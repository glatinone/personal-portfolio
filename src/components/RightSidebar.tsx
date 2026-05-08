import { getCategories, getTags, getArchives } from "@/lib/posts";

/* ── Icons ─────────────────────────────────────────────────── */

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="3" y="4" width="18" height="4" rx="2" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

function CategoryIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 4h-4a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2" />
      <path d="M17 4h-2a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2" />
      <path d="M9 16h-4a2 2 0 0 0 -2 2v2h8v-2a2 2 0 0 0 -2 -2" />
      <path d="M15 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M19 18h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-2" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M11 3l9 9a1.5 1.5 0 0 1 0 2l-6 6a1.5 1.5 0 0 1 -2 0l-9 -9v-4a3 3 0 0 1 3 -3h4" />
      <circle cx="9" cy="9" r="2" />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────── */

export default async function RightSidebar() {
  const [categories, tags, archives] = await Promise.all([
    getCategories(),
    getTags(),
    getArchives(),
  ]);

  return (
    <>
      {/* Search */}
      <section className="widget">
        <div className="widget-title">
          <div className="widget-icon"><SearchIcon /></div>
          Search
        </div>
        <form action="/search" method="GET">
          <input
            className="widget-search-input"
            type="search"
            name="q"
            placeholder="Search articles..."
            autoComplete="off"
          />
        </form>
      </section>

      {/* Archives */}
      {archives.length > 0 && (
        <section className="widget">
          <div className="widget-title">
            <div className="widget-icon"><ArchiveIcon /></div>
            Archives
          </div>
          <div className="widget-archive-list">
            {archives.map((a) => (
              <a key={a.year} href="/archives" className="widget-archive-item">
                <span className="widget-archive-year">{a.year}</span>
                <span className="widget-archive-count">{a.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="widget">
          <div className="widget-title">
            <div className="widget-icon"><CategoryIcon /></div>
            Categories
          </div>
          <div className="widget-tags">
            {categories.map((c) => (
              <a
                key={c.name}
                href={`/categories/${encodeURIComponent(c.name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="tag"
              >
                {c.name}
                <span className="tag-count">{c.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <section className="widget">
          <div className="widget-title">
            <div className="widget-icon"><TagIcon /></div>
            Tags
          </div>
          <div className="widget-tags">
            {tags.map((t) => (
              <a
                key={t.name}
                href={`/tags/${encodeURIComponent(t.name.toLowerCase().replace(/\s+/g, "-"))}`}
                className="tag"
              >
                {t.name}
                <span className="tag-count">{t.count}</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
