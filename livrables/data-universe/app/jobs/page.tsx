import type { Metadata } from "next";
import Link from "next/link";
import { JobsListing } from "./jobs-listing";

export const metadata: Metadata = {
  title: "Offres d'emploi data & IA | Data Universe",
  description: "Offres CDI, freelance et remote en data et IA — toute la France. Data Engineers, Analysts, Scientists et AI Engineers.",
};

const BOARDS = [
  { name: "LinkedIn", desc: "Le plus grand volume d'offres data & IA en France", url: "https://www.linkedin.com/jobs/search/?keywords=data", abbr: "Li", color: "#0A66C2" },
  { name: "Welcome to the Jungle", desc: "Startups et scale-ups tech — souvent remote-friendly", url: "https://www.welcometothejungle.com/fr/jobs?query=data", abbr: "WJ", color: "#4ADE80" },
  { name: "Indeed", desc: "Agrégateur multi-sources — CDI, CDD, freelance", url: "https://fr.indeed.com/emplois?q=data+engineer", abbr: "In", color: "#2164F3" },
  { name: "APEC", desc: "Cadres et experts data — offres sérieuses, souvent grands comptes", url: "https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=data", abbr: "AP", color: "#7C3AED" },
  { name: "Freelance.com", desc: "Missions freelance data & IA — courte et longue durée", url: "https://www.freelance.com/recherche/data", abbr: "Fr", color: "#0891B2" },
  { name: "Malt", desc: "Plateforme freelance — Data Engineers, Scientists, Analysts", url: "https://www.malt.fr/s?q=data", abbr: "Ma", color: "#EF4444" },
];

export default function JobsPage() {
  return (
    <main style={{ minHeight: "70vh" }}>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 100%)",
        borderBottom: "1px solid #E2E8F0",
        padding: "64px 24px 52px",
      }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 100,
            background: "#DCFCE7", border: "1px solid #86EFAC",
            fontSize: 11, fontWeight: 700, color: "#15803D",
            letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20,
          }}>
            Nouveau
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 800, color: "#0F172A",
            letterSpacing: "-0.03em", marginBottom: 16,
          }}>
            Offres d&apos;emploi data &amp; IA
          </h1>
          <p style={{ fontSize: 16.5, color: "#64748B", lineHeight: 1.75, maxWidth: 540, margin: "0 auto 28px" }}>
            CDI, freelance, remote — offres vérifiées pour les métiers data en France.
          </p>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { n: "12", l: "offres actives" },
              { n: "3", l: "métiers" },
              { n: "4", l: "secteurs" },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{n}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Board natif — composant interactif */}
      <JobsListing />

      {/* Recruteurs CTA */}
      <section style={{ padding: "0 24px 56px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #0B0F29, #1E1B4B)", borderRadius: 20,
          padding: "40px 36px", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 24, flexWrap: "wrap" as const,
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.4rem)", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
              Tu recrutes des profils data ?
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, maxWidth: 420 }}>
              Publie ton offre gratuitement auprès de notre communauté data francophone. Validation sous 24h.
            </p>
          </div>
          <Link href="/recruteurs" style={{
            padding: "12px 24px", background: "#7C3AED", color: "#fff",
            borderRadius: 10, fontFamily: "var(--font-display)", fontSize: 14,
            fontWeight: 700, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" as const,
          }}>
            Déposer une offre →
          </Link>
        </div>
      </section>

      {/* Autres plateformes */}
      <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: 48 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)", fontWeight: 800, color: "#0F172A", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Aussi sur ces plateformes
          </h2>
          <p style={{ fontSize: 13.5, color: "#94A3B8", marginBottom: 24 }}>6 plateformes pour compléter ta recherche</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {BOARDS.map(b => (
              <a key={b.name} href={b.url} target="_blank" rel="noopener noreferrer"
                className="hover-border-indigo"
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", textDecoration: "none" }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, color: "#fff" }}>
                  {b.abbr}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{b.name}</p>
                  <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>{b.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
