import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offres d'emploi data & IA | Data Universe",
  description: "CDI, freelance et remote en data et IA — toute la France. Retrouve les meilleures plateformes pour trouver un poste data.",
};

const BOARDS = [
  { name: "LinkedIn", desc: "Le plus grand volume d'offres data & IA en France", url: "https://www.linkedin.com/jobs/search/?keywords=data", emoji: "💼" },
  { name: "Welcome to the Jungle", desc: "Startups et scale-ups tech — souvent remote-friendly", url: "https://www.welcometothejungle.com/fr/jobs?query=data", emoji: "🌿" },
  { name: "Indeed", desc: "Agrégateur multi-sources — CDI, CDD, freelance", url: "https://fr.indeed.com/emplois?q=data+engineer", emoji: "🔍" },
  { name: "APEC", desc: "Cadres et experts data — offres sérieuses, souvent grands comptes", url: "https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=data", emoji: "🎓" },
  { name: "Freelance.com", desc: "Missions freelance data & IA — courte et longue durée", url: "https://www.freelance.com/recherche/data", emoji: "🚀" },
  { name: "Malt", desc: "Plateforme freelance — Data Engineers, Scientists, Analysts", url: "https://www.malt.fr/s?q=data", emoji: "⚡" },
];

export default function JobsPage() {
  return (
    <main style={{ minHeight: "70vh" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)", borderBottom: "1px solid #E2E8F0", padding: "64px 24px 52px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "#EDE9FE", border: "1px solid #C4B5FD", fontSize: 11, fontWeight: 700, color: "#5B21B6", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            💼 Board en construction
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 16 }}>
            Offres d&apos;emploi data &amp; IA
          </h1>
          <p style={{ fontSize: 16.5, color: "#64748B", lineHeight: 1.75, maxWidth: 540, margin: "0 auto" }}>
            Le board natif Data Universe arrive bientôt. En attendant, voici les meilleures plateformes pour trouver un poste data en France.
          </p>
        </div>
      </section>

      {/* Job boards */}
      <section style={{ padding: "56px 24px", maxWidth: 960, margin: "0 auto" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2vw, 1.5rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Où chercher un poste data en France
        </h2>
        <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 32 }}>6 plateformes sélectionnées pour la qualité et le volume des offres data & IA</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 52 }}>
          {BOARDS.map(b => (
            <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "20px 22px", borderRadius: 14, border: "1.5px solid #E2E8F0", background: "#fff", textDecoration: "none", transition: "border-color 0.15s, box-shadow 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#C4B5FD"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(124,58,237,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: 28, flexShrink: 0, lineHeight: 1 }}>{b.emoji}</span>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{b.name} →</p>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Recruteurs CTA */}
        <div style={{ background: "linear-gradient(135deg, #0B0F29, #1E1B4B)", borderRadius: 20, padding: "40px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Tu recrutes des profils data ?
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 420 }}>
              Publie ton offre gratuitement auprès de 2 400 professionnels data francophones. Validation sous 24h.
            </p>
          </div>
          <Link href="/recruteurs" style={{ padding: "12px 24px", background: "#7C3AED", color: "#fff", borderRadius: 10, fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" as const }}>
            Déposer une offre →
          </Link>
        </div>
      </section>
    </main>
  );
}
