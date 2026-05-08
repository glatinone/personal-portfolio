import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — Kiell Tampubolon",
  description: "Where to find me online — GitHub, dev.to, LinkedIn, and more.",
};

interface LinkItem {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  accent: string;
}

/* ── SVG icons ──────────────────────────────────────────────── */

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function DevToIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.06-.06h.76c.35 0 .74.01.87.02l.23.03-.82 3.08c-.45 1.68-.87 3.13-.92 3.11z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function HackerOneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" width="28" height="28">
      <path d="M7.207 0L4.875 4.363v15.274L7.207 24h9.586l2.332-4.363V4.363L16.793 0zm2.285 6.826h.87l2.273 4.337V6.826h.868v6.348h-.87l-2.273-4.337v4.337h-.868z"/>
    </svg>
  );
}

function BugcrowdIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
      <path d="M3 10h3M18 10h3M3 14h2M19 14h2" />
    </svg>
  );
}

function NovaSecIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
      <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
      <path d="M9 12l2 2l4 -4" />
    </svg>
  );
}

/* ── Link data ──────────────────────────────────────────────── */

const LINKS: LinkItem[] = [
  {
    title: "GitHub",
    description: "Open-source security tooling — VulnScan, SentinelScout, OSINTScout, and more",
    url: "https://github.com/glatinone",
    accent: "#24292e",
    icon: <GitHubIcon />,
  },
  {
    title: "dev.to",
    description: "Technical writing on malware analysis, red teaming, and offensive security",
    url: "https://dev.to/glatinone",
    accent: "#0a0a0a",
    icon: <DevToIcon />,
  },
  {
    title: "LinkedIn",
    description: "Professional profile — Cybersecurity Engineer, Indonesia",
    url: "https://linkedin.com/in/kielltampubolon",
    accent: "#0077b5",
    icon: <LinkedInIcon />,
  },
  {
    title: "Telegram",
    description: "Direct contact for engagements, collaborations, and security discussions",
    url: "https://t.me/kiell_at",
    accent: "#2ca5e0",
    icon: <TelegramIcon />,
  },
  {
    title: "HackerOne",
    description: "Bug bounty profile — P1 and P2 findings across public and private programs",
    url: "https://hackerone.com/glatinone",
    accent: "#e74c3c",
    icon: <HackerOneIcon />,
  },
  {
    title: "Bugcrowd",
    description: "Additional bug bounty submissions across Bugcrowd programs",
    url: "https://bugcrowd.com/glatinone",
    accent: "#f26722",
    icon: <BugcrowdIcon />,
  },
  {
    title: "NovaSec",
    description: "Cybersecurity education brand for the Indonesian tech community",
    url: "/novasec",
    accent: "#0891b2",
    icon: <NovaSecIcon />,
  },
];

/* ── Page component ─────────────────────────────────────────── */

export default function LinksPage() {
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
        <h1 style={{ margin: "0 0 8px" }}>Links</h1>
        <p style={{ color: "var(--card-text-color-secondary)", margin: 0 }}>
          Where to find me online. Reach out anytime.
        </p>
      </div>

      <div className="link-card-grid">
        {LINKS.map((link) => {
          const isExternal = link.url.startsWith("http");
          return (
            <a
              key={link.title}
              href={link.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="link-card"
            >
              <div
                className="link-card-icon"
                style={{ background: link.accent, color: "#fff" }}
              >
                {link.icon}
              </div>
              <div className="link-card-content">
                <div className="link-card-title">{link.title}</div>
                <p className="link-card-description">{link.description}</p>
                <div className="link-card-url">
                  {link.url.replace(/^https?:\/\//, "")}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <footer className="site-footer">
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">
          Cybersecurity Engineer · Indonesia ·{" "}
          <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">
            @glatinone
          </a>
        </div>
      </footer>
    </>
  );
}
