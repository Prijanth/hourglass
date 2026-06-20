"use client";
import { useState, useMemo } from "react";
import { udemyUrl, courseraUrl, datacampUrl } from "@/lib/affiliate";

type Formation = {
  id: string;
  title: string;
  provider: string;
  platform: string;
  level: string;
  duration: string;
  price: string;
  url: string;
  description: string;
  skills: string[];
  rating: number;
  students: string;
};

const LEVEL_CONFIG = {
  débutant:      { label: "Débutant",      badge: "badge-teal",  color: "#22D3EE", bg: "rgba(6,182,212,0.15)" },
  intermédiaire: { label: "Intermédiaire", badge: "badge-amber", color: "#FCD34D", bg: "rgba(251,191,36,0.15)" },
  avancé:        { label: "Avancé",        badge: "badge-rose",  color: "#FB7185", bg: "rgba(244,63,94,0.15)" },
} as const;
type Level = keyof typeof LEVEL_CONFIG;

const PLATFORM_CONFIG: Record<string, { label: string; emoji: string }> = {
  coursera:   { label: "Coursera",   emoji: "🎓" },
  udemy:      { label: "Udemy",      emoji: "🎯" },
  datacamp:   { label: "DataCamp",   emoji: "💻" },
  databricks: { label: "Databricks", emoji: "🧱" },
  aws:        { label: "AWS",        emoji: "☁️" },
  autre:      { label: "Autres",     emoji: "🌐" },
};

function getUrl(f: Formation): string {
  if (f.platform === "udemy")    return udemyUrl(f.url);
  if (f.platform === "coursera") return courseraUrl(f.url);
  if (f.platform === "datacamp") return datacampUrl(f.url);
  return f.url;
}

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

export function FormationsGrid({ formations }: { formations: Formation[] }) {
  const [search, setSearch]     = useState("");
  const [platform, setPlatform] = useState("tous");
  const [level, setLevel]       = useState("tous");

  const platforms = useMemo(() => {
    const found = new Set(formations.map(f => f.platform));
    return Object.keys(PLATFORM_CONFIG).filter(p => found.has(p));
  }, [formations]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return formations.filter(f => {
      if (platform !== "tous" && f.platform !== platform) return false;
      if (level !== "tous" && f.level !== level) return false;
      if (q) return (
        f.title.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.provider.toLowerCase().includes(q) ||
        f.skills.some(s => s.toLowerCase().includes(q))
      );
      return true;
    });
  }, [formations, search, platform, level]);

  const hasFilter = platform !== "tous" || level !== "tous" || search.trim() !== "";

  function Chip({ active, onClick, children, activeColor, activeBg }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
    activeColor?: string;
    activeBg?: string;
  }) {
    return (
      <button onClick={onClick} style={{
        padding: "5px 13px", borderRadius: 100, fontSize: 12.5,
        fontWeight: active ? 700 : 500, cursor: "pointer", fontFamily: "inherit",
        border: `1.5px solid ${active ? (activeColor ?? "var(--indigo)") : "var(--border)"}`,
        background: active ? (activeBg ?? "var(--indigo-tint)") : "var(--surface)",
        color: active ? (activeColor ?? "var(--indigo)") : "var(--muted)",
        transition: "all 0.12s",
        display: "inline-flex", alignItems: "center", gap: 5,
        whiteSpace: "nowrap" as const,
      }}>
        {children}
      </button>
    );
  }

  return (
    <>
      {/* Barre de filtres sticky */}
      <div style={{
        position: "sticky", top: 60, zIndex: 40,
        background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        padding: "10px 24px 10px",
        marginBottom: 32,
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Ligne 1 : recherche + count + reset */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 400 }}>
              <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher une formation, un skill..."
                className="input-field"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <span style={{ fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
              {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
            </span>
            {hasFilter && (
              <button
                onClick={() => { setSearch(""); setPlatform("tous"); setLevel("tous"); }}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "white", fontSize: 12.5, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}
              >
                ✕ Réinitialiser
              </button>
            )}
          </div>

          {/* Ligne 2 : chips plateforme + séparateur + chips niveau */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <Chip active={platform === "tous"} onClick={() => setPlatform("tous")}>
              🌐 Toutes plateformes
            </Chip>
            {platforms.map(p => {
              const cfg = PLATFORM_CONFIG[p];
              return (
                <Chip key={p} active={platform === p} onClick={() => setPlatform(p)}>
                  {cfg.emoji} {cfg.label}
                </Chip>
              );
            })}

            <div style={{ width: 1, height: 20, background: "var(--border)", margin: "0 2px" }} />

            <Chip active={level === "tous"} onClick={() => setLevel("tous")}>
              Tous niveaux
            </Chip>
            {(["débutant", "intermédiaire", "avancé"] as Level[]).map(l => {
              const cfg = LEVEL_CONFIG[l];
              return (
                <Chip key={l} active={level === l} onClick={() => setLevel(l)} activeColor={cfg.color} activeBg={cfg.bg}>
                  {cfg.label}
                </Chip>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grille */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 52px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Aucune formation trouvée pour ces critères.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 18 }}>
            {filtered.map(f => {
              const lvl = LEVEL_CONFIG[f.level as Level] ?? LEVEL_CONFIG.débutant;
              return (
                <div key={f.id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div style={{ height: 4, background: lvl.color }} />
                  <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", flex: 1, gap: 12 }}>

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 700, color: lvl.color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.provider}</span>
                          <span className={`badge ${lvl.badge}`} style={{ fontSize: 10, padding: "2px 7px" }}>{lvl.label}</span>
                        </div>
                        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{f.title}</h3>
                      </div>
                      <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 8, background: lvl.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
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
                        {f.students && <span style={{ fontSize: 12, color: "var(--faint)" }}>{f.students} apprenants</span>}
                      </div>
                      <RatingBar rating={f.rating} />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{f.price}</div>
                        <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{f.duration}</div>
                      </div>
                      <a
                        href={getUrl(f)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "8px 18px", background: lvl.color, color: "#07080F", borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: "var(--font-display)", display: "inline-flex", alignItems: "center", gap: 6 }}
                      >
                        Accéder
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                      </a>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p style={{ fontSize: 12.5, color: "var(--faint)", marginTop: 24 }}>
          Certains liens sont des liens d&apos;affiliation. Ils n&apos;ont aucun impact sur le prix que vous payez.
        </p>
      </div>
    </>
  );
}
