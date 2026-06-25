import { StaticShell, StaticHeading } from "@/components/layout/static-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on goals, AI coaching, and building a better life — from the Buildr team.",
};

const posts = [
  {
    tag: "Productivity",
    title: "Why most goal-setting advice is wrong (and what actually works)",
    excerpt: "SMART goals, vision boards, OKRs — we've all tried them. Here's what the research actually says about how humans build lasting habits.",
    author: "Alex Rivera",
    date: "June 18, 2026",
    readTime: "6 min read",
  },
  {
    tag: "AI",
    title: "Introducing the Digital Twin: an AI model that learns you",
    excerpt: "Today we're shipping the most ambitious feature we've ever built. Here's the story behind it, and what it means for your goals.",
    author: "Jordan Kim",
    date: "June 10, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    tag: "Mindset",
    title: "The 1% rule: how tiny daily actions compound into massive results",
    excerpt: "James Clear popularized the idea. We've built an entire product around it. Here's the math, the science, and how to put it into practice.",
    author: "Sofia Martins",
    date: "May 29, 2026",
    readTime: "5 min read",
  },
  {
    tag: "Features",
    title: "Daily Big 3: the simplest productivity system we've ever seen work",
    excerpt: "Three high-impact actions, every day. No more 30-item to-do lists. Here's why constraints make you more productive, not less.",
    author: "Liam Okafor",
    date: "May 14, 2026",
    readTime: "4 min read",
  },
  {
    tag: "Career",
    title: "How to set career goals that don't feel arbitrary in 6 months",
    excerpt: "Most career goals are written during performance reviews and forgotten by February. We analyzed thousands of goals to find the ones that stick.",
    author: "Alex Rivera",
    date: "April 30, 2026",
    readTime: "7 min read",
  },
  {
    tag: "Wellbeing",
    title: "Your sleep and your goals are more connected than you think",
    excerpt: "We looked at anonymized Buildr data across 10,000 users. The correlation between sleep quality and goal completion rate is striking.",
    author: "Liam Okafor",
    date: "April 12, 2026",
    readTime: "5 min read",
  },
];

export default function BlogPage() {
  const [featured, ...rest] = [...posts].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  return (
    <StaticShell maxWidth="max-w-3xl">
      <StaticHeading
        label="Blog"
        title="Insights on goals, AI, and building a better life."
        subtitle="From the Buildr team — published when we have something worth saying."
      />

      {/* Featured post */}
      {featured && (
        <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 mb-6 cursor-pointer hover:bg-neutral-800 transition-colors group">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-white/10 px-2.5 py-1 rounded-full mb-4">
            {featured.tag}
          </span>
          <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug mb-3 group-hover:opacity-80 transition-opacity">
            {featured.title}
          </h2>
          <p className="text-neutral-400 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
          <div className="flex items-center gap-3 text-neutral-500 text-xs">
            <span>{featured.author}</span>
            <span>·</span>
            <span>{featured.date}</span>
            <span>·</span>
            <span>{featured.readTime}</span>
          </div>
        </div>
      )}

      {/* Post grid */}
      <div className="space-y-3">
        {rest.map((post) => (
          <div
            key={post.title}
            className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-400 transition-colors cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
                  {post.tag}
                </span>
                <h3 className="text-neutral-900 font-semibold text-sm mb-2 leading-snug group-hover:text-neutral-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-3 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-3 text-neutral-400 text-xs">
                  <span>{post.author}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-neutral-400 text-sm">More articles coming soon — we publish when we have something worth reading.</p>
      </div>
    </StaticShell>
  );
}
