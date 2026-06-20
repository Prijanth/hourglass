import type { Metadata } from "next";
import Link from "next/link";
import { EcosystemViz } from "./ecosystem-viz";

export const metadata: Metadata = {
  title: "Carte de l'écosystème data — Modern Data Stack 2026 | Data Universe",
  description:
    "Visualisez le Modern Data Stack de bout en bout : sources, ingestion, stockage, transformation, ML et consommation. Tous les outils data organisés par couche, avec les combos les plus populaires en 2026.",
};

const LAYERS_META = [
  { id: "sources",        label: "Sources",           color: "#64748B", bg: "#F8FAFC",  border: "rgba(100,116,139,0.25)" },
  { id: "ingestion",      label: "Ingestion / EL",    color: "#0E7490", bg: "#ECFEFF",  border: "rgba(14,116,144,0.25)"  },
  { id: "stockage",       label: "Stockage",          color: "#7C3AED", bg: "#F5F3FF",  border: "rgba(124,58,237,0.25)"  },
  { id: "transformation", label: "Transformation",    color: "#C2410C", bg: "#FFF7ED",  border: "rgba(194,65,12,0.25)"   },
  { id: "ml",             label: "Feature Store / ML",color: "#BE123C", bg: "#FFF1F2",  border: "rgba(190,18,60,0.25)"   },
  { id: "consommation",   label: "BI / Consommation", color: "#15803D", bg: "#F0FDF4",  border: "rgba(21,128,61,0.25)"   },
];

export default function EcosystemPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
        padding: "64px 24px 48px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.14)",
      }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.08)", top: -150, right: "-5%", filter: "blur(80px)" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, fontSize: 13, color: "#94A3B8" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Modern Data Stack</span>
          </div>
          <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            Cartographie interactive
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16, maxWidth: 700 }}>
            L&apos;écosystème data{" "}
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>de bout en bout</span>
          </h1>
          <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.75, maxWidth: 580, marginBottom: 28 }}>
            Du fichier CSV brut au dashboard Power BI. Cliquez sur un outil pour voir ses détails.
            Filtrez par couche ou utilisez la recherche.
          </p>

          {/* Flow pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {LAYERS_META.map((l, i) => (
              <span key={l.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", background: l.bg, border: `1px solid ${l.border}`, borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: l.color }}>
                  {l.label}
                </span>
                {i < LAYERS_META.length - 1 && <span style={{ color: "#CBD5E1", fontSize: 13 }}>→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Composant interactif (client) */}
      <EcosystemViz />
    </main>
  );
}
