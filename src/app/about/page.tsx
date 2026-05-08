import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Kiell Tampubolon",
};

export default function AboutPage() {
  return (
    <article className="main-article">
      <div className="article-content-inner">
        <h1>About Me</h1>

        <p>
          Cybersecurity Engineer based in Indonesia, working remotely for a Singapore-based company.
          My day-to-day involves offensive security — red teaming, malware analysis, and building
          automation tools to make security operations faster and more precise.
        </p>

        <p>
          I build tools in Python because it gets out of the way and lets me ship fast. My GitHub
          projects focus on practical offensive security tooling — things I'd actually use in the
          field. Currently deep into{" "}
          <a href="https://maldevacademy.com" target="_blank" rel="noopener noreferrer">MalDevAcademy</a> and{" "}
          <a href="https://www.zeropointsecurity.co.uk" target="_blank" rel="noopener noreferrer">Zero-Point Security</a> courses,
          constantly pushing on bug bounty hunts across HackerOne and Bugcrowd.
        </p>

        <p>
          I also run <strong>NovaSec</strong> — a cybersecurity education brand making practical
          security content for the Indonesian tech community. Workshops on phishing awareness,
          red teaming basics, and real-world tradecraft.
        </p>

        <p>
          When I&apos;m not in a terminal, I&apos;m probably on a badminton court or editing photos.
        </p>

        <h2>Current Focus</h2>
        <ul>
          <li>Red team operations and C2 framework development</li>
          <li>Malware analysis and detection engineering</li>
          <li>Active bug bounty hunting (HackerOne, Bugcrowd)</li>
          <li>Building and shipping open-source security CLI tools</li>
          <li>OSINT automation and threat intelligence pipelines</li>
          <li>Studying Windows internals and advanced evasion techniques</li>
        </ul>

        <h2>Where to Find Me</h2>
        <ul>
          <li>
            <strong>GitHub:</strong>{" "}
            <a href="https://github.com/glatinone" target="_blank" rel="noopener noreferrer">
              @glatinone
            </a>{" "}
            — all my open-source tools
          </li>
          <li>
            <strong>LinkedIn:</strong>{" "}
            <a href="https://linkedin.com/in/kielltampubolon" target="_blank" rel="noopener noreferrer">
              kielltampubolon
            </a>
          </li>
          <li>
            <strong>Telegram:</strong>{" "}
            <a href="https://t.me/kiell_at" target="_blank" rel="noopener noreferrer">
              @kiell_at
            </a>
          </li>
        </ul>
      </div>

      <footer className="site-footer" style={{ padding: "0 var(--card-padding) var(--card-padding)" }}>
        <div className="copyright">© 2026 Kiell Tampubolon</div>
        <div className="powerby">Cybersecurity Engineer · Indonesia</div>
      </footer>
    </article>
  );
}
