import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import metiers from "@/content/metiers.json";
import formations from "@/content/formations.json";

const FORMATIONS_PAR_METIER: Record<string, string[]> = {
  "data-analyst":          ["google-data-analytics", "udemy-sql-complet", "datacamp-sql-fundamentals", "openclassrooms-data-analyst"],
  "data-engineer":         ["ibm-data-engineering", "datacamp-data-engineer", "udemy-dbt-bootcamp", "databricks-data-engineer"],
  "data-scientist":        ["ibm-data-science", "udemy-python-data-science", "datacamp-data-scientist", "aws-ml-specialty"],
  "analytics-engineer":    ["dbt-analytics-engineering", "udemy-dbt-bootcamp", "snowflake-snowpro-core", "datacamp-data-engineer", "udemy-sql-complet"],
  "ml-engineer":           ["deeplearning-mlops", "aws-ml-specialty", "databricks-data-engineer"],
  "mlops-engineer":        ["deeplearning-mlops", "databricks-data-engineer", "aws-ml-specialty"],
  "prompt-engineer":       ["huggingface-nlp", "udemy-python-data-science", "deeplearning-mlops"],
  "data-architect":        ["databricks-data-engineer", "ibm-data-engineering", "aws-ml-specialty"],
  "staff-data-engineer":   ["ibm-data-engineering", "datacamp-data-engineer", "databricks-data-engineer"],
  "data-reliability-engineer": ["ibm-data-engineering", "datacamp-data-engineer", "deeplearning-mlops"],
  "product-owner-data":    ["google-data-analytics", "udemy-sql-complet"],
  "chief-data-officer":    ["google-advanced-data-analytics", "aws-ml-specialty"],
};

const TRANSITIONS_PAR_METIER: Record<string, { from: string; delta: string[] }[]> = {
  "data-analyst": [
    { from: "Finance / Contrôle de gestion", delta: ["SQL avancé (GROUP BY, fenêtres)", "Power BI ou Tableau", "Python pandas pour automatiser les analyses"] },
    { from: "Marketing digital", delta: ["SQL pour requêter les bases CRM/web analytics", "Notions de statistiques (A/B testing)", "Visualisation (Tableau, Looker Studio)"] },
  ],
  "analytics-engineer": [
    { from: "Data Analyst", delta: ["dbt Core (modélisation SQL modulaire)", "Git et CI/CD pour la data", "Concepts de data modeling (étoile, flocon)"] },
    { from: "Data Engineer", delta: ["dbt et logique de transformation déclarative", "Semantic Layer et définition de métriques", "Collaboration avec les équipes analytiques"] },
  ],
  "data-engineer": [
    { from: "Développeur backend", delta: ["Python data (Pandas, PySpark)", "Notions d'architecture data (lac, warehouse)", "Orchestration (Airflow ou Prefect)"] },
    { from: "Data Analyst", delta: ["Python scripting et manipulation de fichiers", "Ingestion de données (Airbyte, APIs)", "Pipelines ELT et orchestration"] },
  ],
  "data-scientist": [
    { from: "Data Analyst", delta: ["Statistiques avancées (régression, tests)", "Python scikit-learn et modélisation ML", "Déploiement de modèles (Flask, FastAPI)"] },
    { from: "Ingénieur mathématiques/stats", delta: ["Python pandas et scikit-learn", "Pratique des données réelles (nettoyage, features)", "Connaissance des outils MLOps (MLflow)"] },
  ],
  "ml-engineer": [
    { from: "Data Scientist", delta: ["MLOps et déploiement (Docker, Kubernetes)", "APIs de serving (FastAPI, Triton)", "Monitoring modèles en production"] },
    { from: "Développeur backend", delta: ["Python ML (PyTorch ou TensorFlow)", "Feature engineering et preprocessing", "Pipelines d'entraînement automatisés"] },
  ],
};

type Metier = (typeof metiers)[number];

function getMetier(slug: string): Metier | undefined {
  return metiers.find(m => m.slug === slug);
}

export function generateStaticParams() {
  return metiers.map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = getMetier(slug);
  if (!m) return {};
  return {
    title: `${m.title} — Salaires, compétences et carrière 2025 | DataSphère`,
    description: `Tout sur le métier de ${m.title} : salaire ${m.salaryMin}-${m.salaryMax}k€, compétences requises, certifications et trajectoires de carrière en France.`,
  };
}

const DEMAND_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  "Très forte": { text: "#BE123C", bg: "rgba(190,18,60,0.08)",  border: "rgba(190,18,60,0.2)" },
  "Forte":      { text: "#0E7490", bg: "rgba(14,116,144,0.08)", border: "rgba(14,116,144,0.2)" },
  "Modérée":    { text: "#B45309", bg: "rgba(180,83,9,0.08)",   border: "rgba(180,83,9,0.2)" },
};

