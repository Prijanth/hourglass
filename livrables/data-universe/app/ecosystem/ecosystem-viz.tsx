"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const CONCEPT_LINKS: Record<string, string> = {
  "Apache Kafka": "apache-kafka",
  "Apache Spark": "apache-spark",
  "PySpark": "apache-spark",
  "dbt": "dbt-data-build-tool",
  "Airflow": "apache-airflow",
  "MLflow": "mlflow",
  "Delta Lake": "apache-kafka",
  "Apache Iceberg": "apache-kafka",
  "XGBoost": "xgboost",
  "DuckDB": "duckdb",
};

const LAYERS = [
  {
    id: "sources", label: "Sources", abbr: "SRC",
    color: "#64748B", bg: "#F8FAFC", border: "rgba(100,116,139,0.25)", accent: "rgba(100,116,139,0.08)",
    groups: [
      { name: "Bases de données", items: [
        { name: "PostgreSQL", desc: "SGBDR open-source — standard OLTP" },
        { name: "MySQL", desc: "SGBDR web — MySQL/MariaDB" },
        { name: "MongoDB", desc: "NoSQL documents JSON" },
        { name: "Oracle", desc: "SGBDR enterprise" },
      ]},
      { name: "SaaS", items: [
        { name: "Salesforce", desc: "CRM n°1 mondial" },
        { name: "HubSpot", desc: "Marketing automation & CRM" },
        { name: "Stripe", desc: "Paiements en ligne" },
        { name: "Google Analytics", desc: "Web analytics" },
      ]},
      { name: "Fichiers & APIs", items: [
        { name: "CSV / JSON", desc: "Fichiers plats — ingestion simple" },
        { name: "Parquet", desc: "Format colonne compressé — standard data lake" },
        { name: "APIs REST", desc: "HTTP endpoints — webhooks, polling" },
      ]},
      { name: "Streaming", items: [
        { name: "IoT sensors", desc: "Capteurs temps réel" },
        { name: "Logs applicatifs", desc: "Traces système" },
        { name: "Click streams", desc: "Comportements utilisateurs" },
      ]},
    ],
  },
  {
    id: "ingestion", label: "Ingestion / EL", abbr: "EL",
    color: "#0E7490", bg: "#ECFEFF", border: "rgba(14,116,144,0.25)", accent: "rgba(14,116,144,0.08)",
    groups: [
      { name: "Batch ELT", items: [
        { name: "Fivetran", desc: "ELT managé — 300+ connecteurs, zéro maintenance" },
        { name: "Airbyte", desc: "Open-source ELT — self-host ou cloud" },
        { name: "Stitch", desc: "ETL simplifié — abordable pour startups" },
      ]},
      { name: "Streaming", items: [
        { name: "Apache Kafka", desc: "Message streaming distribué — millions d'événements/s" },
        { name: "Amazon Kinesis", desc: "Streams managés AWS" },
        { name: "Google Pub/Sub", desc: "Messaging GCP — pub/sub asynchrone" },
      ]},
      { name: "Custom", items: [
        { name: "Python scripts", desc: "ETL sur mesure — flexibilité maximale" },
        { name: "dbt sources", desc: "Sources déclarées — documentation auto" },
      ]},
    ],
  },
  {
    id: "stockage", label: "Stockage", abbr: "DW",
    color: "#7C3AED", bg: "#F5F3FF", border: "rgba(124,58,237,0.25)", accent: "rgba(124,58,237,0.08)",
    groups: [
      { name: "Data Warehouse", items: [
        { name: "Snowflake", desc: "Cloud DW leader — séparation compute/storage" },
        { name: "BigQuery", desc: "DW serverless GCP — pricing à la requête" },
        { name: "Redshift", desc: "DW managé AWS — intégration S3 native" },
        { name: "Azure Synapse", desc: "Analytics Azure — DW + Spark intégré" },
      ]},
      { name: "Data Lake", items: [
        { name: "Amazon S3", desc: "Object storage AWS — standard de facto" },
        { name: "Azure Data Lake", desc: "Storage ADLS Gen2 — Parquet/Delta" },
        { name: "GCS", desc: "Object storage GCP — BigQuery natif" },
      ]},
      { name: "Lakehouse", items: [
        { name: "Databricks", desc: "Lakehouse unifié — Delta Lake + Spark + ML" },
        { name: "Delta Lake", desc: "Format ACID ouvert — time travel, merge" },
        { name: "Apache Iceberg", desc: "Table format ouvert — multi-engine" },
        { name: "Apache Hudi", desc: "Upserts sur lake — streaming ingestion" },
      ]},
    ],
  },
  {
    id: "transformation", label: "Transformation", abbr: "T",
    color: "#C2410C", bg: "#FFF7ED", border: "rgba(194,65,12,0.25)", accent: "rgba(194,65,12,0.08)",
    groups: [
      { name: "SQL", items: [
        { name: "dbt", desc: "Transform en SQL pur — tests, docs, lineage automatiques" },
        { name: "SQLMesh", desc: "Alternative dbt — plan/apply, virtual schemas" },
      ]},
      { name: "Code", items: [
        { name: "Apache Spark", desc: "Big data distribué — PySpark, Scala, SQL" },
        { name: "PySpark", desc: "Spark en Python — DataFrames distribués" },
        { name: "Polars", desc: "DataFrame ultrarapide — Rust, lazy evaluation" },
      ]},
      { name: "Orchestration", items: [
        { name: "Airflow", desc: "DAGs Python — leader historique, 1000+ opérateurs" },
        { name: "Prefect", desc: "Workflows modernes — Python natif, cloud UI" },
        { name: "Dagster", desc: "Assets-centric — lineage first, observabilité" },
        { name: "Mage", desc: "ETL no-code/code — pipelines hybrides" },
      ]},
    ],
  },
  {
    id: "ml", label: "Feature Store / ML", abbr: "ML",
    color: "#BE123C", bg: "#FFF1F2", border: "rgba(190,18,60,0.25)", accent: "rgba(190,18,60,0.08)",
    groups: [
      { name: "MLOps", items: [
        { name: "MLflow", desc: "Tracking expériences — registry de modèles, serving" },
        { name: "Weights & Biases", desc: "Monitoring ML — dashboards, sweeps, artifacts" },
        { name: "Feast", desc: "Feature store open-source — online/offline" },
      ]},
      { name: "Training", items: [
        { name: "PyTorch", desc: "Deep learning — recherche et production" },
        { name: "Scikit-learn", desc: "ML classique — preprocessing, modèles" },
        { name: "XGBoost", desc: "Gradient boosting — champion des competitions" },
      ]},
      { name: "Serving", items: [
        { name: "BentoML", desc: "Serving Python — containerisation auto" },
        { name: "SageMaker", desc: "MLOps AWS — pipeline, endpoint managés" },
        { name: "Vertex AI", desc: "MLOps GCP — AutoML, pipelines, Model Registry" },
      ]},
    ],
  },
  {
    id: "consommation", label: "BI / Consommation", abbr: "BI",
    color: "#15803D", bg: "#F0FDF4", border: "rgba(21,128,61,0.25)", accent: "rgba(21,128,61,0.08)",
    groups: [
      { name: "BI & Dashboards", items: [
        { name: "Power BI", desc: "Leader Microsoft — DAX, DirectQuery, Fabric" },
        { name: "Tableau", desc: "Visualisation avancée — calculs LOD" },
        { name: "Looker", desc: "BI sémantique — LookML, data modeling" },
        { name: "Metabase", desc: "BI open-source — questions sans SQL" },
        { name: "Lightdash", desc: "BI pour dbt — metrics layer natif" },
      ]},
      { name: "Notebooks", items: [
        { name: "Jupyter", desc: "Standard data science — kernels multiples" },
        { name: "Hex", desc: "Notebooks collaboratifs — SQL + Python" },
        { name: "Observable", desc: "Data viz JS — reactive notebooks" },
      ]},
      { name: "IA Générative", items: [
        { name: "LangChain", desc: "Pipelines LLM — chains, agents, RAG" },
        { name: "LlamaIndex", desc: "RAG & indexation — data connectors" },
        { name: "RAG pipelines", desc: "Retrieval augmenté — vectorDB + LLM" },
      ]},
      { name: "Gouvernance", items: [
        { name: "Collibra", desc: "Data catalog enterprise — stewardship" },
        { name: "OpenMetadata", desc: "Metadata open-source — lineage visuel" },
      ]},
    ],
  },
];

