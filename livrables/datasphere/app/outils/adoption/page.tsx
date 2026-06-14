"use client";

import { useState } from "react";

/* ─── Types & Données ─────────────────────────────────────── */

type Adoption = "tres-fort" | "fort" | "modere" | "rare" | "na";

const ADOPTION_CONFIG: Record<Adoption, { label: string; emoji: string; color: string; bg: string; border: string; score: number }> = {
  "tres-fort": { label: "Très fort",   emoji: "🟢", color: "#15803D", bg: "#DCFCE7", border: "#86EFAC", score: 4 },
  "fort":      { label: "Fort",        emoji: "🟡", color: "#B45309", bg: "#FEF9C3", border: "#FDE047", score: 3 },
  "modere":    { label: "Modéré",      emoji: "🟠", color: "#C2410C", bg: "#FFEDD5", border: "#FED7AA", score: 2 },
  "rare":      { label: "Rare",        emoji: "⚪", color: "#64748B", bg: "#F1F5F9", border: "#CBD5E1", score: 1 },
  "na":        { label: "N/A",         emoji: "—",  color: "#CBD5E1", bg: "#F8FAFC", border: "#E2E8F0", score: 0 },
};

const SECTORS = [
  { id: "banque",    label: "Banque / Assurance",    emoji: "🏦", color: "#7C3AED" },
  { id: "retail",    label: "Retail / E-commerce",   emoji: "🛍️", color: "#0E7490" },
  { id: "sante",     label: "Santé / Pharma",        emoji: "🏥", color: "#15803D" },
  { id: "industrie", label: "Industrie",              emoji: "🏭", color: "#C2410C" },
  { id: "conseil",   label: "Conseil Data",           emoji: "💼", color: "#B45309" },
  { id: "tech",      label: "Tech / Startups",        emoji: "💻", color: "#6D28D9" },
  { id: "energie",   label: "Énergie / Utilities",   emoji: "⚡", color: "#0369A1" },
  { id: "medias",    label: "Médias / Telecom",       emoji: "📡", color: "#BE123C" },
];

type ToolEntry = {
  name: string;
  emoji: string;
  category: string;
  adoption: Record<string, Adoption>;
};

const TOOLS: ToolEntry[] = [
  {
    name: "Snowflake",
    emoji: "❄️",
    category: "Data Platform",
    adoption: {
      banque: "fort", retail: "tres-fort", sante: "fort", industrie: "modere",
      conseil: "tres-fort", tech: "tres-fort", energie: "modere", medias: "fort",
    },
  },
  {
    name: "Databricks",
    emoji: "🧱",
    category: "Data Platform",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "tres-fort", industrie: "fort",
      conseil: "fort", tech: "tres-fort", energie: "fort", medias: "modere",
    },
  },
  {
    name: "dbt",
    emoji: "🔧",
    category: "Transformation",
    adoption: {
      banque: "fort", retail: "tres-fort", sante: "modere", industrie: "modere",
      conseil: "tres-fort", tech: "tres-fort", energie: "modere", medias: "fort",
    },
  },
  {
    name: "Apache Spark",
    emoji: "⚡",
    category: "Transformation",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "fort", industrie: "tres-fort",
      conseil: "fort", tech: "fort", energie: "tres-fort", medias: "fort",
    },
  },
  {
    name: "Airflow",
    emoji: "🌊",
    category: "Orchestration",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "fort", industrie: "fort",
      conseil: "tres-fort", tech: "tres-fort", energie: "fort", medias: "fort",
    },
  },
  {
    name: "Power BI",
    emoji: "📊",
    category: "BI & Visualisation",
    adoption: {
      banque: "tres-fort", retail: "tres-fort", sante: "tres-fort", industrie: "tres-fort",
      conseil: "tres-fort", tech: "modere", energie: "tres-fort", medias: "fort",
    },
  },
  {
    name: "Tableau",
    emoji: "📉",
    category: "BI & Visualisation",
    adoption: {
      banque: "fort", retail: "fort", sante: "fort", industrie: "modere",
      conseil: "fort", tech: "modere", energie: "modere", medias: "fort",
    },
  },
  {
    name: "Looker",
    emoji: "🔭",
    category: "BI & Visualisation",
    adoption: {
      banque: "modere", retail: "fort", sante: "modere", industrie: "rare",
      conseil: "fort", tech: "tres-fort", energie: "rare", medias: "fort",
    },
  },
  {
    name: "Apache Kafka",
    emoji: "🔴",
    category: "Streaming",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "modere", industrie: "fort",
      conseil: "modere", tech: "tres-fort", energie: "fort", medias: "tres-fort",
    },
  },
  {
    name: "BigQuery",
    emoji: "🔵",
    category: "Data Platform",
    adoption: {
      banque: "modere", retail: "tres-fort", sante: "modere", industrie: "modere",
      conseil: "fort", tech: "tres-fort", energie: "modere", medias: "tres-fort",
    },
  },
  {
    name: "Azure Synapse",
    emoji: "🔷",
    category: "Data Platform",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "fort", industrie: "tres-fort",
      conseil: "fort", tech: "modere", energie: "tres-fort", medias: "modere",
    },
  },
  {
    name: "Fivetran / Airbyte",
    emoji: "🔄",
    category: "Ingestion",
    adoption: {
      banque: "fort", retail: "tres-fort", sante: "modere", industrie: "modere",
      conseil: "tres-fort", tech: "tres-fort", energie: "modere", medias: "fort",
    },
  },
  {
    name: "Python / Pandas",
    emoji: "🐍",
    category: "Transformation",
    adoption: {
      banque: "tres-fort", retail: "tres-fort", sante: "tres-fort", industrie: "tres-fort",
      conseil: "tres-fort", tech: "tres-fort", energie: "tres-fort", medias: "tres-fort",
    },
  },
  {
    name: "MLflow",
    emoji: "🔬",
    category: "MLOps",
    adoption: {
      banque: "fort", retail: "modere", sante: "tres-fort", industrie: "modere",
      conseil: "fort", tech: "tres-fort", energie: "modere", medias: "rare",
    },
  },
  {
    name: "Dataiku",
    emoji: "🎨",
    category: "MLOps",
    adoption: {
      banque: "tres-fort", retail: "fort", sante: "fort", industrie: "fort",
      conseil: "tres-fort", tech: "modere", energie: "fort", medias: "modere",
    },
  },
  {
    name: "SAS",
    emoji: "📐",
    category: "BI & Visualisation",
    adoption: {
      banque: "tres-fort", retail: "modere", sante: "tres-fort", industrie: "modere",
      conseil: "fort", tech: "rare", energie: "modere", medias: "rare",
    },
  },
];

