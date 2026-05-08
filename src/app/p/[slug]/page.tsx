import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts
    .filter((p) => p.source === "local")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Kiell Tampubolon`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

/* ── Gradient backgrounds per category ──────────────────────── */
const GRADIENT_MAP: Record<string, string> = {
  malware:    "linear-gradient(135deg, #0d0202 0%, #2a0808 80%)",
  redteam:    "linear-gradient(135deg, #020d04 0%, #082010 80%)",
  osint:      "linear-gradient(135deg, #020810 0%, #081c30 80%)",
  bugbounty:  "linear-gradient(135deg, #0d0800 0%, #271800 80%)",
  security:   "linear-gradient(135deg, #040d14 0%, #0a2030 80%)",
  default:    "linear-gradient(135deg, #080808 0%, #181818 80%)",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Malware":              "#dc2626",
  "Red Teaming":          "#16a34a",
  "OSINT":                "#0891b2",
  "Bug Bounty":           "#d97706",
  "Security":             "#0891b2",
  "Reverse Engineering":  "#7c3aed",
  "CTF":                  "#c026d3",
  "Pentesting":           "#ea580c",
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "#0891b2";
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="4" y1="11" x2="20" y2="11" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  const coverGrad = GRADIENT_MAP[post.coverGradient?.toLowerCase() ?? "default"] ?? GRADIENT_MAP.default;
  const coverStyle = post.coverImage
    ? { backgroundImage: `url(${post.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: coverGrad };

  return (
    <article className="main-article">
      {/* Hero cover image */}
      <div className="post-hero" style={coverStyle}>
        {!post.coverImage && (
          <div className="post-hero-overlay">
            <div className="post-hero-title">{post.title}</div>
          </div>
        )}
      </div>

      {/* Post header */}
      <div className="article-content-inner">
        {/* Categories */}
        <div className="article-category" style={{ marginBottom: 16 }}>
          {post.categories.map((cat) => (
            <a
              key={cat}
              href={`/categories/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, "-"))}`}
              className="category-badge"
              style={{ backgroundColor: getCategoryColor(cat) }}
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Title */}
        <h1 style={{ margin: "0 0 12px", fontSize: "2rem", lineHeight: 1.25 }}>
          {post.title}
        </h1>

        {/* Description */}
        {post.description && (
          <p style={{ color: "var(--card-text-color-secondary)", margin: "0 0 16px", fontSize: "1.0625rem", lineHeight: 1.6 }}>
            {post.description}
          </p>
        )}

        {/* Meta */}
        <div className="article-time" style={{ marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid var(--card-separator-color)" }}>
          <div><CalendarIcon /><time dateTime={post.date}>{post.dateFormatted}</time></div>
          <div><ClockIcon /><span>{post.readingTime} min read</span></div>
        </div>

        {/* Article body */}
        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--card-separator-color)" }}>
            <div style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--card-text-color-tertiary)", marginBottom: 12 }}>
              Tags
            </div>
            <div className="article-tags">
              {post.tags.map((t) => (
                <a
                  key={t}
                  href={`/tags/${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}`}
                  className="tag"
                >
                  {t}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related content */}
      {related.length > 0 && (
        <div style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
          <div style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--card-text-color-tertiary)", marginBottom: 16 }}>
            Related Content
          </div>
          <div className="related-grid">
            {related.map((r) => (
              <a
                key={r.slug}
                href={r.source === "devto" && r.devtoUrl ? r.devtoUrl : `/p/${r.slug}`}
                target={r.source === "devto" ? "_blank" : undefined}
                rel={r.source === "devto" ? "noopener noreferrer" : undefined}
                className="related-card"
              >
                <div
                  className="related-card-cover"
                  style={
                    r.coverImage
                      ? { backgroundImage: `url(${r.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
                      : { background: GRADIENT_MAP[r.coverGradient?.toLowerCase() ?? "default"] ?? GRADIENT_MAP.default }
                  }
                >
                  {!r.coverImage && (
                    <span className="related-card-title-overlay">{r.title}</span>
                  )}
                </div>
                <div className="related-card-body">
                  <div style={{ fontWeight: 600, color: "var(--card-text-color-main)", fontSize: "0.875rem", lineHeight: 1.4 }}>
                    {r.title}
                  </div>
                  {r.categories[0] && (
                    <div style={{ color: "var(--card-text-color-tertiary)", fontSize: "0.75rem", marginTop: 4 }}>
                      {r.categories[0]}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia</div>
      </footer>
    </article>
  );
}
