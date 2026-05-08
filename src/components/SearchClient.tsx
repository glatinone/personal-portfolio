"use client";

import { useState, useEffect, useCallback } from "react";
import type { PostMeta } from "@/lib/posts";

interface Props {
  posts: PostMeta[];
  initialQuery?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Malware":             "#dc2626",
  "Red Teaming":         "#16a34a",
  "OSINT":               "#0891b2",
  "Bug Bounty":          "#d97706",
  "Security":            "#0891b2",
  "Reverse Engineering": "#7c3aed",
  "CTF":                 "#c026d3",
  "Pentesting":          "#ea580c",
};

function getCategoryColor(cat: string): string {
  return CATEGORY_COLORS[cat] ?? "#0891b2";
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="4" y1="11" x2="20" y2="11" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none">
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="15" y2="15" />
    </svg>
  );
}

function matchesQuery(post: PostMeta, q: string): boolean {
  const query = q.toLowerCase().trim();
  if (!query) return true;
  return (
    post.title.toLowerCase().includes(query) ||
    post.description.toLowerCase().includes(query) ||
    post.categories.some((c) => c.toLowerCase().includes(query)) ||
    post.tags.some((t) => t.toLowerCase().includes(query))
  );
}

export default function SearchClient({ posts, initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<PostMeta[]>([]);

  const runSearch = useCallback(
    (q: string) => {
      setResults(posts.filter((p) => matchesQuery(p, q)));
    },
    [posts]
  );

  useEffect(() => {
    runSearch(query);
  }, [query, runSearch]);

  const hasQuery = query.trim().length > 0;

  return (
    <>
      {/* Search input */}
      <div className="search-box">
        <input
          type="search"
          className="search-box-input"
          placeholder="Search by title, category, or tag..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          autoComplete="off"
        />
        <span className="search-box-icon">
          <SearchIcon />
        </span>
      </div>

      {/* Results count */}
      {hasQuery && (
        <p className="search-results-count">
          {results.length === 0
            ? "No results"
            : `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {/* Results list */}
      {hasQuery && results.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--section-separation)" }}>
          {results.map((post) => {
            const href =
              post.source === "devto" && post.devtoUrl
                ? post.devtoUrl
                : `/p/${post.slug}`;
            const isExternal = post.source === "devto";

            return (
              <article
                key={post.slug}
                style={{
                  background: "var(--card-background)",
                  borderRadius: "var(--card-border-radius)",
                  boxShadow: "var(--shadow-l1)",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
              >
                <div style={{ padding: "var(--card-padding)", display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Category badges */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                      <span className="category-badge" style={{ backgroundColor: "#6b21a8" }}>dev.to</span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.3 }}>
                    <a
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      style={{ color: "var(--card-text-color-main)", textDecoration: "none" }}
                    >
                      {post.title}
                    </a>
                  </h2>

                  {/* Description */}
                  {post.description && (
                    <p style={{ margin: 0, color: "var(--card-text-color-secondary)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                      {post.description}
                    </p>
                  )}

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {post.tags.map((t) => (
                        <a
                          key={t}
                          href={`/tags/${encodeURIComponent(t.toLowerCase().replace(/\s+/g, "-"))}`}
                          className="tag"
                          style={{ fontSize: "0.8rem", padding: "4px 10px" }}
                        >
                          {t}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--card-text-color-tertiary)", flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8125rem" }}>
                      <CalendarIcon />
                      <time dateTime={post.date}>{post.dateFormatted}</time>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8125rem" }}>
                      <ClockIcon />
                      {post.readingTime} min read
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty state — no query yet */}
      {!hasQuery && (
        <div className="search-empty">
          <div className="search-empty-icon">🔍</div>
          <p className="search-empty-title">Type to search</p>
          <p className="search-empty-text">
            Search across {posts.length} post{posts.length !== 1 ? "s" : ""} by title, category, or tag
          </p>
        </div>
      )}

      {/* Empty state — no results */}
      {hasQuery && results.length === 0 && (
        <div className="search-empty">
          <div className="search-empty-icon">∅</div>
          <p className="search-empty-title">No results found</p>
          <p className="search-empty-text">Try a different keyword or browse by category</p>
        </div>
      )}
    </>
  );
}
