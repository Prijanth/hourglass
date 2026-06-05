import type { Metadata } from "next";
import metiers from "@/content/metiers.json";

export const metadata: Metadata = {
  title: "Métiers Data & IA — Salaires 2025 et compétences | DataSphère",
  description: "Salaires 2025 des métiers data en France, compétences requises et trajectoires de carrière. Data Engineer, Data Scientist, Analytics Engineer, ML Engineer et plus.",
};
import { SalaryChart } from "@/components/charts/salary-chart";
import { SkillsChart } from "@/components/charts/skills-chart";

const DEMAND_BADGE: Record<string, string> = {
  "Très forte": "badge-rose",
  "Forte":      "badge-teal",
  "Modérée":    "badge-amber",
};
const CATEGORY_BADGE: Record<string, string> = {
  Engineering:          "badge-indigo",
  "Science des données":"badge-teal",
  Analytics:            "badge-amber",
  Architecture:         "badge-neutral",
  Management:           "badge-rose",
};

export default function MetiersPage() {
  const avgMin = Math.round(metiers.reduce((s, m) => s + m.salaryMin, 0) / metiers.length);
  const avgMax = Math.round(metiers.reduce((s, m) => s + m.salaryMax, 0) / metiers.length);

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.22)", top: -100, right: "6%", animationDelay: "4s" }} />
        <div className="orb" style={{ width: 240, height: 240, background: "rgba(34,211,238,0.13)", bottom: -70, left: "10%", animationDelay: "11s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Marché de l&apos;emploi data</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Métiers &amp; Salaires</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 580 }}>
            Fiches complètes des métiers data &amp; IA avec fourchettes salariales du marché français 2025.
          </p>
        </div>
      </section>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48 }}>
        {[
          { value: `${metiers.length}`, label: "métiers couverts", sub: "data & IA" },
          { value: `${avgMin}–${avgMax}k€`, label: "salaire moyen", sub: "toutes fonctions" },
          { value: "3",  label: "catégories", sub: "Engineering, Analytics, Management" },
          { value: "Forte", label: "tension du marché", sub: "manque de profils qualifiés" },
        ].map(({ value, label, sub }) => (
          <div key={label} className="card" style={{ padding: "20px 22px" }}>
            <div className="stat-num" style={{ fontSize: "1.8rem", marginBottom: 6 }}>{value}</div>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 12, color: "var(--faint)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 56 }}>
        <div className="card" style={{ padding: "28px 24px" }}>
          <span className="section-label">Comparatif</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Fourchettes salariales par rôle</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>Salaires bruts annuels en France — source : marché 2025</p>
          <SalaryChart />
        </div>
        <div className="card" style={{ padding: "28px 24px" }}>
          <span className="section-label">Compétences</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Top compétences demandées</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>Score de demande sur les offres d&apos;emploi data analysées</p>
          <SkillsChart />
        </div>
      </div>

      {/* Fiches métiers */}
      <div>
        <span className="section-label">Fiches détaillées</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, marginBottom: 24 }}>Tous les métiers</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {metiers.map((m) => (
            <div key={m.slug} className="card" style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                    <span className={`badge ${CATEGORY_BADGE[m.category] ?? "badge-neutral"}`}>{m.category}</span>
                    <span className={`badge ${DEMAND_BADGE[m.demand] ?? "badge-neutral"}`}>Demande {m.demand.toLowerCase()}</span>
                    <span className="badge badge-neutral">{m.remoteRate}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{m.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--muted)" }}>{m.tagline}</p>
                </div>
                <div style={{ background: "var(--indigo-tint)", borderRadius: 14, padding: "16px 22px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 26, color: "var(--indigo)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {m.salaryMin}–{m.salaryMax}k€
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--indigo)", opacity: 0.6, marginTop: 4 }}>brut annuel</div>
                </div>
              </div>

              <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>{m.description}</p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Compétences</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {m.skills.map((s) => <span key={s} className="skill-pill">{s}</span>)}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Certifications</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {m.certifications.map((c) => (
                      <span key={c} className="badge badge-neutral" style={{ display: "inline-flex", fontSize: 11.5 }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Évolution</p>
                  {m.evolution.map((e, i) => (
                    <div key={e} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--indigo-tint)", color: "var(--indigo)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</span>
                      <span style={{ fontSize: 13 }}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
