"use client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ToolLogo } from "@/components/tool-logo";

type Outil = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  emoji: string;
  open_source: boolean;
  free_tier: boolean;
  best_for?: string;
  tags?: string[];
  pricing?: string;
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function OutilsGrid({ outils }: { outils: Outil[] }) {
  const sorted = useMemo(() => [...outils].sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" })), [outils]);

  const categories = useMemo(() => ["Tous", ...Array.from(new Set(sorted.map(o => o.category)))], [sorted]);

  const [activeCat,    setActiveCat]    = useState("Tous");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [search,       setSearch]       = useState("");

  // Lettres disponibles dans la catégorie active
  const availableLetters = useMemo(() => {
    const pool = activeCat === "Tous" ? sorted : sorted.filter(o => o.category === activeCat);
    return new Set(pool.map(o => o.name[0].toUpperCase()));
  }, [sorted, activeCat]);

  const filtered = useMemo(() => sorted.filter(o => {
    if (activeCat !== "Tous" && o.category !== activeCat) return false;
    if (activeLetter && o.name[0].toUpperCase() !== activeLetter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return o.name.toLowerCase().includes(q) || o.tagline.toLowerCase().includes(q) || o.category.toLowerCase().includes(q);
    }
    return true;
  }), [sorted, activeCat, activeLetter, search]);

  function handleLetter(l: string) {
    setActiveLetter(prev => prev === l ? null : l);
    setSearch("");
  }

  function handleCat(cat: string) {
    setActiveCat(cat);
    setActiveLetter(null);
  }

  return (
    <>
      {/* Recherche */}
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 480 }}>
        <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
          placeholder="Rechercher un outil..."
          style={{ width: "100%", padding: "10px 36px 10px 38px", border: "1px solid var(--border)", borderRadius: 10, fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", outline: "none" }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", fontSize: 14, padding: 2 }}>✕</button>
        )}
      </div>

      {/* Filtre alphabétique */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--faint)", letterSpacing: "0.08em", textTransform: "uppercase", marginRight: 4 }}>A–Z</span>
        {ALPHABET.map(l => {
          const available = availableLetters.has(l);
          const isActive  = activeLetter === l;
          return (
            <button
              key={l}
              onClick={() => available && handleLetter(l)}
              disabled={!available}
              style={{
                width: 30, height: 30,
                borderRadius: 7,
                border: isActive ? "none" : "1px solid var(--border)",
                fontSize: 12.5,
                fontWeight: isActive ? 800 : 500,
                fontFamily: "var(--font-display)",
                cursor: available ? "pointer" : "default",
                transition: "all 0.12s",
                background: isActive ? "var(--indigo)" : available ? "var(--surface)" : "transparent",
                color: isActive ? "#fff" : available ? "var(--text)" : "var(--border)",
                boxShadow: isActive ? "0 2px 8px rgba(124,58,237,0.3)" : "none",
              }}
            >
              {l}
            </button>
          );
        })}
        {activeLetter && (
          <button
            onClick={() => setActiveLetter(null)}
            style={{ marginLeft: 4, padding: "4px 10px", borderRadius: 7, border: "1px solid var(--border)", fontSize: 12, color: "var(--muted)", background: "var(--surface)", cursor: "pointer", fontFamily: "inherit" }}
          >
            ✕ Effacer
          </button>
        )}
      </div>

      {/* Filtres catégorie */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCat(cat)}
            style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 13,
              fontWeight: activeCat === cat ? 700 : 400,
              cursor: "pointer", border: "none", fontFamily: "inherit",
              background: activeCat === cat ? "#7C3AED" : "#F1F5F9",
              color: activeCat === cat ? "#fff" : "#64748B",
              transition: "all 0.15s",
            }}
          >
            {cat}
            <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
              {cat === "Tous" ? sorted.length : sorted.filter(o => o.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Compteur résultats */}
      {(activeLetter || activeCat !== "Tous" || search) && (
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
          <strong style={{ color: "var(--indigo)" }}>{filtered.length}</strong> outil{filtered.length > 1 ? "s" : ""}
          {activeLetter && <> commençant par <strong>{activeLetter}</strong></>}
          {activeCat !== "Tous" && <> dans <strong>{activeCat}</strong></>}
          {search && <> pour <strong>« {search} »</strong></>}
        </p>
      )}

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map(o => (
          <div key={o.slug} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ height: 3, background: "var(--indigo)", opacity: 0.25 }} />
            <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 8 }}>
                  <ToolLogo slug={o.slug} emoji={o.emoji} name={o.name} size={28} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>{o.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{o.category}</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{o.tagline}</p>
              {o.best_for && (
                <div style={{ padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10, borderLeft: "3px solid #EDE9FE" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--faint)", marginBottom: 5 }}>Idéal pour</p>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>{o.best_for}</p>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {o.open_source && <span className="badge badge-teal">Open source</span>}
                  {o.free_tier && <span className="badge badge-neutral">Free tier</span>}
                  {o.tags?.slice(0, 2).map(t => (
                    <span key={t} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "#F1F5F9", color: "#64748B", border: "1px solid var(--border)" }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                  <Link
                    href={`/comparateur?a=${o.slug}`}
                    style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)", color: "var(--muted)", background: "var(--surface)", fontWeight: 500, transition: "all 0.15s", whiteSpace: "nowrap" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--indigo)"; el.style.color = "var(--indigo)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border)"; el.style.color = "var(--muted)"; }}
                  >
                    Comparer
                  </Link>
                  <Link href={`/outils/${o.slug}`} style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)", whiteSpace: "nowrap" }}>
                    Voir →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🔍</div>
          <p style={{ fontSize: 14 }}>
            {search ? `Aucun outil pour « ${search} »` : `Aucun outil commençant par ${activeLetter ?? "cette lettre"}.`}
          </p>
        </div>
      )}
    </>
  );
}
