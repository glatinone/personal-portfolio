import type { Metadata } from "next";
import { getAllPosts, getPostsByTag, getTags } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getTags();
  return tags.map((t) => ({
    tag: t.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const label = decodeURIComponent(tag).replace(/-/g, " ");
  return { title: `Tag: ${label} — Kiell Tampubolon` };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const label = decodeURIComponent(tag).replace(/-/g, " ");
  const posts = await getPostsByTag(label);

  return (
    <>
      <div className="article-content-inner" style={{
        background: "var(--card-background)",
        borderRadius: "var(--card-border-radius)",
        boxShadow: "var(--shadow-l1)",
        marginBottom: "var(--section-separation)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.5rem", color: "var(--card-text-color-tertiary)" }}>#</span>
          <h1 style={{ margin: 0, textTransform: "capitalize" }}>{label}</h1>
        </div>
        <p style={{ color: "var(--card-text-color-secondary)", margin: "8px 0 0" }}>
          {posts.length} post{posts.length !== 1 ? "s" : ""} tagged with &ldquo;{label}&rdquo;
        </p>
      </div>

      <div className="article-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <footer className="site-footer">
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia</div>
      </footer>
    </>
  );
}
