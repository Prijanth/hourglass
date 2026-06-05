"use client";
import Link from "next/link";
import { useState } from "react";

type Outil = {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  emoji: string;
  open_source: boolean;
  free_tier: boolean;
  score: Record<string, number>;
};

function ScoreDot({ value }: { value: number }) {
  const color = value >= 85 ? "#14B8A6" : value >= 70 ? "#6366F1" : value >= 55 ? "#F59E0B" : "#F43F5E";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: "#F1F5F9", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 10 }} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color, minWidth: 26 }}>{value}</span>
    </div>
  );
}

function overallScore(scores: Record<string, number>) {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function OutilsGrid({ outils }: { outils: Outil[] }) {
  const categories = ["Tous", ...Array.from(new Set(outils.map(o => o.category)))];
  const [active, setActive] = useState("Tous");

  const filtered = active === "Tous" ? outils : outils.filter(o => o.category === active);

  return (
    <>
      {/* Filtres */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            style={{
              padding: "6px 14px", borderRadius: 100, fontSize: 13,
              fontWeight: active === cat ? 700 : 400,
              cursor: "pointer", border: "none", fontFamily: "inherit",
              background: active === cat ? "#7C3AED" : "#F1F5F9",
              color: active === cat ? "#fff" : "#64748B",
              transition: "all 0.15s",
            }}
          >
            {cat}
            <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.7 }}>
              {cat === "Tous" ? outils.length : outils.filter(o => o.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Grille */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        {filtered.map(o => {
          const overall = overallScore(o.score);
          const overallColor = overall >= 80 ? "#14B8A6" : overall >= 70 ? "#6366F1" : "#F59E0B";
          return (
            <Link key={o.slug} href={`/outils/${o.slug}`} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ height: 4, background: "var(--indigo)", opacity: 0.3 }} />
              <div style={{ padding: "22px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                      {o.emoji}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16 }}>{o.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{o.category}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: overallColor, letterSpacing: "-0.04em" }}>{overall}</div>
                    <div style={{ fontSize: 10, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Score</div>
                  </div>
                </div>

                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{o.tagline}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {Object.entries(o.score).slice(0, 3).map(([key, val]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "var(--faint)", width: 100, flexShrink: 0, textTransform: "capitalize" }}>{key.replace("_", " ")}</span>
                      <ScoreDot value={val} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {o.open_source && <span className="badge badge-teal">Open source</span>}
                    {o.free_tier && <span className="badge badge-neutral">Free tier</span>}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)" }}>Voir la fiche →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          Aucun outil dans cette catégorie.
        </div>
      )}
    </>
  );
}
