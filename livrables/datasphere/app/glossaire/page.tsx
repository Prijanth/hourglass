"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import glossaire from "@/content/glossaire.json";

const CATEGORIES = ["Tous", ...Array.from(new Set(glossaire.map((t) => t.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "badge-teal",
  Engineering: "badge-indigo",
  "IA Générative": "badge-rose",
  Transformation: "badge-amber",
  Architecture: "badge-neutral",
  Analytics: "badge-indigo",
  Processing: "badge-teal",
  Qualité: "badge-amber",
  DataOps: "badge-neutral",
  Gouvernance: "badge-neutral",
};

export default function GlossairePage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("Tous");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() =>
    glossaire.filter((t) => {
      const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "Tous" || t.category === activeCategory;
      return matchSearch && matchCat;
    }),
    [search, activeCategory]
  );

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
        <div className="orb" style={{ width: 340, height: 340, background: "rgba(124,58,237,0.24)", top: -100, right: "5%", animationDelay: "1s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(6,182,212,0.16)", bottom: -50, left: "12%", animationDelay: "7s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">{glossaire.length} termes définis</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Glossaire data &amp; IA</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Tous les concepts expliqués clairement, en français, avec des exemples concrets.
          </p>
        </div>
      </section>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>
      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 520 }}>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--faint)" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un terme..."
          style={{
            width: "100%",
            padding: "11px 16px 11px 40px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            fontSize: 14.5,
            outline: "none",
            background: "var(--surface)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
          }}
        />
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: activeCategory === cat ? 600 : 400,
            borderColor: activeCategory === cat ? "var(--indigo)" : "var(--border)",
            background: activeCategory === cat ? "var(--indigo-tint)" : "var(--surface)",
            color: activeCategory === cat ? "var(--indigo)" : "var(--muted)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Résultat count */}
      <div style={{ fontSize: 13, color: "var(--faint)", marginBottom: 20 }}>
        {filtered.length} terme{filtered.length > 1 ? "s" : ""} {search && `pour "${search}"`}
      </div>

      {/* Grille termes */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {filtered.map((term) => (
          <div key={term.term} className="card" style={{ padding: 22 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700 }}>{term.term}</h2>
              <span className={`badge ${CATEGORY_COLORS[term.category] ?? "badge-neutral"}`} style={{ flexShrink: 0 }}>{term.category}</span>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{term.definition}</p>
            {term.examples && term.examples.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {term.examples.map((ex) => (
                  <span key={ex} style={{ fontSize: 11.5, padding: "3px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--muted)" }}>{ex}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 15 }}>Aucun terme trouvé pour cette recherche.</p>
        </div>
      )}
    </div>
    </>
  );
}
