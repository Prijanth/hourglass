import Link from "next/link";
import comparatifs from "@/content/comparatifs.json";
import outils from "@/content/outils.json";

function getOutil(slug: string) {
  return outils.find((o) => o.slug === slug);
}

const CATEGORIES = ["Toutes", ...Array.from(new Set(comparatifs.map(c => c.category))).sort()];

export default function ComparatifsPage() {
  const threeWayCount = comparatifs.filter(c => (c as { three_way?: boolean }).three_way).length;

  return (
    <>
      {/* Hero */}
      <section style={{
        background: "var(--navy)", padding: "64px 24px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 380, height: 380, background: "rgba(124,58,237,0.22)", top: -120, right: "4%", animationDelay: "6s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(6,182,212,0.14)", bottom: -50, left: "12%", animationDelay: "13s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Guides de choix</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 14,
          }}>Comparatifs d&apos;outils</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560, marginBottom: 32 }}>
            Des analyses approfondies avec scores et critères pour choisir les bons outils pour votre stack data.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { n: comparatifs.length, l: "comparatifs" },
              { n: CATEGORIES.length - 1, l: "catégories" },
              { n: threeWayCount, l: "face-à-face 3 outils" },
            ].map(({ n, l }) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--indigo)" }}>{n}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

        {/* Filtres catégorie */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {CATEGORIES.map(cat => (
            <span key={cat} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 12.5, fontWeight: 500,
              background: "var(--surface-2)", color: "var(--muted)",
              border: "1px solid var(--border)", cursor: "default",
            }}>
              {cat === "Toutes" ? `Toutes (${comparatifs.length})` : cat}
            </span>
          ))}
        </div>

        {/* Grille 2-3 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 20 }}>
          {comparatifs.map((c) => {
            const toolObjects = c.tools.map(getOutil).filter(Boolean);
            const isThree = (c as { three_way?: boolean }).three_way;
            const scoreA = (c as { score_a: number }).score_a;
            const scoreB = (c as { score_b: number }).score_b;
            const scoreC = (c as { score_c?: number }).score_c;
            const winner = isThree
              ? (scoreA >= scoreB && scoreA >= (scoreC ?? 0) ? 0 : scoreB >= (scoreC ?? 0) ? 1 : 2)
              : (scoreA >= scoreB ? 0 : 1);

            return (
              <Link
                key={c.slug}
                href={`/comparatifs/${c.slug}`}
                className="card"
                style={{ display: "flex", flexDirection: "column", overflow: "hidden", textDecoration: "none" }}
              >
                {/* Barre top */}
                <div style={{ height: 3, background: "linear-gradient(90deg, var(--indigo), var(--teal))", flexShrink: 0 }} />

                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>

                  {/* Catégorie + outils */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <span className="badge badge-indigo" style={{ fontSize: 11 }}>{c.category}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {toolObjects.map((o, i) => o && (
                        <div key={o.slug} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          {i > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: "var(--faint)", letterSpacing: "0.05em" }}>VS</span>}
                          <div title={o.name} style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: i === winner ? "var(--indigo-tint)" : "var(--surface-2)",
                            border: i === winner ? "1.5px solid var(--indigo-border)" : "1px solid var(--border)",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                            position: "relative",
                          }}>
                            {o.emoji}
                            {i === winner && (
                              <span style={{
                                position: "absolute", top: -5, right: -5,
                                width: 12, height: 12, borderRadius: "50%",
                                background: "var(--indigo)", fontSize: 7,
                                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff",
                              }}>★</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Titre */}
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 800,
                      marginBottom: 6, letterSpacing: "-0.02em", color: "var(--text)", lineHeight: 1.3,
                    }}>
                      {c.title}
                    </h2>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>{c.subtitle}</p>
                  </div>

                  {/* Scores + CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      {toolObjects.map((o, i) => {
                        const score = i === 0 ? scoreA : i === 1 ? scoreB : scoreC;
                        return o && score !== undefined ? (
                          <div key={o.slug} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <span style={{ fontSize: 10.5, color: "var(--faint)" }}>{o.name.split(" ")[0]}</span>
                            <span style={{
                              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14,
                              color: i === winner ? "var(--indigo)" : "var(--muted)",
                            }}>{score}</span>
                          </div>
                        ) : null;
                      })}
                      <span style={{ fontSize: 10.5, color: "var(--faint)", alignSelf: "center" }}>· {c.criteria.length} critères</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--indigo)" }}>Lire →</span>
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
