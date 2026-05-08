import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search — Kiell Tampubolon",
  description: "Search across all posts by title, category, or tag.",
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const allPosts = await getAllPosts();

  // Strip full content — only pass metadata to the client bundle
  const posts = allPosts.map(({ content: _c, rawContent: _r, ...meta }) => meta);

  return (
    <>
      <div
        className="article-content-inner"
        style={{
          background: "var(--card-background)",
          borderRadius: "var(--card-border-radius)",
          boxShadow: "var(--shadow-l1)",
          marginBottom: "var(--section-separation)",
        }}
      >
        <h1 style={{ margin: "0 0 8px" }}>Search</h1>
        <p style={{ color: "var(--card-text-color-secondary)", margin: 0 }}>
          {posts.length} post{posts.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <SearchClient posts={posts} initialQuery={q ?? ""} />

      <footer className="site-footer">
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia</div>
      </footer>
    </>
  );
}
