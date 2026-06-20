"use client";
import { useState, useMemo, Fragment } from "react";
import Link from "next/link";
import outils from "@/content/outils.json";
import { ToolLogo } from "@/components/tool-logo";

type Outil = typeof outils[number];

const CRITERES = [
  { key: "pricing",        label: "Tarif",              icon: "💰" },
  { key: "learning_curve", label: "Courbe d'apprentissage", icon: "📈" },
  { key: "open_source",    label: "Open source",        icon: "🔓" },
  { key: "free_tier",      label: "Free tier",          icon: "🆓" },
  { key: "category",       label: "Catégorie",          icon: "📁" },
] as const;

const SCORE_LABELS = ["performance", "facilite", "ecosysteme", "cout", "support"] as const;
const SCORE_NAMES: Record<string, string> = {
  performance: "Performance",
  facilite: "Facilité",
  ecosysteme: "Écosystème",
  cout: "Rapport qualité/prix",
  support: "Support",
};

const CATEGORIES = ["Tous", ...Array.from(new Set(outils.map(o => o.category))).sort()];

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 100 }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 100, transition: "width 0.5s" }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, fontFamily: "var(--font-mono)", minWidth: 28 }}>{value}</span>
    </div>
  );
}

const COLORS = ["#7C3AED", "#0E7490", "#BE123C"];

