import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import metiers from "@/content/metiers.json";
import formations from "@/content/formations.json";

const BASE = "https://data-universe.fr";

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
  const title = `${m.title} — Compétences, certifications et carrière 2026 | Data Universe`;
  const description = `Tout sur le métier de ${m.title} : compétences requises, certifications, formations et trajectoires de carrière en France.`;
  const ogImageUrl = `${BASE}/og?title=${encodeURIComponent(m.title)}&subtitle=${encodeURIComponent(m.tagline)}&type=M%C3%A9tier`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE}/metiers/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: m.title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImageUrl] },
  };
}

const CERT_SLUG_MAP: Record<string, string> = {
  "AWS Data Engineer":                               "aws-data-engineer-associate",
  "Google Professional Data Engineer":               "gcp-professional-data-engineer",
  "Databricks Certified Data Engineer":              "databricks-data-engineer-associate",
  "Databricks Certified Data Engineer Professional": "databricks-data-engineer-professional",
  "AWS ML Engineer Associate (MLA-C01)":             "aws-ml-engineer-associate",
  "Google Professional ML Engineer":                 "gcp-professional-ml-engineer",
  "Databricks ML Associate":                         "databricks-ml-associate",
  "Databricks ML Professional":                      "databricks-ml-professional",
  "Power BI Data Analyst":                           "azure-powerbi-pl300",
  "Tableau Desktop Specialist":                      "tableau-desktop-specialist",
  "Google Analytics":                                "google-analytics-individual-qualification",
  "dbt Analytics Engineering Certification":         "dbt-analytics-engineering",
  "Snowflake SnowPro Core":                          "snowflake-snowpro-core",
  "AWS Solutions Architect":                         "aws-solutions-architect-associate",
  "AWS Solutions Architect Professional":            "aws-solutions-architect-professional",
  "Azure Data Engineer Associate":                   "azure-data-engineer-dp203",
  "Google Professional Cloud Architect":             "gcp-professional-cloud-architect",
  "CDMP (Certified Data Management Professional)":   "dama-cdmp-associate",
};

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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Métiers", "item": `${BASE}/metiers` },
      { "@type": "ListItem", "position": 3, "name": m.title,   "item": `${BASE}/metiers/${slug}` },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
                { label: "Salaire", value: `${m.salaryMin}–${m.salaryMax} ${m.salaryUnit}` },
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
                <Link key={skill} href={`/glossaire?q=${encodeURIComponent(skill.split(" / ")[0].split(" ")[0])}`}
                className="skill-link-hover"
                style={{
                  padding: "6px 14px", borderRadius: 100,
                  background: "#F1F5F9", border: "1px solid #E2E8F0",
                  fontSize: 13, fontWeight: 500, color: "#334155",
                  textDecoration: "none",
                }}
                >
                  {skill}
                </Link>
              ))}
            </div>
          </div>

          {/* Fourchettes salariales */}
          <div className="card" style={{ padding: "28px 26px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
              Fourchettes salariales en France
            </h2>
            <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 20 }}>
              Chiffres bruts annuels, marché parisien. En province, comptez 15–25 % de moins selon la ville et le secteur.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Junior (Paris)", value: m.salaryJuniorParis, color: "#0E7490", bg: "#F0FDFA", border: "#A7F3D0" },
                { label: "Senior 5+ ans (Paris)", value: m.salaryParisSenior, color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
              ].filter(r => r.value).map(({ label, value, color, bg, border }) => (
                <div key={label} style={{ padding: "12px 16px", borderRadius: 10, background: bg, border: `1px solid ${border}` }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>{value}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 14, lineHeight: 1.6 }}>
              ESN / Cabinet : tarifs généralement 10–20 % inférieurs aux postes en entreprise directe. Sources : enquêtes Syntec, Glassdoor FR, offres observées.
            </p>
          </div>

          {/* Certifications recommandées */}
          <div className="card" style={{ padding: "28px 26px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 18 }}>
              Certifications recommandées
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {m.certifications.map(cert => (
                <Link key={cert} href={CERT_SLUG_MAP[cert] ? `/certifications/${CERT_SLUG_MAP[cert]}` : `/certifications?q=${encodeURIComponent(cert)}`}
                className="cert-link-hover"
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0",
                  textDecoration: "none",
                }}
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

          {/* Journée type */}
          {(m as { journee_type?: { time: string; activity: string }[] }).journee_type?.length && (() => {
            const jt = (m as { journee_type: { time: string; activity: string }[] }).journee_type;
            return (
              <div className="card" style={{ padding: "28px 26px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                  Une journée type de {m.title}
                </h2>
                <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 22 }}>
                  En poste dans une équipe data mid-size — varie selon la structure et le secteur.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
                  <div style={{ position: "absolute", left: 47, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #7C3AED, #06B6D4)", borderRadius: 1, opacity: 0.25 }} />
                  {jt.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingBottom: i < jt.length - 1 ? 18 : 0 }}>
                      <div style={{ flexShrink: 0, width: 56, textAlign: "right" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, fontWeight: 700, color: "#7C3AED" }}>{item.time}</span>
                      </div>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#7C3AED", flexShrink: 0, marginTop: 3, border: "2px solid #F5F3FF", position: "relative", zIndex: 1 }} />
                      <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, flex: 1 }}>{item.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Trajectoire */}
          <div style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)", borderRadius: 16, padding: "28px 26px", border: "1px solid #DDD6FE" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "#0F172A", marginBottom: 18 }}>
              Trajectoire de carrière
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
              <div style={{ padding: "8px 16px", borderRadius: 100, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700 }}>
                {m.title}
              </div>
              {m.evolution.map((step) => (
                <Fragment key={step}>
                  <span style={{ color: "#CBD5E1", fontSize: 16 }}>→</span>
                  <div style={{ padding: "8px 16px", borderRadius: 100, background: "rgba(124,58,237,0.1)", border: "1.5px solid rgba(124,58,237,0.2)", color: "#5B21B6", fontSize: 13, fontWeight: 600 }}>
                    {step}
                  </div>
                </Fragment>
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
              <p style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>Newsletter Data Universe</p>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                Certifications, outils data<br />chaque semaine en français
              </p>
            </div>
            <Link href="/newsletter" className="btn-primary" style={{ flexShrink: 0 }}>
              S&apos;abonner gratuitement →
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>

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
                    <span style={{ fontSize: 11.5, color: "#94A3B8" }}>{r.demand} · {r.remoteRate}</span>
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