const COMBOS = [
  {
    name: "Stack Startup", color: "#0E7490", bg: "#ECFEFF", border: "rgba(14,116,144,0.2)",
    description: "Rapide à déployer, entièrement managé, coût prévisible",
    tools: ["Airbyte", "BigQuery", "dbt", "Looker"], profile: "0–50 personnes",
  },
  {
    name: "Stack Scale-up", color: "#7C3AED", bg: "#F5F3FF", border: "rgba(124,58,237,0.2)",
    description: "Robuste, gouverné, orienté self-service data",
    tools: ["Kafka", "Snowflake", "dbt", "Dagster", "Power BI"], profile: "50–500 personnes",
  },
  {
    name: "Stack Enterprise", color: "#C2410C", bg: "#FFF7ED", border: "rgba(194,65,12,0.2)",
    description: "Full data catalog, conformité, coûts maîtrisés à l'échelle",
    tools: ["Fivetran", "Databricks", "dbt", "Tableau", "Collibra"], profile: "500+ personnes",
  },
  {
    name: "Stack ML", color: "#BE123C", bg: "#FFF1F2", border: "rgba(190,18,60,0.2)",
    description: "Data science first — feature store et déploiement de modèles",
    tools: ["Airbyte", "Delta Lake", "Spark", "MLflow", "BentoML"], profile: "Équipe data science",
  },
];

