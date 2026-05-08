import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const metadata: Metadata = {
  title: "Archives — Kiell Tampubolon",
};

export default async function ArchivesPage() {
  const posts = await getAllPosts();

  // Group by year
  const byYear = new Map<number, typeof posts>();
  posts.forEach((p) => {
    const year = new Date(p.date).getFullYear();
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year)!.push(p);
  });

  const years = Array.from(byYear.keys()).sort((a, b) => b - a);

  return (
    <article className="main-article">
      <div className="article-content-inner">
        <h1>Archives</h1>
        <p>{posts.length} posts across {years.length} year{years.length !== 1 ? "s" : ""}.</p>
      </div>

      {years.map((year) => (
        <div key={year}>
          <div style={{
            padding: "12px var(--card-padding)",
            borderTop: "1px solid var(--card-separator-color)",
          }}>
            <h2 style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--card-text-color-tertiary)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <span style={{ fontFamily: "var(--code-font-family)", color: "var(--category-color)" }}>∞</span>
              {year}
              <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "var(--card-text-color-tertiary)" }}>
                ({byYear.get(year)!.length})
              </span>
            </h2>
          </div>
          <div className="archive-list">
            {byYear.get(year)!.map((post) => (
              <a
                key={post.slug}
                href={post.source === "devto" && post.devtoUrl ? post.devtoUrl : `/p/${post.slug}`}
                target={post.source === "devto" ? "_blank" : undefined}
                rel={post.source === "devto" ? "noopener noreferrer" : undefined}
                className="archive-item"
              >
                <span className="archive-date">{post.dateFormatted}</span>
                <span className="archive-title">{post.title}</span>
                {post.categories[0] && (
                  <span className="archive-cat">{post.categories[0]}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      ))}

      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia</div>
      </footer>
    </article>
  );
}
