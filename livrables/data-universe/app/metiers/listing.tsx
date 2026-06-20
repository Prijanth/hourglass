"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import metiers from "@/content/metiers.json";

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
  "IA Générative":      "badge-rose",
};

type Metier = typeof metiers[number];

function groupByLevel(list: Metier[]) {
  const debutants = list.filter(m => m.level === "Accessible débutants");
  const techniques = list.filter(m => m.level === "Profil technique requis");
  const seniors = list.filter(m => (m.level as string).startsWith("Senior"));
  const autres = list.filter(m => !debutants.includes(m) && !techniques.includes(m) && !seniors.includes(m));
  return [
    { label: "Accessible aux débutants", emoji: "🟢", items: debutants },
    { label: "Profil technique requis",  emoji: "🔵", items: techniques },
    { label: "Profils seniors (7+ ans)", emoji: "🟡", items: seniors },
    { label: "En évolution",             emoji: "⚪", items: autres },
  ].filter(g => g.items.length > 0);
}

const ALL_CATEGORIES = ["Toutes", ...Array.from(new Set(metiers.map(m => m.category))).sort()];

export function MetiersListing() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Toutes");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return metiers.filter(m => {
      if (activeCategory !== "Toutes" && m.category !== activeCategory) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.skills?.some(s => s.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const groups = useMemo(() => groupByLevel(filtered), [filtered]);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px" }}>
      {/* Barre de recherche */}
      <div style={{ position: "relative", maxWidth: 520, marginBottom: 40 }}>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un métier, une compétence..."
          style={{
            width: "100%", padding: "11px 36px 11px 42px",
            border: "1px solid var(--border)", borderRadius: 10,
            fontSize: 14.5, background: "var(--surface)",
            color: "var(--text)", fontFamily: "var(--font-body)",
            outline: "none",
          }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#CBD5E1", fontSize: 15, padding: 2, lineHeight: 1,
          }}>✕</button>
        )}
      </div>

      {/* Filtres catégorie */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {ALL_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 14px", borderRadius: 100, fontSize: 13, cursor: "pointer",
            border: "none", fontFamily: "inherit",
            fontWeight: activeCategory === cat ? 700 : 400,
            background: activeCategory === cat ? "#7C3AED" : "#F1F5F9",
            color: activeCategory === cat ? "#fff" : "#64748B",
            transition: "all 0.15s",
          }}>
            {cat}
            <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
              {cat === "Toutes" ? metiers.length : metiers.filter(m => m.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {(search || activeCategory !== "Toutes") && (
        <div style={{ fontSize: 13, color: "var(--faint)", marginBottom: 28 }}>
          {filtered.length} métier{filtered.length > 1 ? "s" : ""}
          {search && <> pour &quot;{search}&quot;</>}
          {activeCategory !== "Toutes" && <> en <strong>{activeCategory}</strong></>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 15 }}>Aucun métier trouvé pour &quot;{search}&quot;</p>
        </div>
      ) : (
        groups.map(group => (
          <div key={group.label} style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 18 }}>{group.emoji}</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, margin: 0 }}>{group.label}</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {group.items.map(m => (
                <Link key={m.slug} href={`/metiers/${m.slug}`} className="card" style={{ padding: "28px 32px", display: "block", textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                        <span className={`badge ${CATEGORY_BADGE[m.category] ?? "badge-neutral"}`}>{m.category}</span>
                        <span className={`badge ${DEMAND_BADGE[m.demand] ?? "badge-neutral"}`}>Demande {m.demand.toLowerCase()}</span>
                        <span className="badge badge-neutral">{m.remoteRate}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{m.title}</h3>
                      <p style={{ fontSize: 14, color: "var(--muted)" }}>{m.tagline}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ background: "var(--indigo-tint)", borderRadius: 14, padding: "12px 18px", marginBottom: 8 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "var(--indigo)", letterSpacing: "-0.04em", lineHeight: 1 }}>
                          {m.salaryMin}–{m.salaryMax}k€
                        </div>
                        <div style={{ fontSize: 10.5, color: "var(--indigo)", opacity: 0.6, marginTop: 3 }}>brut annuel</div>
                      </div>
                      {m.salaryJuniorParis && !m.salaryJuniorParis.startsWith("Non") && (
                        <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>
                          <span style={{ fontWeight: 600, color: "#16A34A" }}>Junior Paris :</span> {m.salaryJuniorParis}
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>{m.description}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Compétences</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {m.skills.map(s => <span key={s} className="skill-pill">{s}</span>)}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Certifications</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {m.certifications.map(c => (
                          <span key={c} className="badge badge-neutral" style={{ display: "inline-flex", fontSize: 11.5 }}>{c}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)", marginBottom: 10 }}>Évolution</p>
                      {m.evolution.slice(0, 4).map((e, i) => (
                        <div key={e} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--indigo-tint)", color: "var(--indigo)", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ fontSize: 13 }}>{e}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
