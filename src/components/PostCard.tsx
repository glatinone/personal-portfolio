import type { PostMeta } from "@/lib/posts";

/* ── Gradient cover backgrounds per category ─────────────────── */
const GRADIENT_MAP: Record<string, string> = {
  malware:    "linear-gradient(135deg, #0d0202 0%, #2a0808 60%, #0d0202 100%)",
  redteam:    "linear-gradient(135deg, #020d04 0%, #082010 60%, #020d04 100%)",
  osint:      "linear-gradient(135deg, #020810 0%, #081c30 60%, #020810 100%)",
  bugbounty:  "linear-gradient(135deg, #0d0800 0%, #271800 60%, #0d0800 100%)",
  security:   "linear-gradient(135deg, #040d14 0%, #0a2030 60%, #040d14 100%)",
  default:    "linear-gradient(135deg, #080808 0%, #181818 60%, #080808 100%)",
};

function getCoverStyle(post: PostMeta): React.CSSProperties {
  if (post.coverImage) return { backgroundImage: `url(${post.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" };
  const key = post.coverGradient?.toLowerCase() ?? "default";
  return { background: GRADIENT_MAP[key] ?? GRADIENT_MAP.default };
}

/* ── Category colour accents ──────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  "Malware":           "#dc2626",
  "Red Teaming":       "#16a34a",
  "OSINT":             "#0891b2",
  "Bug Bounty":        "#d97706",
  "Security":          "#0891b2",
  "Reverse Engineering": "#7c3aed",
  "CTF":               "#c026d3",
  "Pentesting":        "#ea580c",
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "#0891b2";
}

/* ── Icons ─────────────────────────────────────────────────────── */
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

/* ── Component ─────────────────────────────────────────────────── */
interface Props {
  post: PostMeta;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  const href = post.source === "devto" && post.devtoUrl
    ? post.devtoUrl
    : `/p/${post.slug}`;
  const isExternal = post.source === "devto";

  return (
    <article className={`article-card${featured ? " article-card--featured" : ""}`}>
      {/* Cover image */}
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="article-image"
        style={{ display: "block" }}
        aria-label={post.title}
      >
        <div
          className="cover-wrap"
          style={getCoverStyle(post)}
        >
          {/* Show gradient cover with title overlay for non-image posts */}
          {!post.coverImage && (
            <div className="cover-text-overlay">
              <div className="cover-overlay-title">{post.title}</div>
            </div>
          )}
        </div>
      </a>

      {/* Card body */}
      <div className="article-details">
        {/* Categories */}
        <div className="article-category">
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
          {isExternal && (
            <span className="category-badge" style={{ backgroundColor: "#6b21a8", marginLeft: 4 }}>
              dev.to
            </span>
          )}
        </div>

        {/* Title + subtitle */}
        <div className="article-title-wrapper">
          <h2 className="article-title">
            <a
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
            >
              {post.title}
            </a>
          </h2>
          {post.description && (
            <p className="article-subtitle">{post.description}</p>
          )}
        </div>

        {/* Meta: date + reading time */}
        <div className="article-time">
          <div>
            <CalendarIcon />
            <time dateTime={post.date}>{post.dateFormatted}</time>
          </div>
          <div>
            <ClockIcon />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
}
