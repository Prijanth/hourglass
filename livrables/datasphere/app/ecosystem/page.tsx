import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carte de l'écosystème data — Modern Data Stack 2026 | Data Universe",
  description:
    "Visualisez le Modern Data Stack de bout en bout : sources, ingestion, stockage, transformation, ML et consommation. Tous les outils data organisés par couche, avec les combos les plus populaires en 2026.",
};

/* ─── Données ─────────────────────────────────────────────── */

const LAYERS = [
  {
    id: "sources",
    label: "Sources",
    icon: "🗄️",
    color: "#64748B",
    bg: "#F8FAFC",
    border: "rgba(100,116,139,0.25)",
    accent: "rgba(100,116,139,0.1)",
    groups: [
      {
        name: "Bases de données",
        items: [
          { name: "PostgreSQL", emoji: "🐘", desc: "SGBDR open-source" },
          { name: "MySQL", emoji: "🐬", desc: "SGBDR web" },
          { name: "MongoDB", emoji: "🍃", desc: "NoSQL documents" },
          { name: "Oracle", emoji: "🏛️", desc: "SGBDR enterprise" },
        ],
      },
      {
        name: "SaaS",
        items: [
          { name: "Salesforce", emoji: "☁️", desc: "CRM n°1 mondial" },
          { name: "HubSpot", emoji: "🧲", desc: "Marketing & CRM" },
          { name: "Stripe", emoji: "💳", desc: "Paiements en ligne" },
          { name: "Google Analytics", emoji: "📈", desc: "Web analytics" },
        ],
      },
      {
        name: "Fichiers & APIs",
        items: [
          { name: "CSV / JSON", emoji: "📂", desc: "Fichiers plats" },
          { name: "Parquet", emoji: "🗜️", desc: "Colonne compressée" },
          { name: "APIs REST", emoji: "🔌", desc: "HTTP endpoints" },
        ],
      },
      {
        name: "Streaming",
        items: [
          { name: "IoT sensors", emoji: "📡", desc: "Capteurs temps réel" },
          { name: "Logs applicatifs", emoji: "📋", desc: "Traces système" },
          { name: "Click streams", emoji: "🖱️", desc: "Comportements user" },
        ],
      },
    ],
  },
  {
    id: "ingestion",
    label: "Ingestion / EL",
    icon: "🔄",
    color: "#0E7490",
    bg: "#ECFEFF",
    border: "rgba(14,116,144,0.25)",
    accent: "rgba(14,116,144,0.1)",
    groups: [
      {
        name: "Batch",
        items: [
          { name: "Fivetran", emoji: "🔄", desc: "ELT managé" },
          { name: "Airbyte", emoji: "🔓", desc: "Open-source ELT" },
          { name: "Stitch", emoji: "🧵", desc: "ETL simplifié" },
        ],
      },
      {
        name: "Streaming",
        items: [
          { name: "Apache Kafka", emoji: "⚡", desc: "Message streaming" },
          { name: "Amazon Kinesis", emoji: "🌊", desc: "Streams AWS" },
          { name: "Google Pub/Sub", emoji: "📬", desc: "Messaging GCP" },
        ],
      },
      {
        name: "Custom",
        items: [
          { name: "Python scripts", emoji: "🐍", desc: "ETL sur mesure" },
          { name: "dbt sources", emoji: "🔧", desc: "Sources déclarées" },
        ],
      },
    ],
  },
  {
    id: "stockage",
    label: "Stockage",
    icon: "🏛️",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "rgba(124,58,237,0.25)",
    accent: "rgba(124,58,237,0.1)",
    groups: [
      {
        name: "Data Warehouse",
        items: [
          { name: "Snowflake", emoji: "❄️", desc: "Cloud DW leader" },
          { name: "BigQuery", emoji: "🔵", desc: "DW serverless GCP" },
          { name: "Redshift", emoji: "⭕", desc: "DW AWS" },
          { name: "Azure Synapse", emoji: "🔷", desc: "Analytics Azure" },
        ],
      },
      {
        name: "Data Lake",
        items: [
          { name: "Amazon S3", emoji: "🪣", desc: "Object storage AWS" },
          { name: "Azure Data Lake", emoji: "🏞️", desc: "Storage Azure" },
          { name: "GCS", emoji: "🗃️", desc: "Object storage GCP" },
        ],
      },
      {
        name: "Lakehouse",
        items: [
          { name: "Databricks", emoji: "🧱", desc: "Lakehouse unifié" },
          { name: "Delta Lake", emoji: "△", desc: "Format ACID ouvert" },
          { name: "Apache Iceberg", emoji: "🧊", desc: "Table format ouvert" },
          { name: "Apache Hudi", emoji: "🔁", desc: "Upserts sur lake" },
        ],
      },
    ],
  },
  {
    id: "transformation",
    label: "Transformation",
    icon: "⚙️",
    color: "#C2410C",
    bg: "#FFF7ED",
    border: "rgba(194,65,12,0.25)",
    accent: "rgba(194,65,12,0.1)",
    groups: [
      {
        name: "SQL",
        items: [
          { name: "dbt", emoji: "🔧", desc: "Transform en SQL" },
          { name: "SQLMesh", emoji: "🕸️", desc: "Alternative dbt" },
        ],
      },
      {
        name: "Code",
        items: [
          { name: "Apache Spark", emoji: "⚡", desc: "Big data distribué" },
          { name: "PySpark", emoji: "🐍", desc: "Spark en Python" },
          { name: "Polars", emoji: "🐻", desc: "DataFrame ultrarapide" },
        ],
      },
      {
        name: "Orchestration",
        items: [
          { name: "Airflow", emoji: "🌊", desc: "DAGs Python" },
          { name: "Prefect", emoji: "✨", desc: "Workflows modernes" },
          { name: "Dagster", emoji: "🎯", desc: "Assets-centric" },
          { name: "Mage", emoji: "🔮", desc: "ETL no-code/code" },
        ],
      },
    ],
  },
  {
    id: "ml",
    label: "Feature Store / ML",
    icon: "🧬",
    color: "#BE123C",
    bg: "#FFF1F2",
    border: "rgba(190,18,60,0.25)",
    accent: "rgba(190,18,60,0.1)",
    groups: [
      {
        name: "MLOps",
        items: [
          { name: "MLflow", emoji: "🔬", desc: "Tracking expériences" },
          { name: "Weights & Biases", emoji: "📊", desc: "Monitoring ML" },
          { name: "Feast", emoji: "🍽️", desc: "Feature store" },
        ],
      },
      {
        name: "Training",
        items: [
          { name: "PyTorch", emoji: "🔥", desc: "Deep learning" },
          { name: "Scikit-learn", emoji: "🛠️", desc: "ML classique" },
          { name: "XGBoost", emoji: "🌲", desc: "Gradient boosting" },
        ],
      },
      {
        name: "Serving",
        items: [
          { name: "BentoML", emoji: "🍱", desc: "Serving Python" },
          { name: "SageMaker", emoji: "🔬", desc: "MLOps AWS" },
          { name: "Vertex AI", emoji: "🔺", desc: "MLOps GCP" },
        ],
      },
    ],
  },
  {
    id: "consommation",
    label: "Consommation / BI",
    icon: "📊",
    color: "#15803D",
    bg: "#F0FDF4",
    border: "rgba(21,128,61,0.25)",
    accent: "rgba(21,128,61,0.1)",
    groups: [
      {
        name: "BI & Dashboards",
        items: [
          { name: "Power BI", emoji: "📊", desc: "Leader Microsoft" },
          { name: "Tableau", emoji: "📉", desc: "Visualisation avancée" },
          { name: "Looker", emoji: "🔭", desc: "BI sémantique" },
          { name: "Metabase", emoji: "🗺️", desc: "BI open-source" },
          { name: "Lightdash", emoji: "💡", desc: "BI pour dbt" },
        ],
      },
      {
        name: "Notebooks",
        items: [
          { name: "Jupyter", emoji: "📓", desc: "Standard data science" },
          { name: "Hex", emoji: "🔷", desc: "Notebooks collaboratifs" },
          { name: "Observable", emoji: "👁️", desc: "Data viz JS" },
        ],
      },
      {
        name: "IA Générative",
        items: [
          { name: "LangChain", emoji: "🦜", desc: "Pipelines LLM" },
          { name: "LlamaIndex", emoji: "🦙", desc: "RAG & indexation" },
          { name: "RAG pipelines", emoji: "🔗", desc: "Retrieval augmenté" },
        ],
      },
      {
        name: "Gouvernance",
        items: [
          { name: "Collibra", emoji: "🏷️", desc: "Data catalog" },
          { name: "OpenMetadata", emoji: "🔍", desc: "Metadata open-source" },
        ],
      },
    ],
  },
];

