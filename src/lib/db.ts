import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// RAILWAY_VOLUME_MOUNT_PATH is set automatically when a Railway Volume is attached.
// Falls back to ./data for local development.
const DB_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH ?? path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "buildr.db");

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;
  fs.mkdirSync(DB_DIR, { recursive: true });
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  migrate(_db);
  return _db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'free',
      timezone TEXT NOT NULL DEFAULT 'UTC-5 (New York)',
      bio TEXT NOT NULL DEFAULT '',
      avatar TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      weekly_review INTEGER NOT NULL DEFAULT 1,
      goal_alerts INTEGER NOT NULL DEFAULT 1,
      ai_insights INTEGER NOT NULL DEFAULT 1,
      email_digest INTEGER NOT NULL DEFAULT 0,
      streak_reminders INTEGER NOT NULL DEFAULT 1,
      coach_messages INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Other',
      progress INTEGER NOT NULL DEFAULT 0,
      days_left INTEGER NOT NULL,
      streak INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS journal_entries (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      mood TEXT NOT NULL DEFAULT 'okay',
      content TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '[]',
      insight TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS coach_messages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
    CREATE INDEX IF NOT EXISTS idx_journal_user ON journal_entries(user_id);
    CREATE INDEX IF NOT EXISTS idx_coach_user ON coach_messages(user_id);

    -- Stripe columns (added via ALTER TABLE so they don't break existing DBs)
  `);

  // Safely add columns that don't exist yet
  const cols = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  const colNames = cols.map((c) => c.name);
  if (!colNames.includes("stripe_customer_id")) {
    db.exec("ALTER TABLE users ADD COLUMN stripe_customer_id TEXT");
  }
  if (!colNames.includes("stripe_subscription_id")) {
    db.exec("ALTER TABLE users ADD COLUMN stripe_subscription_id TEXT");
  }
  if (!colNames.includes("onboarding_summary")) {
    db.exec("ALTER TABLE users ADD COLUMN onboarding_summary TEXT NOT NULL DEFAULT ''");
  }
  // token_version enables server-side session revocation (logout, password change).
  if (!colNames.includes("token_version")) {
    db.exec("ALTER TABLE users ADD COLUMN token_version INTEGER NOT NULL DEFAULT 1");
  }
  // auth_provider replaces the fragile oauth_google_ password sentinel.
  if (!colNames.includes("auth_provider")) {
    db.exec("ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'local'");
    db.exec("UPDATE users SET auth_provider = 'google' WHERE password LIKE 'oauth_google_%'");
  }

  // Password reset tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens(token);
  `);
}
