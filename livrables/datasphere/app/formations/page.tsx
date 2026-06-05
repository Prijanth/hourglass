import type { Metadata } from "next";
import Link from "next/link";
import formations from "@/content/formations.json";
import { udemyUrl, courseraUrl, datacampUrl } from "@/lib/affiliate";

export const metadata: Metadata = {
  title: "Formations Data & IA — Udemy, Coursera, DataCamp | DataSphère",
  description: "Les meilleures formations data et IA sélectionnées : Udemy, Coursera, DataCamp, dbt Labs, fast.ai. Tous niveaux, Python, SQL, Machine Learning, MLOps.",
};

const LEVEL_CONFIG = {
  débutant:      { label: "Débutant",       badge: "badge-teal",   color: "#22D3EE", bg: "rgba(6,182,212,0.15)" },
  intermédiaire: { label: "Intermédiaire",  badge: "badge-amber",  color: "#FCD34D", bg: "rgba(251,191,36,0.15)" },
  avancé:        { label: "Avancé",         badge: "badge-rose",   color: "#FB7185", bg: "rgba(244,63,94,0.15)" },
} as const;

type Level = keyof typeof LEVEL_CONFIG;
const LEVELS = Object.keys(LEVEL_CONFIG) as Level[];

function RatingBar({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "var(--surface-3)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ width: `${(rating / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg, #FCD34D, #FB7185)", borderRadius: 10 }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FCD34D", minWidth: 28 }}>{rating}</span>
    </div>
  );
}

export default function FormationsPage() {
  const free = formations.filter(f => f.price.toLowerCase().includes("gratuit")).length;
  const avgRating = (formations.reduce((s, f) => s + f.rating, 0) / formations.length).toFixed(1);

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
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.24)", top: -110, right: "3%", animationDelay: "5s" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(34,211,238,0.14)", bottom: -60, left: "14%", animationDelay: "12s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Ressources sélectionnées</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Formations data &amp; IA</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 580 }}>
            Les meilleures ressources pour monter en compétences, sélectionnées pour le marché français.
          </p>
        </div>
      </section>

      {/* ── CONTENU ───────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48 }}>
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

        {/* Level distribution bar */}
        <div className="card" style={{ padding: "24px 28px", marginBottom: 48, display: "flex", alignItems: "center", gap: 32 }}>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 6 }}>Répartition par niveau</p>
            <div style={{ display: "flex", gap: 8 }}>
              {LEVELS.map((level) => {
                const count = formations.filter(f => f.level === level).length;
                const { label, badge } = LEVEL_CONFIG[level];
                return (
                  <div key={level} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className={`badge ${badge}`}>{label}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, height: 10, background: "var(--surface-3)", borderRadius: 20, overflow: "hidden", display: "flex" }}>
            {LEVELS.map((level) => {
              const count = formations.filter(f => f.level === level).length;
              const pct = (count / formations.length) * 100;
              const colors = { débutant: "#22D3EE", intermédiaire: "#FCD34D", avancé: "#FB7185" };
              return <div key={level} style={{ width: `${pct}%`, height: "100%", background: colors[level] }} />;
            })}
          </div>
        </div>

        {/* Sections par niveau */}
        {LEVELS.map((level) => {
          const items = formations.filter(f => f.level === level);
          if (!items.length) return null;
          const { label, badge, color, bg } = LEVEL_CONFIG[level];

          return (
            <div key={level} style={{ marginBottom: 52 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
                <span className={`badge ${badge}`} style={{ fontSize: 13, padding: "5px 14px" }}>{label}</span>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                <span style={{ fontSize: 13, color: "var(--faint)" }}>{items.length} formation{items.length > 1 ? "s" : ""}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
                {items.map((f) => (
                  <div key={f.id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div style={{ height: 4, background: color }} />
                    <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.provider}</div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{f.title}</h3>
                        </div>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                          🎓
                        </div>
                      </div>

                      <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{f.description}</p>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {f.skills.slice(0, 4).map(s => (
                          <span key={s} style={{ fontSize: 11.5, padding: "3px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--muted)" }}>{s}</span>
                        ))}
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 12, color: "var(--faint)" }}>Note</span>
                          <span style={{ fontSize: 12, color: "var(--faint)" }}>{f.students} apprenants</span>
                        </div>
                        <RatingBar rating={f.rating} />
                      </div>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{f.price}</div>
                          <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{f.duration}</div>
                        </div>
                        <a
                          href={(f as { platform?: string }).platform === "udemy" ? udemyUrl(f.url) : (f as { platform?: string }).platform === "coursera" ? courseraUrl(f.url) : (f as { platform?: string }).platform === "datacamp" ? datacampUrl(f.url) : f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: "8px 18px", background: color, color: "#07080F", borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                          Accéder
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 16 }}>
          Certains liens sont des liens d&apos;affiliation. Ils n&apos;ont aucun impact sur le prix que vous payez.
        </p>
      </div>
    </>
  );
}