type Tool = { name: string; desc: string };
type SelectedTool = Tool & { layerLabel: string; layerColor: string };

export function EcosystemViz() {
  const [search, setSearch] = useState("");
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedTool | null>(null);

  const allTools = useMemo(() => {
    const result: (Tool & { layerId: string; layerLabel: string; layerColor: string })[] = [];
    LAYERS.forEach(l => l.groups.forEach(g => g.items.forEach(item => {
      result.push({ ...item, layerId: l.id, layerLabel: l.label, layerColor: l.color });
    })));
    return result;
  }, []);

  const filteredLayers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return LAYERS.map(layer => ({
      ...layer,
      visible: activeLayer === null || activeLayer === layer.id,
      groups: layer.groups.map(g => ({
        ...g,
        items: g.items.filter(item =>
          !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q)
        ),
      })).filter(g => g.items.length > 0),
    })).filter(l => l.groups.length > 0 || (activeLayer !== null && activeLayer !== l.id) === false);
  }, [search, activeLayer]);

  const totalVisible = useMemo(() =>
    filteredLayers.reduce((acc, l) => acc + l.groups.reduce((a, g) => a + g.items.length, 0), 0),
    [filteredLayers]
  );

  const totalTools = allTools.length;

  return (
    <>
      {/* Barre de contrôle */}
      <div style={{
        position: "sticky", top: 60, zIndex: 30,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E2E8F0", padding: "12px 24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          {/* Recherche */}
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un outil…"
              style={{
                paddingLeft: 32, paddingRight: 12, height: 36, border: "1.5px solid #E2E8F0",
                borderRadius: 8, fontSize: 13, color: "#0F172A", background: "#fff",
                outline: "none", width: 220, fontFamily: "inherit",
                transition: "border-color 0.15s",
              }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = "#7C3AED"; }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = "#E2E8F0"; }}
            />
          </div>

          {/* Filtres par couche */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveLayer(null)}
              style={{
                padding: "5px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${activeLayer === null ? "#7C3AED" : "#E2E8F0"}`,
                background: activeLayer === null ? "#EDE9FE" : "#fff",
                color: activeLayer === null ? "#5B21B6" : "#64748B",
                fontFamily: "inherit", transition: "all 0.15s",
              }}
            >
              Toutes
            </button>
            {LAYERS.map(l => (
              <button
                key={l.id}
                onClick={() => setActiveLayer(activeLayer === l.id ? null : l.id)}
                style={{
                  padding: "5px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                  border: `1.5px solid ${activeLayer === l.id ? l.color : "#E2E8F0"}`,
                  background: activeLayer === l.id ? l.bg : "#fff",
                  color: activeLayer === l.id ? l.color : "#64748B",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}
              >
                {l.abbr}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <span style={{ fontSize: 12, color: "#94A3B8", marginLeft: "auto" }}>
            <strong style={{ color: totalVisible === totalTools ? "#94A3B8" : "#7C3AED" }}>{totalVisible}</strong> / {totalTools} outils
          </span>
        </div>
      </div>

      {/* Diagramme principal */}
      <section style={{ padding: "32px 24px 48px", background: "#fff" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          {totalVisible === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 24px", color: "#94A3B8" }}>
              <p style={{ fontSize: 15 }}>Aucun outil trouvé pour &ldquo;<strong style={{ color: "#64748B" }}>{search}</strong>&rdquo;</p>
              <button onClick={() => setSearch("")} style={{ marginTop: 12, color: "#7C3AED", fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>Effacer la recherche</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 0, overflowX: "auto", paddingBottom: 8, minHeight: 400 }}>
              {LAYERS.map((layer, i) => {
                const filtered = filteredLayers.find(l => l.id === layer.id);
                const dimmed = activeLayer !== null && activeLayer !== layer.id;
                const isLast = i === LAYERS.length - 1;

                if (!filtered && activeLayer !== null && activeLayer !== layer.id) return null;

                return (
                  <div key={layer.id} style={{ display: "flex", alignItems: "flex-start", flexShrink: 0, opacity: dimmed ? 0.3 : 1, transition: "opacity 0.2s" }}>
                    {/* Layer card */}
                    <div style={{
                      width: activeLayer === layer.id ? 340 : 220,
                      background: layer.bg, border: `1.5px solid ${layer.border}`,
                      borderRadius: 16, overflow: "hidden", transition: "all 0.25s",
                      boxShadow: activeLayer === layer.id ? `0 4px 20px ${layer.border}` : "none",
                    }}>
                      {/* Header */}
                      <div
                        style={{ padding: "12px 16px 10px", background: layer.accent, borderBottom: `1px solid ${layer.border}`, cursor: "pointer", userSelect: "none" as const }}
                        onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 800, color: layer.color, letterSpacing: "-0.01em" }}>
                              {layer.label}
                            </div>
                            <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 1 }}>
                              Couche {i + 1}
                            </div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: layer.color, background: layer.bg, padding: "2px 7px", borderRadius: 100, border: `1px solid ${layer.border}` }}>
                            {LAYERS[i].groups.reduce((a, g) => a + g.items.length, 0)}
                          </span>
                        </div>
                      </div>

                      {/* Groups */}
                      <div style={{ padding: "12px 12px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
                        {(filtered ?? layer).groups.map(group => (
                          <div key={group.name}>
                            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: layer.color, marginBottom: 5, opacity: 0.75 }}>{group.name}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {group.items.map(item => (
                                <button
                                  key={item.name}
                                  onClick={() => setSelected({ ...item, layerLabel: layer.label, layerColor: layer.color })}
                                  style={{
                                    display: "flex", alignItems: "flex-start", gap: 0,
                                    padding: "7px 10px", background: selected?.name === item.name ? layer.accent : "rgba(255,255,255,0.8)",
                                    border: `1px solid ${selected?.name === item.name ? layer.color : "rgba(0,0,0,0.07)"}`,
                                    borderRadius: 8, cursor: "pointer", textAlign: "left" as const, fontFamily: "inherit",
                                    transition: "all 0.15s", width: "100%",
                                  }}
                                  onMouseEnter={e => { if (selected?.name !== item.name) (e.currentTarget as HTMLElement).style.background = layer.accent; }}
                                  onMouseLeave={e => { if (selected?.name !== item.name) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.8)"; }}
                                >
                                  <div>
                                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                                      {item.name}
                                      {search && item.name.toLowerCase().includes(search.toLowerCase()) && (
                                        <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: layer.color, marginLeft: 5, verticalAlign: "middle" }} />
                                      )}
                                    </div>
                                    {activeLayer === layer.id && (
                                      <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2, lineHeight: 1.4 }}>{item.desc}</div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Flèche */}
                    {!isLast && (
                      <div style={{ display: "flex", alignItems: "center", padding: "0 4px", marginTop: 52, flexShrink: 0 }}>
                        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                          <path d="M0 8h16M12 4l4 4-4 4" stroke={dimmed ? "#E2E8F0" : "#7C3AED"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity={dimmed ? 0.4 : 0.6} />
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Panneau de détail */}
      {selected && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "flex-end" }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 340, maxHeight: "80vh", overflowY: "auto",
              background: "#fff", borderLeft: `3px solid ${selected.layerColor}`,
              boxShadow: "-8px 0 40px rgba(0,0,0,0.12)",
              padding: "24px 22px", margin: 0, height: "100%",
              animation: "slideInRight 0.2s ease-out",
            }}
          >
            <button
              onClick={() => setSelected(null)}
              style={{ position: "absolute", top: 16, right: 16, background: "#F1F5F9", border: "none", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ✕
            </button>

            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: selected.layerColor }}>{selected.layerLabel}</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 12, lineHeight: 1.2 }}>{selected.name}</h3>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>{selected.desc}</p>

            {CONCEPT_LINKS[selected.name] && (
              <Link
                href={`/concepts/${CONCEPT_LINKS[selected.name]}`}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 8, background: "#EDE9FE", color: "#5B21B6", fontSize: 12.5, fontWeight: 700, textDecoration: "none", marginBottom: 16 }}
              >
                Voir la fiche concept →
              </Link>
            )}

            <div style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#94A3B8", marginBottom: 8 }}>Dans quelles stacks ?</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {COMBOS.filter(c => c.tools.some(t => t.toLowerCase().includes(selected.name.toLowerCase()) || selected.name.toLowerCase().includes(t.toLowerCase()))).map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>{c.name}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>{c.profile}</span>
                  </div>
                ))}
                {COMBOS.filter(c => c.tools.some(t => t.toLowerCase().includes(selected.name.toLowerCase()) || selected.name.toLowerCase().includes(t.toLowerCase()))).length === 0 && (
                  <p style={{ fontSize: 12, color: "#94A3B8" }}>Outil non présent dans les stacks prédéfinies</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combos */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 28 }}>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Stacks recommandées</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Les combos les plus populaires en 2026
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {COMBOS.map(combo => (
              <div key={combo.name} className="card" style={{ border: `1.5px solid ${combo.border}`, background: combo.bg, padding: "20px 20px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: combo.color, marginBottom: 4 }}>{combo.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 10 }}>{combo.profile}</div>
                <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55, marginBottom: 14 }}>{combo.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {combo.tools.map((tool, i) => (
                    <span key={tool} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <button
                        onClick={() => {
                          const found = allTools.find(t => t.name.toLowerCase().includes(tool.toLowerCase()) || tool.toLowerCase().includes(t.name.toLowerCase()));
                          if (found) setSelected({ name: found.name, desc: found.desc, layerLabel: found.layerLabel, layerColor: found.layerColor });
                        }}
                        style={{ padding: "3px 8px", background: "#fff", border: `1px solid ${combo.border}`, borderRadius: 5, fontSize: 11, fontWeight: 700, color: combo.color, fontFamily: "var(--font-mono)", cursor: "pointer" }}
                      >{tool}</button>
                      {i < combo.tools.length - 1 && <span style={{ color: "#CBD5E1", fontSize: 11 }}>→</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "48px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 10 }}>
            Vous cherchez le bon outil pour votre projet ?
          </h2>
          <p style={{ fontSize: 14.5, color: "#64748B", lineHeight: 1.65, marginBottom: 24 }}>
            Explorez nos comparatifs détaillés, les cas d&apos;usage réels d&apos;entreprises françaises et le glossaire pour maîtriser le vocabulaire du Modern Data Stack.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <Link href="/outils" className="btn-primary" style={{ fontSize: 13 }}>Explorer les outils</Link>
            <Link href="/comparatifs" className="btn-secondary" style={{ fontSize: 13 }}>Voir les comparatifs</Link>
            <Link href="/gouvernance" className="btn-secondary" style={{ fontSize: 13 }}>Gouvernance data</Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </>
  );
}