const COMBOS = [
  {
    name: "Stack Startup",
    emoji: "🚀",
    color: "#0E7490",
    bg: "#ECFEFF",
    border: "rgba(14,116,144,0.2)",
    description: "Rapide à déployer, entièrement managé, coût prévisible",
    tools: ["Airbyte", "BigQuery", "dbt", "Looker Studio"],
    profile: "0–50 personnes",
  },
  {
    name: "Stack Scale-up",
    emoji: "📈",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "rgba(124,58,237,0.2)",
    description: "Robuste, gouverné, orienté self-service data",
    tools: ["Kafka", "Snowflake", "dbt", "Dagster", "Power BI"],
    profile: "50–500 personnes",
  },
  {
    name: "Stack Enterprise",
    emoji: "🏢",
    color: "#C2410C",
    bg: "#FFF7ED",
    border: "rgba(194,65,12,0.2)",
    description: "Full data catalog, conformité, coûts prévisibles à l'échelle",
    tools: ["Fivetran", "Databricks", "dbt", "Tableau", "Collibra"],
    profile: "500+ personnes",
  },
  {
    name: "Stack ML",
    emoji: "🧬",
    color: "#BE123C",
    bg: "#FFF1F2",
    border: "rgba(190,18,60,0.2)",
    description: "Data science first, feature store et déploiement de modèles",
    tools: ["Airbyte", "S3 / Delta Lake", "Spark", "MLflow", "BentoML"],
    profile: "Équipe data science",
  },
];

