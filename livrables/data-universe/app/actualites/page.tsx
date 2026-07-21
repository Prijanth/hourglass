"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import articles from "@/content/articles.json";
import { fmtDate } from "@/lib/date-utils";

const CATEGORY_COLORS: Record<string, string> = {
  indigo: "badge-indigo", teal: "badge-teal", amber: "badge-amber", rose: "badge-rose",
};

const CATEGORY_ACCENT: Record<string, string> = {
  indigo: "var(--indigo-light)",
  teal:   "#22D3EE",
  amber:  "#FCD34D",
  rose:   "#FB7185",
};

const ALL_CATEGORIES = ["Toutes", ...Array.from(new Set(articles.map(a => a.category)))];
const ALL_LEVELS = ["Tous", "Intermédiaire", "Avancé"];

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  "Intermédiaire": { bg: "#FEF3C7", color: "#92400E" },
  "Avancé":        { bg: "#EDE9FE", color: "#5B21B6" },
};

const ITEMS_PER_PAGE = 9;

export default function ActualitesPage() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [activeLevel, setActiveLevel]       = useState("Tous");
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const featured = articles.find((a) => a.featured);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return articles.filter(a => {
      if (activeCategory !== "Toutes" && a.category !== activeCategory) return false;
      if (activeLevel !== "Tous" && (a as Record<string, unknown>)["level"] !== activeLevel) return false;
      if (q && !a.title.toLowerCase().includes(q) && !a.excerpt.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [activeCategory, activeLevel, search]);

  useEffect(() => { setPage(1); }, [activeCategory, activeLevel, search]);

  const filteredFeatured = filtered.find(a => a.featured);
  const allRest  = filtered.filter(a => !a.featured || a.slug !== filteredFeatured?.slug);
  const rest     = allRest.slice(0, page * ITEMS_PER_PAGE);
  const hasMore  = rest.length < allRest.length;
  const isFiltering = activeCategory !== "Toutes" || activeLevel !== "Tous" || !!search;

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
        <div className="orb" style={{ width: 380, height: 380, background: "rgba(124,58,237,0.24)", top: -120, right: "3%", animationDelay: "2s" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(6,182,212,0.15)", bottom: -60, left: "8%", animationDelay: "9s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Toutes les publications</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Actualités</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Analyses, tutoriels et décryptages sur la data et l&apos;IA.
          </p>
        </div>
      </section>

      {/* ── FILTRES ───────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 58, zIndex: 40,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Recherche */}
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 340 }}>
            <label htmlFor="actualites-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
              Rechercher un article
            </label>
            <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="actualites-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              style={{ width: "100%", padding: "9px 12px 9px 34px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 13.5, background: "white", color: "var(--text)", fontFamily: "var(--font-body)", outline: "none" }}
            />
          </div>

          {/* Filtres catégorie */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ALL_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "6px 14px", borderRadius: 100, fontSize: 13, cursor: "pointer",
                  border: "none", fontFamily: "inherit",
                  fontWeight: activeCategory === cat ? 700 : 400,
                  background: activeCategory === cat ? "#7C3AED" : "#F1F5F9",
                  color: activeCategory === cat ? "#fff" : "#64748B",
                  transition: "all 0.15s",
                }}
              >
                {cat}
                <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
                  {cat === "Toutes" ? articles.length : articles.filter(a => a.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Séparateur */}
          <div style={{ width: 1, height: 20, background: "var(--border)", flexShrink: 0 }} />

          {/* Filtres niveau */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {ALL_LEVELS.map(lvl => (
              <button
                key={lvl}
                onClick={() => setActiveLevel(lvl)}
                style={{
                  padding: "6px 14px", borderRadius: 100, fontSize: 13, cursor: "pointer",
                  border: "1.5px solid",
                  fontFamily: "inherit",
                  fontWeight: activeLevel === lvl ? 700 : 400,
                  borderColor: activeLevel === lvl
                    ? (LEVEL_COLORS[lvl]?.color ?? "#7C3AED")
                    : "var(--border)",
                  background: activeLevel === lvl
                    ? (LEVEL_COLORS[lvl]?.bg ?? "#F1F5F9")
                    : "transparent",
                  color: activeLevel === lvl
                    ? (LEVEL_COLORS[lvl]?.color ?? "#7C3AED")
                    : "#64748B",
                  transition: "all 0.15s",
                }}
              >
                {lvl}
              </button>
            ))}
          </div>

          {isFiltering && (
            <button
              onClick={() => { setActiveCategory("Toutes"); setActiveLevel("Tous"); setSearch(""); }}
              style={{ padding: "6px 12px", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}
            >
              ✕ Réinitialiser
            </button>
          )}

          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
            {filtered.length} article{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── CONTENU ───────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>

        {/* Article vedette (seulement si pas de filtre actif ou si le featured passe le filtre) */}
        {filteredFeatured && !isFiltering && (
          <Link href={`/actualites/${filteredFeatured.slug}`} style={{ display: "block", marginBottom: 40, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.11)", transition: "box-shadow 0.2s, transform 0.2s" }}
            className="card"
          >
            <div style={{ height: 5, background: `linear-gradient(90deg, ${CATEGORY_ACCENT[filteredFeatured.categoryColor] ?? "var(--indigo)"}, transparent)` }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, padding: "36px 40px", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: CATEGORY_ACCENT[filteredFeatured.categoryColor] ?? "var(--indigo-light)" }}>
                    ★ Article vedette
                  </span>
                  <span className={`badge ${CATEGORY_COLORS[filteredFeatured.categoryColor] ?? "badge-neutral"}`}>{filteredFeatured.category}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 12, maxWidth: 620 }}>
                  {filteredFeatured.title}
                </h2>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65, maxWidth: 580, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {filteredFeatured.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{fmtDate(filteredFeatured.date)}</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{filteredFeatured.readTime} de lecture</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, padding: "16px 22px", background: "var(--indigo-tint)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--indigo-light)" }}>Lire l&apos;article</div>
                <div style={{ fontSize: 20, marginTop: 4 }}>→</div>
              </div>
            </div>
          </Link>
        )}

        {/* Grille articles */}
        {rest.length > 0 ? (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {rest.map((a) => (
                <Link key={a.slug} href={`/actualites/${a.slug}`} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ height: 4, background: CATEGORY_ACCENT[a.categoryColor] ?? "var(--indigo)" }} />
                  <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span className={`badge ${CATEGORY_COLORS[a.categoryColor] ?? "badge-neutral"}`}>{a.category}</span>
                        {(() => {
                          const lvl = (a as Record<string, unknown>)["level"] as string | undefined;
                          if (!lvl) return null;
                          return (
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 100,
                              background: LEVEL_COLORS[lvl]?.bg ?? "#F1F5F9",
                              color: LEVEL_COLORS[lvl]?.color ?? "#64748B",
                            }}>
                              {lvl}
                            </span>
                          );
                        })()}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--faint)", flexShrink: 0 }}>{a.readTime}</span>
                    </div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{a.title}</h2>
                    <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, flex: 1, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.excerpt}</p>
                    {(() => {
                      const tags = (a as Record<string, unknown>)["tags"] as string[] | undefined;
                      if (!tags?.length) return null;
                      return (
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)", fontWeight: 500 }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                      <span style={{ fontSize: 12, color: "var(--faint)" }}>{fmtDate(a.date)}</span>
                      <span style={{ fontSize: 13, color: CATEGORY_ACCENT[a.categoryColor] ?? "var(--indigo-light)", fontWeight: 700 }}>Lire →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <button
                  onClick={() => setPage(p => p + 1)}
                  style={{ padding: "12px 32px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, transition: "all 0.15s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--indigo)"; el.style.color = "var(--indigo)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--text)"; }}
                >
                  Voir plus · {allRest.length - rest.length} articles restants
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Aucun article ne correspond à ta recherche.</p>
            <button onClick={() => { setActiveCategory("Toutes"); setSearch(""); }} style={{ marginTop: 14, padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--indigo)", color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5 }}>
              Voir tous les articles
            </button>
          </div>
        )}
      </div>
    </>
  );
}
