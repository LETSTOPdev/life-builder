#!/bin/bash
# Buildr → GitHub → Railway deploy script
# Run once from the buildr directory: bash deploy.sh

set -e
cd "$(dirname "$0")"

echo "🚀 Buildr Deploy Script"
echo "========================"

# 1. Remove any stale git lock
rm -f .git/index.lock
echo "✓ Cleared git locks"

# 2. Stage everything
git add -A
echo "✓ Staged all files"

# 3. Commit
git commit -m "Add Railway deployment config + production fixes

- railway.toml: Nixpacks build, health check, restart policy
- nixpacks.toml: Node 20 + Python/gcc for better-sqlite3 native module
- package.json: bind to 0.0.0.0 for Railway container networking
- .gitignore: track .env.local.example, exclude /data/ (SQLite volume)
- .env.local.example: reference for Railway env vars"
echo "✓ Committed"

# 4. Set remote (already configured)
REMOTE_URL="https://github.com/LETSTOPdev/life-builder.git"
if git remote get-url origin 2>/dev/null; then
  echo "✓ Remote origin: $REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
  echo "✓ Remote added: $REMOTE_URL"
fi

# 5. Push
git branch -M main
git push -u origin main
echo "✓ Pushed to GitHub"

echo ""
echo "✅ Done! Now go to https://railway.app/new"
echo "   → Deploy from GitHub repo"
echo "   → Select: YOUR_USERNAME/life-builder"
echo "   → Add env vars (see .env.local.example)"