/* ─── Composants ──────────────────────────────────────────── */

function ToolCard({ name, emoji, desc }: { name: string; emoji: string; desc: string }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      padding: "8px 10px",
      background: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: 8,
      backdropFilter: "blur(4px)",
    }}>
      <span style={{ fontSize: 15, lineHeight: 1, marginTop: 1 }}>{emoji}</span>
      <div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 1, lineHeight: 1.3 }}>{desc}</div>
      </div>
    </div>
  );
}

function LayerCard({
  layer,
  index,
  isLast,
}: {
  layer: (typeof LAYERS)[0];
  index: number;
  isLast: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
      {/* Layer column */}
      <div style={{
        flex: 1,
        background: layer.bg,
        border: `1.5px solid ${layer.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "box-shadow 0.2s",
      }}>
        {/* Layer header */}
        <div style={{
          padding: "14px 18px 12px",
          background: layer.accent,
          borderBottom: `1px solid ${layer.border}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}>
          <span style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 34,
            height: 34,
            background: "#fff",
            borderRadius: 8,
            fontSize: 16,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            border: `1px solid ${layer.border}`,
          }}>{layer.icon}</span>
          <div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 13,
              fontWeight: 800,
              color: layer.color,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}>{layer.label}</div>
            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: 1 }}>
              Couche {index + 1}
            </div>
          </div>
        </div>

        {/* Groups */}
        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          {layer.groups.map((group) => (
            <div key={group.name}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                color: layer.color,
                marginBottom: 6,
                opacity: 0.8,
              }}>{group.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {group.items.map((item) => (
                  <ToolCard key={item.name} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow between layers */}
      {!isLast && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6px",
          marginTop: 60,
          flexShrink: 0,
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M4 14h16M16 10l4 4-4 4" stroke="var(--indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          </svg>
        </div>
      )}
    </div>
  );
}

/* ─── Page ─────────────────────────────────────────────────── */

export default function EcosystemPage() {
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
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(124,58,237,0.18)", top: -180, right: "-5%", animationDelay: "0s" }} />
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(14,116,144,0.12)", bottom: -80, left: "5%", animationDelay: "8s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">🗺️ Cartographie</span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 800,
            color: "var(--text)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            marginBottom: 18,
            maxWidth: 820,
          }}>
            L&apos;écosystème data{" "}
            <span className="text-gradient">de bout en bout</span>
          </h1>

          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.7, maxWidth: 600, marginBottom: 36 }}>
            Du fichier CSV brut au dashboard Power BI : tous les outils du{" "}
            <strong style={{ color: "var(--text)" }}>Modern Data Stack</strong>{" "}
            organisés par couche fonctionnelle. Chaque flèche représente un flux de données.
          </p>

          {/* Flow summary pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {LAYERS.map((l, i) => (
              <span key={l.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 12px",
                  background: l.bg,
                  border: `1px solid ${l.border}`,
                  borderRadius: 100,
                  fontSize: 12,
                  fontWeight: 700,
                  color: l.color,
                }}>
                  {l.icon} {l.label}
                </span>
                {i < LAYERS.length - 1 && (
                  <span style={{ color: "var(--muted)", fontSize: 14 }}>→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIAGRAMME PRINCIPAL ───────────────────────────────── */}
      <section style={{ padding: "48px 24px 56px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            gap: 0,
            overflowX: "auto",
            paddingBottom: 8,
            /* Sur mobile, les couches s'empilent */
          }}>
            <style>{`
              @media (max-width: 900px) {
                .ecosystem-flow {
                  flex-direction: column !important;
                }
                .ecosystem-flow .layer-arrow {
                  display: none !important;
                }
              }
            `}</style>
            <div className="ecosystem-flow" style={{
              display: "flex",
              gap: 0,
              width: "100%",
            }}>
              {LAYERS.map((layer, i) => (
                <LayerCard
                  key={layer.id}
                  layer={layer}
                  index={i}
                  isLast={i === LAYERS.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── LÉGENDE ──────────────────────────────────────────── */}
      <section style={{
        padding: "0 24px 48px",
        background: "var(--bg)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 24,
            alignItems: "center",
            padding: "16px 20px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 12,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Légende :</span>
            {LAYERS.map((l) => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 600 }}>{l.label}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="24" height="10" viewBox="0 0 24 10"><path d="M0 5h18M15 2l3 3-3 3" stroke="var(--indigo)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/></svg>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Flux de données</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMBOS POPULAIRES ────────────────────────────────── */}
      <section style={{
        background: "var(--bg-subtle)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "56px 24px",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">⚡ Stacks recommandées</span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
              fontWeight: 800,
              color: "var(--text)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              marginBottom: 10,
            }}>Les combos les plus populaires en 2026</h2>
            <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, maxWidth: 560 }}>
              Ces architectures sont utilisées par des dizaines d&apos;équipes data en France. Choisissez selon votre taille et maturité.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}>
            {COMBOS.map((combo) => (
              <div key={combo.name} className="card" style={{
                border: `1.5px solid ${combo.border}`,
                background: combo.bg,
                padding: "22px 22px 20px",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 38,
                    height: 38,
                    background: "#fff",
                    borderRadius: 10,
                    fontSize: 20,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    border: `1px solid ${combo.border}`,
                    flexShrink: 0,
                  }}>{combo.emoji}</span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: combo.color, lineHeight: 1.2 }}>{combo.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{combo.profile}</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 14 }}>{combo.description}</p>

                {/* Tool chain */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "center" }}>
                  {combo.tools.map((tool, i) => (
                    <span key={tool} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 9px",
                        background: "#fff",
                        border: `1px solid ${combo.border}`,
                        borderRadius: 6,
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: combo.color,
                        fontFamily: "var(--font-mono)",
                      }}>{tool}</span>
                      {i < combo.tools.length - 1 && (
                        <span style={{ color: "var(--muted)", fontSize: 12 }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────────── */}
      <section style={{ padding: "56px 24px 64px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 2.8vw, 2rem)",
            fontWeight: 800,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}>Vous cherchez le bon outil pour votre projet ?</h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65, marginBottom: 28 }}>
            Explorez nos comparatifs détaillés, les cas d&apos;usage réels d&apos;entreprises françaises,
            et le glossaire pour maîtriser le vocabulaire du Modern Data Stack.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <Link href="/outils" className="btn-primary">🛠️ Explorer les outils</Link>
            <Link href="/comparatifs" className="btn-secondary">📊 Voir les comparatifs</Link>
            <Link href="/cas-usage" className="btn-secondary">💼 Cas d&apos;usage réels</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
