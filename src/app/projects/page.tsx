import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Kiell Tampubolon",
};

/* ── Terminal covers ─────────────────────────────────────────── */

function CoverVulnScan() {
  return (
    <div className="cover-wrap" style={{ background: "linear-gradient(135deg, #050d07 0%, #0c2014 60%, #050d07 100%)" }}>
      <div className="cover-terminal">
        <div style={{ color: "rgba(255,255,255,0.38)" }}>$ vulnscan --url target.corp --owasp --deep</div>
        <div style={{ color: "rgba(255,255,255,0.58)" }}>[*] Crawling 247 endpoints...</div>
        <div style={{ color: "#f87171" }}>[!] CRITICAL &nbsp;SQLi → /api/v1/users?id=1&apos;</div>
        <div style={{ color: "#fbbf24" }}>[!] HIGH &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Stored XSS → /comments/new</div>
        <div style={{ color: "rgba(255,255,255,0.45)" }}>[~] Nuclei: 8 templates matched</div>
        <div style={{ color: "#22c55e" }}>[✓] SARIF report generated &nbsp;| CVSSv3: 8.1</div>
      </div>
    </div>
  );
}

function CoverSentinelScout() {
  return (
    <div className="cover-wrap" style={{ background: "linear-gradient(135deg, #03070f 0%, #091a30 60%, #03070f 100%)" }}>
      <div className="cover-terminal">
        <div style={{ color: "rgba(255,255,255,0.38)" }}>$ sentinelscout --target malware-c2.xyz --all</div>
        <div style={{ color: "rgba(255,255,255,0.58)" }}>[*] Querying 5 threat feeds simultaneously...</div>
        <div style={{ color: "#60a5fa" }}>[✓] VirusTotal &nbsp;53/72 engines → MALICIOUS</div>
        <div style={{ color: "#f87171" }}>[!] Shodan &nbsp;&nbsp;&nbsp;port 4444 open (Meterpreter C2?)</div>
        <div style={{ color: "#f87171" }}>[!] OTX &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;APT34 campaign indicator match</div>
        <div style={{ color: "#60a5fa" }}>[✓] Report complete &nbsp;3.2s</div>
      </div>
    </div>
  );
}

function CoverOSINTScout() {
  return (
    <div className="cover-wrap" style={{ background: "linear-gradient(135deg, #030b12 0%, #071c2e 60%, #030b12 100%)" }}>
      <div className="cover-terminal">
        <div style={{ color: "rgba(255,255,255,0.38)" }}>$ osintscout --target &quot;glatinone&quot; --all</div>
        <div style={{ color: "rgba(255,255,255,0.58)" }}>[*] Scraping 4 platforms asynchronously...</div>
        <div style={{ color: "#38bdf8" }}>[✓] GitHub &nbsp;&nbsp;&nbsp;14 public repos &nbsp;· 2.3k contributions</div>
        <div style={{ color: "#38bdf8" }}>[✓] LinkedIn &nbsp;Jakarta, Indonesia · Cybersecurity</div>
        <div style={{ color: "rgba(255,255,255,0.45)" }}>[~] X/Twitter @glatinone active (est.)</div>
        <div style={{ color: "#38bdf8" }}>[✓] Profile mapped &nbsp;1.8s</div>
      </div>
    </div>
  );
}

