import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NovaSec — Kiell Tampubolon",
};

const INITIATIVES = [
  {
    icon: "🎯",
    title: "Phishing Awareness Workshops",
    description:
      "Conducted at HACKTIV8 and multiple institutions across Indonesia. 500+ participants taught real-world phishing techniques, red flags, and how organizations can defend against social engineering.",
  },
  {
    icon: "🦠",
    title: "Malware Analysis Content",
    description:
      "QakBot v4 deep-dive in thesis research. Regular breakdowns of APT techniques, banking trojans, and modern malware tradecraft — translated into accessible content for Indonesian practitioners.",
  },
  {
    icon: "🛡️",
    title: "Red Team Ops Series",
    description:
      "Practical guides on C2 setup, phishing operations, and offensive tradecraft. Focused on hands-on learning rather than theory — covering tools like Cobalt Strike, Havoc, and custom loaders.",
  },
  {
    icon: "📡",
    title: "Threat Intelligence Education",
    description:
      "Teaching analysts how to use OSINT frameworks, pivot on indicators, and build threat intel pipelines. Covering VirusTotal, Shodan, AlienVault OTX, and custom tooling.",
  },
];

export default function NovaSecPage() {
  return (
    <article className="main-article">
      <div className="article-content-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "linear-gradient(135deg, #111827 0%, #374151 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" />
            </svg>
          </div>
          <h1 style={{ margin: 0 }}>NovaSec</h1>
        </div>

        <p style={{ color: "var(--card-text-color-secondary)", marginTop: 0 }}>
          Cybersecurity education brand making practical security content for the Indonesian tech community.
        </p>

        <p>
          NovaSec was started to bridge the gap between academic security theory and real-world offensive
          tradecraft in Indonesia. Too much security education teaches tools without context. NovaSec
          focuses on the &quot;why&quot; behind techniques — helping practitioners understand attacker
          mindset, not just tool usage.
        </p>

        <p>
          Content spans phishing simulation, malware analysis, red team operations, and threat intelligence
          — all delivered in Bahasa Indonesia to maximize accessibility for the local community.
        </p>

        <h2>Initiatives</h2>
      </div>

      <div style={{ padding: "0 var(--card-padding) var(--card-padding)", display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {INITIATIVES.map((item) => (
          <div key={item.title} className="novasec-card">
            <div className="novasec-card-icon">{item.icon}</div>
            <div className="novasec-card-title">{item.title}</div>
            <p className="novasec-card-desc">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="article-content-inner" style={{ paddingTop: 0 }}>
        <h2>Impact So Far</h2>
        <ul>
          <li><strong>500+</strong> participants in phishing awareness workshops</li>
          <li>Workshops delivered at HACKTIV8 and multiple universities</li>
          <li>Published QakBot v4 malware analysis as part of thesis research</li>
          <li>Active content creation on offensive security tradecraft</li>
        </ul>

        <h2>Get Involved</h2>
        <p>
          Interested in a workshop for your company or institution? Want to collaborate on security
          content? Reach out via{" "}
          <a href="https://linkedin.com/in/kielltampubolon" target="_blank" rel="noopener noreferrer">LinkedIn</a>{" "}
          or{" "}
          <a href="https://t.me/kiell_at" target="_blank" rel="noopener noreferrer">Telegram</a>.
        </p>
      </div>

      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 NovaSec · Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity education for Indonesia</div>
      </footer>
    </article>
  );
}
