import Link from "next/link";
import comparatifs from "@/content/comparatifs.json";
import outils from "@/content/outils.json";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function getOutil(slug: string) {
  return outils.find((o) => o.slug === slug);
}

export default function ComparatifsPage() {
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
        <div className="orb" style={{ width: 380, height: 380, background: "rgba(124,58,237,0.22)", top: -120, right: "4%", animationDelay: "6s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(6,182,212,0.14)", bottom: -50, left: "12%", animationDelay: "13s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Guides de choix</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Comparatifs d&apos;outils</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Des analyses approfondies pour vous aider à choisir les bons outils pour votre stack data.
          </p>
        </div>
      </section>

    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {comparatifs.map((c) => {
          const toolObjects = c.tools.map(getOutil).filter(Boolean);
          return (
            <Link key={c.slug} href={`/comparatifs/${c.slug}`} className="card" style={{ display: "block", overflow: "hidden" }}>
              <div style={{ height: 4, background: "linear-gradient(90deg, var(--indigo), var(--teal))" }} />
              <div style={{ padding: "28px 32px", display: "flex", alignItems: "center", gap: 32 }}>
                {/* Outils */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                  {toolObjects.map((o, i) => o && (
                    <div key={o.slug} style={{ display: "flex", alignItems: "center", gap: i > 0 ? 12 : 0 }}>
                      {i > 0 && <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--faint)", margin: "0 4px" }}>vs</span>}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ width: 52, height: 52, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                          {o.emoji}
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 5, color: "var(--text)" }}>{o.name}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Texte */}
                <div style={{ flex: 1 }}>
                  <span className="badge badge-indigo" style={{ marginBottom: 10, display: "inline-flex" }}>{c.category}</span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>{c.title}</h2>
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 500, marginBottom: 12 }}>{c.subtitle}</p>
                  <div style={{ fontSize: 12, color: "var(--faint)" }}>Mis à jour le {fmtDate(c.date)} · {c.criteria.length} critères analysés</div>
                </div>

                <div style={{ flexShrink: 0, padding: "14px 20px", background: "var(--indigo-tint)", borderRadius: 10, textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--indigo)" }}>Lire le comparatif</div>
                  <div style={{ fontSize: 18, marginTop: 2 }}>→</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
    </>
  );
}