export default function ComparateurPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");

  const filteredOutils = useMemo(() => {
    const q = search.toLowerCase();
    return outils.filter(o => {
      if (category !== "Tous" && o.category !== category) return false;
      if (q && !o.name.toLowerCase().includes(q) && !o.tagline.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [search, category]);

  function toggle(slug: string) {
    setSelected(prev => {
      if (prev.includes(slug)) return prev.filter(s => s !== slug);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, slug];
    });
  }

  const selectedOutils = selected.map(s => outils.find(o => o.slug === s)).filter(Boolean) as Outil[];

  function winner(key: keyof typeof SCORE_NAMES) {
    if (selectedOutils.length < 2) return null;
    const scores = selectedOutils.map(o => (o.score as Record<string, number>)[key] ?? 0);
    const max = Math.max(...scores);
    return scores.indexOf(max);
  }

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "var(--navy)", padding: "64px 24px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.22)", top: -110, right: "4%" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Outil de choix</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 14,
          }}>
            Comparateur d&apos;outils
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Sélectionne jusqu&apos;à 3 outils pour les comparer côte à côte : scores, tarifs, fonctionnalités.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px" }}>

        {/* Sélection outils */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 320 }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un outil..."
                style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 13.5, background: "white", fontFamily: "var(--font-body)", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.slice(0, 8).map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} style={{
                  padding: "6px 12px", borderRadius: 100, fontSize: 12.5, cursor: "pointer", border: "none",
                  fontFamily: "inherit", fontWeight: category === cat ? 700 : 400,
                  background: category === cat ? "#7C3AED" : "#F1F5F9",
                  color: category === cat ? "#fff" : "#64748B", transition: "all 0.15s",
                }}>
                  {cat}
                </button>
              ))}
            </div>
            {selected.length > 0 && (
              <button onClick={() => setSelected([])} style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "white", fontSize: 12.5, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}>
                ✕ Vider la sélection
              </button>
            )}
          </div>

          {/* Chips outils sélectionnés */}
          {selected.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {selectedOutils.map((o, i) => (
                <div key={o.slug} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                  borderRadius: 100, background: `${COLORS[i]}15`, border: `1.5px solid ${COLORS[i]}40`,
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: COLORS[i] }}>{o.name}</span>
                  <button onClick={() => toggle(o.slug)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS[i], fontSize: 14, lineHeight: 1, padding: 0 }}>✕</button>
                </div>
              ))}
              <span style={{ fontSize: 12.5, color: "var(--faint)", alignSelf: "center" }}>
                {selected.length < 3 ? `${3 - selected.length} emplacement${3 - selected.length > 1 ? "s" : ""} restant${3 - selected.length > 1 ? "s" : ""}` : "Maximum atteint"}
              </span>
            </div>
          )}

          {/* Grille de sélection */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {filteredOutils.map(o => {
              const isSelected = selected.includes(o.slug);
              const colorIdx = selected.indexOf(o.slug);
              const color = colorIdx >= 0 ? COLORS[colorIdx] : "var(--indigo)";
              const disabled = !isSelected && selected.length >= 3;
              return (
                <button
                  key={o.slug}
                  onClick={() => !disabled && toggle(o.slug)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 16px", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer",
                    border: isSelected ? `2px solid ${color}` : "1.5px solid var(--border)",
                    background: isSelected ? `${color}08` : "white",
                    textAlign: "left", fontFamily: "inherit", opacity: disabled ? 0.45 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <ToolLogo slug={o.slug} emoji={o.emoji} name={o.name} size={22} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: isSelected ? color : "var(--text)" }}>{o.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.category}</div>
                  </div>
                  {isSelected && (
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>✓</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tableau comparatif */}
        {selectedOutils.length >= 2 ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800 }}>Comparaison</h2>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* En-têtes */}
            <div style={{
              display: "grid",
              gridTemplateColumns: `200px repeat(${selectedOutils.length}, 1fr)`,
              gap: 0, border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden",
            }}>

              {/* Ligne header */}
              <div style={{ padding: "20px 24px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)" }}>Critère</span>
              </div>
              {selectedOutils.map((o, i) => (
                <div key={o.slug} style={{
                  padding: "20px 24px", background: "white",
                  borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
                  borderTop: `3px solid ${COLORS[i]}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ToolLogo slug={o.slug} emoji={o.emoji} name={o.name} size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: COLORS[i] }}>{o.name}</div>
                      <div style={{ fontSize: 11, color: "var(--faint)" }}>{o.category}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{o.tagline}</p>
                </div>
              ))}

              {/* Infos générales */}
              {CRITERES.map(({ key, label, icon }) => (
                <Fragment key={key}>
                  <div key={`label-${key}`} style={{ padding: "14px 24px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
                  </div>
                  {selectedOutils.map((o, i) => (
                    <div key={`${key}-${o.slug}`} style={{ padding: "14px 24px", background: "white", borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--muted)", display: "flex", alignItems: "center" }}>
                      {key === "open_source" || key === "free_tier"
                        ? <span style={{ fontSize: 16 }}>{(o[key] as boolean) ? "✅" : "❌"}</span>
                        : <span>{String((o as Record<string, unknown>)[key] ?? "—")}</span>
                      }
                    </div>
                  ))}
                </Fragment>
              ))}

              {/* Scores */}
              {SCORE_LABELS.map(scoreKey => {
                const winIdx = winner(scoreKey);
                return (
                  <Fragment key={scoreKey}>
                    <div key={`score-label-${scoreKey}`} style={{ padding: "14px 24px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>⭐ {SCORE_NAMES[scoreKey]}</span>
                    </div>
                    {selectedOutils.map((o, i) => {
                      const val = (o.score as Record<string, number>)[scoreKey] ?? 0;
                      const isWin = winIdx === i;
                      return (
                        <div key={`${scoreKey}-${o.slug}`} style={{
                          padding: "14px 24px", background: isWin ? `${COLORS[i]}06` : "white",
                          borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
                        }}>
                          <ScoreBar value={val} color={COLORS[i]} />
                          {isWin && <span style={{ fontSize: 10, fontWeight: 700, color: COLORS[i], marginTop: 4, display: "block" }}>Meilleur score</span>}
                        </div>
                      );
                    })}
                  </Fragment>
                );
              })}

              {/* Pros */}
              <div style={{ padding: "14px 24px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>✅ Points forts</span>
              </div>
              {selectedOutils.map((o, i) => (
                <div key={`pros-${o.slug}`} style={{ padding: "14px 24px", background: "white", borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                  {o.pros.slice(0, 3).map((p, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                      <span style={{ color: "#22C55E", fontSize: 11, flexShrink: 0, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Cons */}
              <div style={{ padding: "14px 24px", background: "var(--surface-2)", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>⚠️ Limites</span>
              </div>
              {selectedOutils.map((o, i) => (
                <div key={`cons-${o.slug}`} style={{ padding: "14px 24px", background: "white", borderLeft: "1px solid var(--border)" }}>
                  {o.cons.slice(0, 3).map((c, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                      <span style={{ color: "#F59E0B", fontSize: 11, flexShrink: 0, marginTop: 2 }}>→</span>
                      <span style={{ fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>{c}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Liens vers fiches */}
            <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
              {selectedOutils.map((o, i) => (
                <Link key={o.slug} href={`/outils/${o.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                  textDecoration: "none", border: `1.5px solid ${COLORS[i]}40`,
                  background: `${COLORS[i]}08`, color: COLORS[i], fontFamily: "var(--font-display)",
                }}>
                  <ToolLogo slug={o.slug} emoji={o.emoji} name={o.name} size={16} />
                  Fiche complète {o.name} →
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)", border: "2px dashed var(--border)", borderRadius: 16 }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>⚖️</div>
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Sélectionne au moins 2 outils</p>
            <p style={{ fontSize: 14, color: "var(--faint)" }}>La comparaison apparaîtra ici automatiquement.</p>
          </div>
        )}
      </div>
    </main>
  );
}
