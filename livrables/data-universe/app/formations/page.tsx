import type { Metadata } from "next";
import formations from "@/content/formations.json";
import { FormationsGrid } from "@/components/formations-grid";

export const metadata: Metadata = {
  title: "Formations Data & IA — Udemy, Coursera, DataCamp | Data Universe",
  description: "Les meilleures formations data et IA sélectionnées : Udemy, Coursera, DataCamp, dbt Labs, fast.ai. Tous niveaux, Python, SQL, Machine Learning, MLOps.",
};

const LEVELS = ["débutant", "intermédiaire", "avancé"] as const;
type Level = (typeof LEVELS)[number];
const LEVEL_COLORS: Record<Level, string> = { débutant: "#22D3EE", intermédiaire: "#FCD34D", avancé: "#FB7185" };
const LEVEL_LABELS: Record<Level, string> = { débutant: "Débutant", intermédiaire: "Intermédiaire", avancé: "Avancé" };

export default function FormationsPage() {
  const free      = formations.filter(f => f.price.toLowerCase().includes("gratuit")).length;
  const avgRating = (formations.reduce((s, f) => s + f.rating, 0) / formations.length).toFixed(1);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.24)", top: -110, right: "3%", animationDelay: "5s" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(34,211,238,0.14)", bottom: -60, left: "14%", animationDelay: "12s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Ressources sélectionnées</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>
            Formations data &amp; IA
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 580 }}>
            {formations.length} formations sélectionnées pour le marché français — Udemy, Coursera, DataCamp, bootcamps et certifications cloud.
          </p>
        </div>
      </section>

      {/* ── KPIs + DISTRIBUTION ──────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 0" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
          {[
            { value: `${formations.length}`, label: "formations sélectionnées", color: "var(--indigo-light)" },
            { value: `${free}`,              label: "accessibles gratuitement", color: "#22D3EE" },
            { value: avgRating + "/5",       label: "note moyenne",             color: "#FCD34D" },
            { value: "3",                    label: "niveaux couverts",         color: "#FB7185" },
          ].map(({ value, label, color }) => (
            <div key={label} className="card" style={{ padding: "20px 22px" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 28, color, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 6 }}>{value}</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Barre de répartition par niveau */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 0, display: "flex", alignItems: "center", gap: 32 }}>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 6 }}>Répartition par niveau</p>
            <div style={{ display: "flex", gap: 8 }}>
              {LEVELS.map(level => {
                const count = formations.filter(f => f.level === level).length;
                return (
                  <div key={level} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: LEVEL_COLORS[level], display: "inline-block" }} />
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{LEVEL_LABELS[level]}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "var(--font-display)", color: LEVEL_COLORS[level] }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, height: 10, background: "var(--surface-3)", borderRadius: 20, overflow: "hidden", display: "flex" }}>
            {LEVELS.map(level => {
              const count = formations.filter(f => f.level === level).length;
              const pct = (count / formations.length) * 100;
              return <div key={level} style={{ width: `${pct}%`, height: "100%", background: LEVEL_COLORS[level] }} />;
            })}
          </div>
        </div>
      </div>

      {/* ── GRILLE FILTRABLE (client) ─────────────────── */}
      <FormationsGrid formations={formations as Parameters<typeof FormationsGrid>[0]["formations"]} />
    </>
  );
}