function CoverBugBounty() {
  return (
    <div className="cover-wrap" style={{ background: "linear-gradient(135deg, #0d0a02 0%, #211600 60%, #0d0a02 100%)" }}>
      <div className="cover-terminal">
        <div style={{ color: "rgba(255,255,255,0.38)" }}>$ bugtracker stats --all-time --pretty</div>
        <div style={{ color: "rgba(255,165,0,0.35)" }}>┌──────────────────────────────────────┐</div>
        <div style={{ color: "#fbbf24" }}>│ HackerOne &nbsp;&nbsp; ██████░░ &nbsp;12 submissions │</div>
        <div style={{ color: "#fbbf24" }}>│ Bugcrowd &nbsp;&nbsp;&nbsp; █████░░░ &nbsp; 8 submissions │</div>
        <div style={{ color: "#10b981" }}>│ Total earned &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $2,400 bounties &nbsp;│</div>
        <div style={{ color: "rgba(255,165,0,0.35)" }}>└──────────────────────────────────────┘</div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    title: "VulnScan",
    subtitle: "AI-powered web vulnerability scanner",
    description:
      "OWASP Top 10 detection, AI-assisted triage, JSON/SARIF output, and rich terminal dashboard. Built for security engineers who need fast, actionable results. Integrates directly into CI/CD pipelines.",
    category: "Security",
    tags: ["OWASP Top 10", "AI Triage", "CI/CD Ready", "SARIF"],
    slug: "vulnscan",
    year: "2025",
    cover: <CoverVulnScan />,
  },
  {
    title: "SentinelScout",
    subtitle: "Multi-source OSINT & threat intelligence aggregator",
    description:
      "Queries VirusTotal, AlienVault OTX, Shodan, NVD CVE, and GitHub Advisories simultaneously. Async, fast, AI-analyzed results with a rich terminal dashboard built on Textual.",
    category: "Threat Intel",
    tags: ["OSINT", "5+ Sources", "Async", "AI Analysis"],
    slug: "sentinelscout",
    year: "2025",
    cover: <CoverSentinelScout />,
  },
  {
    title: "OSINTScout",
    subtitle: "Unified social media OSINT CLI",
    description:
      "Scrape public profiles from X, Instagram, and LinkedIn for threat intelligence and reconnaissance. Async, modular, structured JSON output. No auth required — public data only.",
    category: "Recon",
    tags: ["Social Media", "Threat Intel", "JSON", "No-Auth"],
    slug: "osintscout",
    year: "2025",
    cover: <CoverOSINTScout />,
  },
  {
    title: "Bug Bounty Tracker",
    subtitle: "Personal CLI dashboard for bug bounty hunting",
    description:
      "Local CLI tracker for submissions across HackerOne, Bugcrowd, and more. Tracks status, bounty amounts, resolution time, and streaks. Fully private — no server, no cloud.",
    category: "Tooling",
    tags: ["HackerOne", "Stats Dashboard", "Streak Tracking", "Private"],
    slug: "bugbounty-tracker",
    year: "2025",
    cover: <CoverBugBounty />,
  },
];

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.33" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="4" y1="11" x2="20" y2="11" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.33" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <polyline points="7 8 3 12 7 16" />
      <polyline points="17 8 21 12 17 16" />
      <line x1="14" y1="4" x2="10" y2="20" />
    </svg>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <div className="article-content-inner" style={{
        background: "var(--card-background)",
        borderRadius: "var(--card-border-radius)",
        boxShadow: "var(--shadow-l1)",
        marginBottom: "var(--section-separation)",
      }}>
        <h1 style={{ margin: "0 0 8px" }}>Projects</h1>
        <p style={{ color: "var(--card-text-color-secondary)", margin: 0 }}>
          Open-source security tooling built for real offensive work.
          All projects available on <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </div>

      <div className="article-list">
        {PROJECTS.map((p) => (
          <article className="article-card" key={p.slug}>
            <a
              href={`https://github.com/glatinone/${p.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="article-image"
              style={{ display: "block" }}
            >
              {p.cover}
            </a>
            <div className="article-details">
              <div className="article-category">
                <span className="category-badge">{p.category}</span>
              </div>
              <div className="article-title-wrapper">
                <h2 className="article-title">
                  <a href={`https://github.com/glatinone/${p.slug}`} target="_blank" rel="noopener noreferrer">
                    {p.title}
                  </a>
                </h2>
                <p className="article-subtitle">{p.subtitle}</p>
              </div>
              <p style={{ color: "var(--card-text-color-secondary)", margin: 0, fontSize: "0.9375rem", lineHeight: 1.65 }}>
                {p.description}
              </p>
              <div className="article-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
              <div className="article-time">
                <div><CalendarIcon /><time>{p.year}</time></div>
                <div>
                  <CodeIcon />
                  <a href={`https://github.com/glatinone/${p.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ fontFamily: "var(--code-font-family)", fontSize: "0.8125rem" }}>
                    github.com/glatinone/{p.slug}
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="site-footer">
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia · <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">@glatinone</a></div>
      </footer>
    </>
  );
}