const CAT_COLORS: Record<string, string> = {
  Engineering:           "#6366F1",
  "Science des données": "#14B8A6",
  Analytics:             "#F59E0B",
  Architecture:          "#64748B",
  Management:            "#F43F5E",
  "IA Générative":       "#7C3AED",
};

export default async function MetierPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMetier(slug);
  if (!m) notFound();

  const dc = DEMAND_COLORS[m.demand] ?? DEMAND_COLORS["Modérée"];
  const catColor = CAT_COLORS[m.category] ?? "#7C3AED";

  const related = metiers
    .filter(r => r.slug !== m.slug && r.category === m.category)
    .slice(0, 3);

  return (
    <main>
      {/* Breadcrumb */}
      <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#94A3B8" }}>
          <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
          <span>/</span>
          <Link href="/metiers" style={{ color: "#94A3B8" }}>Métiers</Link>
          <span>/</span>
          <span style={{ color: "#475569", fontWeight: 500 }}>{m.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
        padding: "52px 24px 44px",
        borderBottom: "1px solid #E2E8F0",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start" }}>
            <div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
                <span style={{ padding: "4px 12px", borderRadius: 100, background: `${catColor}15`, border: `1.5px solid ${catColor}30`, fontSize: 12, fontWeight: 700, color: catColor }}>
                  {m.category}
                </span>
                <span style={{ padding: "4px 12px", borderRadius: 100, background: dc.bg, border: `1.5px solid ${dc.border}`, fontSize: 12, fontWeight: 700, color: dc.text }}>
                  Demande {m.demand.toLowerCase()}
                </span>
                <span style={{ padding: "4px 12px", borderRadius: 100, background: "#F1F5F9", border: "1px solid #E2E8F0", fontSize: 12, color: "#64748B" }}>
                  {m.remoteRate}
                </span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                fontWeight: 800, color: "#0F172A",
                lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 12,
              }}>
                {m.title}
              </h1>
              <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.8, maxWidth: 600, marginBottom: 24 }}>
                {m.tagline}
              </p>
              <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, maxWidth: 640 }}>
                {m.description}
              </p>
            </div>

            {/* Fiche rapide */}
            <div className="card" style={{ padding: "24px 26px", minWidth: 250 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 16 }}>
                En un coup d&apos;œil
              </p>
              {[
                { label: "Salaire", value: `${m.salaryMin}–${m.salaryMax}k€/an` },
                { label: "Paris senior", value: m.salaryParisSenior },
                { label: "Remote", value: m.remoteRate },
                { label: "Demande", value: m.demand },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid #F1F5F9", gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: "#64748B", flexShrink: 0 }}>{label}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A", textAlign: "right" }}>{value}</span>
                </div>
              ))}
              <Link href="/newsletter" className="btn-primary" style={{ display: "block", textAlign: "center", marginTop: 18, fontSize: 13 }}>
                Suivre le marché →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: 40, alignItems: "start" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Compétences */}
          <div className="card" style={{ padding: "28px 26px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
              Compétences requises
            </h2>
            <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 16 }}>Clique sur un terme pour le chercher dans le glossaire.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {m.skills.map(skill => (
                <Link key={skill} href={`/glossaire?q=${encodeURIComponent(skill.split(" / ")[0].split(" ")[0])}`} style={{
                  padding: "6px 14px", borderRadius: 100,
                  background: "#F1F5F9", border: "1px solid #E2E8F0",
                  fontSize: 13, fontWeight: 500, color: "#334155",
                  textDecoration: "none", transition: "all 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#EDE9FE"; el.style.borderColor = "#7C3AED"; el.style.color = "#7C3AED"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "#F1F5F9"; el.style.borderColor = "#E2E8F0"; el.style.color = "#334155"; }}
                >
                  {skill}
                </Link>
              ))}
            </div>
          </div>

          {/* Certifications recommandées */}
          <div className="card" style={{ padding: "28px 26px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 18 }}>
              Certifications recommandées
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {m.certifications.map(cert => (
                <Link key={cert} href={`/certifications?q=${encodeURIComponent(cert.split(" ").slice(0, 3).join(" "))}`} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0",
                  textDecoration: "none", transition: "border-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "#7C3AED"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED", flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: "#0F172A", flex: 1 }}>{cert}</span>
                  <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>→</span>
                </Link>
              ))}
            </div>
            <Link href="/certifications" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 16, fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>
              Toutes les certifications →
            </Link>
          </div>

          {/* Trajectoire */}
          <div style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)", borderRadius: 16, padding: "28px 26px", border: "1px solid #DDD6FE" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 18 }}>
              Trajectoire de carrière
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <div style={{ padding: "8px 16px", borderRadius: 100, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                {m.title}
              </div>
              {m.evolution.map((step, i) => (
                <>
                  <span key={`arrow-${i}`} style={{ color: "#CBD5E1", fontSize: 16 }}>→</span>
                  <div key={step} style={{ padding: "8px 16px", borderRadius: 100, background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(124,58,237,0.2)", color: "#5B21B6", fontSize: 13, fontWeight: 600 }}>
                    {step}
                  </div>
                </>
              ))}
            </div>
          </div>

          {/* Formations recommandées */}
          {(FORMATIONS_PAR_METIER[m.slug] ?? []).length > 0 && (() => {
            const ids = FORMATIONS_PAR_METIER[m.slug] ?? [];
            const reco = formations.filter(f => ids.includes(f.id)).slice(0, 4);
            return reco.length > 0 ? (
              <div className="card" style={{ padding: "28px 26px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                  Formations recommandées
                </h2>
                <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>
                  Sélectionnées pour le profil {m.title}.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {reco.map(f => (
                    <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "14px 16px", borderRadius: 10,
                      border: "1px solid #E2E8F0", background: "#FAFBFF",
                      textDecoration: "none", transition: "border-color 0.15s",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{f.title}</span>
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "#EDE9FE", color: "#7C3AED", fontWeight: 600, flexShrink: 0 }}>{f.level}</span>
                        </div>
                        <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#94A3B8", flexWrap: "wrap" }}>
                          <span>{f.provider}</span>
                          <span>·</span>
                          <span>{f.duration}</span>
                          <span>·</span>
                          <span>{f.price}</span>
                        </div>
                        {f.note && (
                          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: "#FFF7ED", border: "1px solid #FED7AA", color: "#C2410C", fontWeight: 600, marginTop: 4, display: "inline-block" }}>
                            {f.note}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 13, color: "#7C3AED", fontWeight: 700, flexShrink: 0, paddingTop: 2 }}>→</span>
                    </a>
                  ))}
                </div>
                <Link href="/formations" style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 16, fontSize: 13, fontWeight: 600, color: "#7C3AED" }}>
                  Toutes les formations →
                </Link>
              </div>
            ) : null;
          })()}

          {/* Encart transition */}
          {(TRANSITIONS_PAR_METIER[m.slug] ?? []).length > 0 && (
            <div className="card" style={{ padding: "28px 26px", borderLeft: "4px solid #7C3AED" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                Tu viens d&apos;un autre domaine ?
              </h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>
                Les compétences delta à acquérir pour transitionner vers {m.title}.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {TRANSITIONS_PAR_METIER[m.slug].map(t => (
                  <div key={t.from} style={{ padding: "14px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>
                      Si tu viens de <span style={{ color: "#7C3AED" }}>{t.from}</span>
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {t.delta.map((d, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <span style={{ color: "#7C3AED", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>+</span>
                          <span style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA newsletter */}
          <div style={{ background: "#0B0F29", borderRadius: 16, padding: "28px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>Newsletter DataSphère</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                Salaires, certifications data<br />chaque semaine en français
              </p>
            </div>
            <Link href="/newsletter" className="btn-primary" style={{ flexShrink: 0 }}>
              S&apos;abonner gratuitement →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>

          {/* Salaire visuel */}
          <div className="card" style={{ padding: "22px 22px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 14 }}>
              Fourchette salariale 2025
            </p>
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#64748B" }}>{m.salaryMin}k€</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>{m.salaryMax}k€</span>
              </div>
              <div style={{ height: 8, borderRadius: 10, background: "#F1F5F9", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", background: `linear-gradient(90deg, #7C3AED, #0EA5E9)`, borderRadius: 10 }} />
              </div>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 8 }}>{m.salaryParisSenior}</p>
            </div>
          </div>

          {/* Métiers similaires */}
          {related.length > 0 && (
            <div className="card" style={{ padding: "22px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 14 }}>
                Métiers similaires
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {related.map(r => (
                  <Link key={r.slug} href={`/metiers/${r.slug}`} style={{
                    display: "flex", flexDirection: "column", gap: 2,
                    padding: "11px 13px", borderRadius: 10,
                    background: "#F8FAFC", border: "1px solid #E2E8F0", textDecoration: "none",
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{r.title}</span>
                    <span style={{ fontSize: 11.5, color: "#94A3B8" }}>{r.salaryMin}–{r.salaryMax}k€ · {r.demand}</span>
                  </Link>
                ))}
              </div>
              <Link href="/metiers" style={{ display: "block", textAlign: "center", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>
                Tous les métiers →
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
