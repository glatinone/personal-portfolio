import type { Metadata } from "next";
import { getCategories, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({
    category: c.name.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = decodeURIComponent(category).replace(/-/g, " ");
  return { title: `${label} — Kiell Tampubolon` };
}

const CATEGORY_COLORS: Record<string, string> = {
  "malware":              "#dc2626",
  "red teaming":          "#16a34a",
  "osint":                "#0891b2",
  "bug bounty":           "#d97706",
  "security":             "#0891b2",
  "reverse engineering":  "#7c3aed",
  "ctf":                  "#c026d3",
  "pentesting":           "#ea580c",
};

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const label = decodeURIComponent(category).replace(/-/g, " ");
  const posts = await getPostsByCategory(label);
  const color = CATEGORY_COLORS[label.toLowerCase()] ?? "#0891b2";

  return (
    <>
      <div className="article-content-inner" style={{
        background: "var(--card-background)",
        borderRadius: "var(--card-border-radius)",
        boxShadow: "var(--shadow-l1)",
        marginBottom: "var(--section-separation)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className="category-badge"
            style={{ backgroundColor: color, fontSize: "1rem" }}
          >
            {label}
          </span>
        </div>
        <p style={{ color: "var(--card-text-color-secondary)", margin: "12px 0 0" }}>
          {posts.length} post{posts.length !== 1 ? "s" : ""} in this category
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