const CATEGORIES = ["Toutes", "Data Platform", "Ingestion", "Transformation", "Orchestration", "Streaming", "BI & Visualisation", "MLOps"];

const CAT_COLORS: Record<string, string> = {
  "Data Platform":      "#7C3AED",
  "Ingestion":          "#0E7490",
  "Transformation":     "#C2410C",
  "Orchestration":      "#B45309",
  "Streaming":          "#BE123C",
  "BI & Visualisation": "#15803D",
  "MLOps":              "#6D28D9",
};

const CAT_BG: Record<string, string> = {
  "Data Platform":      "#F5F3FF",
  "Ingestion":          "#ECFEFF",
  "Transformation":     "#FFF7ED",
  "Orchestration":      "#FFFBEB",
  "Streaming":          "#FFF1F2",
  "BI & Visualisation": "#F0FDF4",
  "MLOps":              "#EDE9FE",
};

/* ─── Composant cellule adoption ──────────────────────────── */

function AdoptionCell({ value }: { value: Adoption }) {
  const cfg = ADOPTION_CONFIG[value];
  return (
    <div
      title={cfg.label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: 40,
        background: cfg.bg,
        borderRadius: 6,
        fontSize: 16,
        transition: "transform 0.15s",
        cursor: "default",
      }}
    >
      <span title={cfg.label}>{cfg.emoji}</span>
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function AdoptionPage() {
  const [activeCategory, setActiveCategory] = useState("Toutes");
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  const filteredTools = activeCategory === "Toutes"
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory);

  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "72px 24px 60px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 480, height: 480, background: "rgba(124,58,237,0.16)", top: -160, right: "-4%", animationDelay: "0s" }} />
        <div className="orb" style={{ width: 280, height: 280, background: "rgba(21,128,61,0.1)", bottom: -60, left: "8%", animationDelay: "10s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">🗺️ Adoption 2026</span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 3.8vw, 3rem)",
            fontWeight: 800,
            color: "var(--text)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: 16,
            maxWidth: 800,
          }}>
            Carte d&apos;adoption des outils data{" "}
            <span className="text-gradient">par secteur</span>
          </h1>

          <p style={{ fontSize: 15.5, color: "var(--muted)", lineHeight: 1.7, maxWidth: 640, marginBottom: 28 }}>
            Quels outils sont utilisés dans quels secteurs en France ? Ce tableau synthétise
            l&apos;analyse des offres d&apos;emploi, des retours de praticiens et des benchmarks
            du marché français à mi-2026.
          </p>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            {(Object.entries(ADOPTION_CONFIG) as [Adoption, typeof ADOPTION_CONFIG[Adoption]][]).filter(([k]) => k !== "na").map(([key, cfg]) => (
              <span key={key} style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 12px",
                background: cfg.bg,
                border: `1.5px solid ${cfg.border}`,
                borderRadius: 100,
                fontSize: 12,
                fontWeight: 700,
                color: cfg.color,
              }}>
                {cfg.emoji} {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTRES ───────────────────────────────────────────── */}
      <div style={{
        position: "sticky",
        top: 58,
        zIndex: 40,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "12px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>
              Filtrer :
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "5px 13px",
                  borderRadius: 100,
                  border: `1.5px solid ${activeCategory === cat ? (CAT_COLORS[cat] || "var(--indigo)") : "var(--border)"}`,
                  background: activeCategory === cat ? (CAT_BG[cat] || "var(--lavender)") : "#fff",
                  color: activeCategory === cat ? (CAT_COLORS[cat] || "var(--indigo)") : "var(--muted)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-body)",
                }}
              >
                {cat}
              </button>
            ))}
            <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
              {filteredTools.length} outil{filteredTools.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── HEATMAP TABLE ─────────────────────────────────────── */}
      <section style={{ padding: "36px 24px 64px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 860,
            }}>
              {/* THEAD */}
              <thead>
                <tr>
                  {/* Corner cell */}
                  <th style={{
                    padding: "14px 18px",
                    background: "var(--surface-2)",
                    borderBottom: "2px solid var(--border)",
                    borderRight: "2px solid var(--border)",
                    textAlign: "left",
                    position: "sticky",
                    left: 0,
                    zIndex: 10,
                  }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 11.5, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Outil ↓ &nbsp;·&nbsp; Secteur →
                    </div>
                  </th>

                  {SECTORS.map((s) => (
                    <th
                      key={s.id}
                      onMouseEnter={() => setHoveredSector(s.id)}
                      onMouseLeave={() => setHoveredSector(null)}
                      style={{
                        padding: "10px 8px",
                        background: hoveredSector === s.id ? s.color : "var(--surface-2)",
                        borderBottom: "2px solid var(--border)",
                        borderLeft: "1px solid var(--border)",
                        textAlign: "center",
                        minWidth: 110,
                        transition: "background 0.15s",
                        cursor: "default",
                      }}
                    >
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{s.emoji}</div>
                      <div style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 10.5,
                        fontWeight: 800,
                        color: hoveredSector === s.id ? "#fff" : s.color,
                        lineHeight: 1.25,
                        transition: "color 0.15s",
                      }}>
                        {s.label.split(" / ").map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* TBODY */}
              <tbody>
                {filteredTools.map((tool, rowIdx) => {
                  const catColor = CAT_COLORS[tool.category] || "var(--indigo)";
                  const catBg = CAT_BG[tool.category] || "var(--lavender)";
                  const isHovered = hoveredTool === tool.name;
                  return (
                    <tr
                      key={tool.name}
                      onMouseEnter={() => setHoveredTool(tool.name)}
                      onMouseLeave={() => setHoveredTool(null)}
                      style={{
                        background: isHovered ? `${catBg}80` : rowIdx % 2 === 0 ? "#fff" : "var(--surface-2)",
                        transition: "background 0.15s",
                      }}
                    >
                      {/* Tool name cell */}
                      <td style={{
                        padding: "10px 16px",
                        borderBottom: "1px solid var(--border)",
                        borderRight: "2px solid var(--border)",
                        position: "sticky",
                        left: 0,
                        background: isHovered ? catBg : rowIdx % 2 === 0 ? "#fff" : "var(--surface-2)",
                        zIndex: 5,
                        transition: "background 0.15s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            background: catBg,
                            border: `1px solid ${catColor}33`,
                            borderRadius: 8,
                            fontSize: 16,
                            flexShrink: 0,
                          }}>{tool.emoji}</span>
                          <div>
                            <div style={{
                              fontFamily: "var(--font-display)",
                              fontSize: 13.5,
                              fontWeight: 700,
                              color: "var(--text)",
                              lineHeight: 1.2,
                            }}>{tool.name}</div>
                            <div style={{
                              display: "inline-flex",
                              alignItems: "center",
                              marginTop: 3,
                              padding: "1.5px 7px",
                              background: catBg,
                              border: `1px solid ${catColor}33`,
                              borderRadius: 100,
                              fontSize: 10,
                              fontWeight: 700,
                              color: catColor,
                            }}>{tool.category}</div>
                          </div>
                        </div>
                      </td>

                      {/* Adoption cells */}
                      {SECTORS.map((s) => {
                        const val = (tool.adoption[s.id] as Adoption) || "na";
                        const isHighlightedCol = hoveredSector === s.id;
                        return (
                          <td
                            key={s.id}
                            style={{
                              padding: "6px 8px",
                              borderBottom: "1px solid var(--border)",
                              borderLeft: "1px solid var(--border)",
                              background: isHighlightedCol ? `${s.color}08` : "transparent",
                              transition: "background 0.15s",
                            }}
                          >
                            <AdoptionCell value={val} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Note de bas de tableau */}
          <p style={{
            marginTop: 16,
            fontSize: 12,
            color: "var(--muted)",
            lineHeight: 1.6,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
          }}>
            <span style={{ opacity: 0.7, flexShrink: 0 }}>ℹ️</span>
            <span>
              Données basées sur l&apos;analyse des offres d&apos;emploi françaises (LinkedIn, Welcome to the Jungle, Indeed),
              des retours de praticiens de la communauté DataSphère et des benchmarks du marché à mi-2026.
              Les niveaux d&apos;adoption reflètent la fréquence d&apos;utilisation dans chaque secteur, pas la popularité globale.
            </span>
          </p>
        </div>
      </section>

      {/* ── INSIGHTS PAR SECTEUR ──────────────────────────────── */}
      <section style={{
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border)",
        padding: "52px 24px 60px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 32 }}>
            <span className="section-label">💡 Insights sectoriels</span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.025em",
              marginBottom: 8,
            }}>Ce que le marché français nous apprend</h2>
            <p style={{ fontSize: 14.5, color: "var(--muted)", lineHeight: 1.65, maxWidth: 580 }}>
              Trois observations clés issues de l&apos;analyse des données d&apos;adoption.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 20,
          }}>
            {[
              {
                emoji: "🏦",
                titre: "Banque / Assurance : la plus mature",
                desc: "Le secteur financier français a les stacks data les plus consolidées. Databricks, Azure Synapse, Power BI et Dataiku dominent — avec une forte présence de SAS pour les modèles de risque réglementaires (IFRS 9, TRIM, Bâle IV).",
                highlight: "SAS encore très présent en 2026",
                highlightColor: "#7C3AED",
                highlightBg: "#F5F3FF",
              },
              {
                emoji: "💻",
                titre: "Tech / Startups : le plus cloud-native",
                desc: "Les startups tech adoptent massivement Snowflake, BigQuery, dbt et des outils open-source (Airbyte, MLflow). Stack entièrement managée et serverless — le time-to-data est la priorité absolue.",
                highlight: "Python + dbt + Snowflake = stack par défaut",
                highlightColor: "#0E7490",
                highlightBg: "#ECFEFF",
              },
              {
                emoji: "🏥",
                titre: "Santé / Pharma : ML en forte croissance",
                desc: "Le secteur santé connaît la plus forte croissance en adoption de MLOps (Databricks, MLflow). La contrainte RGPD et HDS impose des environnements souverains (Azure France, OVHcloud). SAS reste incontournable pour les essais cliniques.",
                highlight: "Databricks + Azure = combo standard pharma",
                highlightColor: "#15803D",
                highlightBg: "#F0FDF4",
              },
            ].map((insight) => (
              <div key={insight.titre} className="card" style={{ padding: "22px 22px 20px" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{insight.emoji}</div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}>{insight.titre}</h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14 }}>{insight.desc}</p>
                <div style={{
                  padding: "8px 12px",
                  background: insight.highlightBg,
                  border: `1px solid ${insight.highlightColor}33`,
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  color: insight.highlightColor,
                }}>
                  📌 {insight.highlight}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ padding: "52px 24px 64px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.3rem, 2.5vw, 1.85rem)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}>
            Vous cherchez à comparer des outils en détail ?
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65, marginBottom: 26 }}>
            Explorez nos comparatifs détaillés, les fiches outil, et l&apos;écosystème data complet
            pour faire le meilleur choix pour votre organisation.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a href="/outils" className="btn-primary">🛠️ Toutes les fiches outils</a>
            <a href="/comparatifs" className="btn-secondary">⚖️ Comparatifs détaillés</a>
            <a href="/ecosystem" className="btn-secondary">🗺️ Voir l&apos;écosystème</a>
          </div>
        </div>
      </section>
    </main>
  );
}
