import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Kiell Tampubolon",
};

const LINKS = [
  {
    href: "https://github.com/glatinone",
    title: "GitHub",
    handle: "@glatinone",
    desc: "Open-source tools and projects",
    bg: "#111827",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: "white", display: "block" }}>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com/in/kielltampubolon",
    title: "LinkedIn",
    handle: "kielltampubolon",
    desc: "Professional network and experience",
    bg: "#0a66c2",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: "white", display: "block" }}>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://t.me/kiell_at",
    title: "Telegram",
    handle: "@kiell_at",
    desc: "Quickest way to reach me directly",
    bg: "#229ed9",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: "white", display: "block" }}>
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

const OPEN_TO = [
  "Freelance Pentesting",
  "Red Team Engagements",
  "Security Tool Dev",
  "Bug Bounty Collab",
  "Security Training",
  "Malware Analysis Consulting",
];

export default function ContactPage() {
  return (
    <article className="main-article">
      <div className="article-content-inner">
        <h1>Contact</h1>
        <p>
          Building something that needs a security perspective? Running a red team engagement?
          Want to talk offensive tooling, malware analysis, or bug bounty? Let&apos;s connect.
        </p>
      </div>

      {/* Contact cards */}
      <div style={{ padding: "0 var(--card-padding)", display: "flex", flexDirection: "column", gap: 12 }}>
        {LINKS.map((l) => (
          <a
            key={l.title}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            <div
              className="contact-card-icon"
              style={{ background: l.bg }}
            >
              {l.icon}
            </div>
            <div>
              <div className="contact-card-title">{l.title}</div>
              <div className="contact-card-handle">{l.handle}</div>
              <div style={{ color: "var(--card-text-color-secondary)", fontSize: "0.875rem", marginTop: 4 }}>
                {l.desc}
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Open to */}
      <div style={{ padding: "var(--card-padding)" }}>
        <div className="open-to-card">
          <div style={{ fontWeight: 700, fontSize: "0.8125rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--card-text-color-tertiary)" }}>
            Open to
          </div>
          <div className="open-to-tags">
            {OPEN_TO.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Based in Indonesia · Available remotely</div>
      </footer>
    </article>
  );
}
