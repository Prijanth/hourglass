"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import jobs from "@/content/jobs.json";

const ALL_TYPES   = ["Tous", "CDI", "Freelance"];
const ALL_LEVELS  = ["Tous", "Junior", "Intermédiaire", "Senior"];
const ALL_SECTORS = ["Tous", ...Array.from(new Set(jobs.map(j => j.sector))).sort()];

const LEVEL_COLORS: Record<string, { bg: string; color: string }> = {
  Junior:         { bg: "#F0FDF4", color: "#15803D" },
  Intermédiaire: { bg: "#FEF3C7", color: "#92400E" },
  Senior:         { bg: "#EDE9FE", color: "#5B21B6" },
};

const TYPE_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  CDI:       { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  Freelance: { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
  Stage:     { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
};

function daysSince(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days} jours`;
  if (days < 14) return "Il y a 1 semaine";
  return `Il y a ${Math.floor(days / 7)} semaines`;
}

export function JobsListing() {
  const [activeType,   setActiveType]   = useState("Tous");
  const [activeLevel,  setActiveLevel]  = useState("Tous");
  const [activeSector, setActiveSector] = useState("Tous");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter(j => {
      if (activeType   !== "Tous" && j.type  !== activeType)   return false;
      if (activeLevel  !== "Tous" && j.level !== activeLevel)  return false;
      if (activeSector !== "Tous" && j.sector !== activeSector) return false;
      if (q && !j.title.toLowerCase().includes(q) &&
               !j.company.toLowerCase().includes(q) &&
               !j.tech.some(t => t.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [activeType, activeLevel, activeSector, search]);

  const isFiltering = activeType !== "Tous" || activeLevel !== "Tous" || activeSector !== "Tous" || !!search;

  return (
    <section style={{ padding: "52px 24px 0", maxWidth: 1100, margin: "0 auto" }}>

      {/* Header section */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        <div>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#7C3AED" }}>
            Board natif
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.025em", marginTop: 4 }}>
            Offres data &amp; IA en France
          </h2>
        </div>
        <span style={{ fontSize: 13, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>
          {filtered.length} offre{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Filtres */}
      <div style={{
        background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 14,
        padding: "16px 20px", marginBottom: 28,
        display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center",
      }}>
        {/* Recherche */}
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 300 }}>
          <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Titre, entreprise, techno..."
            style={{ width: "100%", padding: "8px 10px 8px 30px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, background: "white", color: "var(--text)", fontFamily: "var(--font-body)", outline: "none" }}
          />
        </div>

        <div style={{ width: 1, height: 20, background: "#E2E8F0" }} />

        {/* Type */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {ALL_TYPES.map(t => (
            <button key={t} onClick={() => setActiveType(t)} style={{
              padding: "5px 12px", borderRadius: 100, fontSize: 12.5, cursor: "pointer",
              fontFamily: "inherit", border: "none",
              fontWeight: activeType === t ? 700 : 400,
              background: activeType === t ? "#7C3AED" : "#fff",
              color: activeType === t ? "#fff" : "#64748B",
              boxShadow: activeType === t ? "none" : "0 0 0 1px #E2E8F0",
              transition: "all 0.15s",
            }}>
              {t}
            </button>
          ))}
        </div>

        {/* Level */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {ALL_LEVELS.map(l => (
            <button key={l} onClick={() => setActiveLevel(l)} style={{
              padding: "5px 12px", borderRadius: 100, fontSize: 12.5, cursor: "pointer",
              fontFamily: "inherit", border: "1.5px solid",
              fontWeight: activeLevel === l ? 700 : 400,
              borderColor: activeLevel === l ? (LEVEL_COLORS[l]?.color ?? "#7C3AED") : "#E2E8F0",
              background: activeLevel === l ? (LEVEL_COLORS[l]?.bg ?? "#F1F5F9") : "white",
              color: activeLevel === l ? (LEVEL_COLORS[l]?.color ?? "#7C3AED") : "#64748B",
              transition: "all 0.15s",
            }}>
              {l}
            </button>
          ))}
        </div>

        {isFiltering && (
          <button onClick={() => { setActiveType("Tous"); setActiveLevel("Tous"); setActiveSector("Tous"); setSearch(""); }}
            style={{ padding: "5px 10px", borderRadius: 8, border: "1px solid #E2E8F0", background: "white", fontSize: 12, cursor: "pointer", color: "#94A3B8", fontFamily: "inherit" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Grille offres */}
      {filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 52 }}>
          {filtered.map(job => {
            const lc = LEVEL_COLORS[job.level];
            const tc = TYPE_COLORS[job.type] ?? TYPE_COLORS["CDI"];
            return (
              <div key={job.id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
                {/* Initiales entreprise */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: "linear-gradient(135deg, var(--indigo), var(--teal))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "#fff",
                  letterSpacing: "-0.02em",
                }}>
                  {job.company.substring(0, 2).toUpperCase()}
                </div>

                {/* Contenu principal */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>
                        {job.title}
                      </h3>
                      <p style={{ fontSize: 13.5, color: "#64748B" }}>
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
                        {job.salary}
                      </p>
                      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{daysSince(job.posted)}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>
                    {job.description}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    {/* Badges type + niveau */}
                    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                      {job.type}
                    </span>
                    {lc && (
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: lc.bg, color: lc.color }}>
                        {job.level}
                      </span>
                    )}
                    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, background: "#F1F5F9", color: "#64748B" }}>
                      {job.remote}
                    </span>
                    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, background: "#F1F5F9", color: "#64748B" }}>
                      {job.sector}
                    </span>

                    {/* Tech stack */}
                    <span style={{ color: "#CBD5E1", fontSize: 12 }}>·</span>
                    {job.tech.slice(0, 3).map(t => (
                      <span key={t} style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontFamily: "var(--font-mono)", background: "#0F1629", color: "#A5B4FC", fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                    {job.tech.length > 3 && (
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>+{job.tech.length - 3}</span>
                    )}

                    {/* CTA */}
                    <Link href={`/metiers/${job.metier}`} style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: "#7C3AED", textDecoration: "none", flexShrink: 0 }}>
                      Voir le métier →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8", marginBottom: 52 }}>
          <p style={{ fontSize: 15 }}>Aucune offre ne correspond à ta recherche.</p>
          <button onClick={() => { setActiveType("Tous"); setActiveLevel("Tous"); setActiveSector("Tous"); setSearch(""); }}
            style={{ marginTop: 12, padding: "8px 18px", borderRadius: 8, border: "none", background: "#7C3AED", color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
            Voir toutes les offres
          </button>
        </div>
      )}
    </section>
  );
}
