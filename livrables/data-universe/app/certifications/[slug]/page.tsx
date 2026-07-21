import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import data from "@/content/certifications.json";
import { ResourceLink } from "@/components/resource-link";

type Cert = (typeof data.certifications)[number];

function getCert(slug: string): Cert | undefined {
  return data.certifications.find(c => c.id === slug);
}

export function generateStaticParams() {
  return data.certifications.map(c => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cert = getCert(slug);
  if (!cert) return {};
  return {
    title: `${cert.nom} — Guide complet, avis et ressources | Data Universe`,
    description: `Tout sur la certification ${cert.nom} : niveau ${cert.niveau}, ${cert.duree_prep} de préparation, coût ${cert.cout}. Guide complet, compétences et conseils pour réussir.`,
    openGraph: {
      title: `${cert.nom} — Guide complet`,
      description: cert.description,
      url: `https://data-universe.fr/certifications/${slug}`,
      siteName: "Data Universe",
      locale: "fr_FR",
      type: "article",
    },
  };
}

const QUIZ_BY_OUTIL: Record<string, string> = {
  "AWS":      "aws-data-services",
  "Azure":    "azure-data-services",
  "GCP":      "gcp-bigquery",
  "Databricks": "databricks-delta",
  "Snowflake": "snowflake",
  "dbt":      "dbt-analytics",
  "Power BI": "powerbi-fondamentaux",
};

const OUTIL_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  AWS:         { text: "#FF9900", bg: "rgba(255,153,0,0.08)",  border: "rgba(255,153,0,0.2)" },
  Azure:       { text: "#0078D4", bg: "rgba(0,120,212,0.08)",  border: "rgba(0,120,212,0.2)" },
  GCP:         { text: "#4285F4", bg: "rgba(66,133,244,0.08)", border: "rgba(66,133,244,0.2)" },
  Databricks:  { text: "#FF3621", bg: "rgba(255,54,33,0.08)",  border: "rgba(255,54,33,0.2)" },
  Snowflake:   { text: "#29B5E8", bg: "rgba(41,181,232,0.08)", border: "rgba(41,181,232,0.2)" },
  dbt:         { text: "#FF694A", bg: "rgba(255,105,74,0.08)", border: "rgba(255,105,74,0.2)" },
  Dataiku:     { text: "#2AB1AC", bg: "rgba(42,177,172,0.08)", border: "rgba(42,177,172,0.2)" },
  SAS:         { text: "#007CC2", bg: "rgba(0,124,194,0.08)",  border: "rgba(0,124,194,0.2)" },
  "SAS Viya":  { text: "#007CC2", bg: "rgba(0,124,194,0.08)",  border: "rgba(0,124,194,0.2)" },
  Tableau:     { text: "#E97627", bg: "rgba(233,118,39,0.08)", border: "rgba(233,118,39,0.2)" },
};

const NIVEAU_COLORS: Record<string, string> = {
  "Débutant": "#0E7490",
  "Intermédiaire": "#B45309",
  "Avancé": "#BE123C",
};

export default async function CertificationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cert = getCert(slug);
  if (!cert) notFound();

  const oc = OUTIL_COLORS[cert.outil] || { text: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" };
  const niveauColor = NIVEAU_COLORS[cert.niveau] || "#64748B";

  const related = data.certifications
    .filter(c => c.id !== cert.id && (c.outil === cert.outil || c.categorie === cert.categorie))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": cert.nom,
    "description": cert.description,
    "provider": { "@type": "Organization", "name": cert.organisme },
    "educationalLevel": cert.niveau,
    "url": cert.lien_officiel,
    "offers": { "@type": "Offer", "price": cert.cout.replace(/[^0-9]/g, ""), "priceCurrency": "EUR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main>
        {/* Breadcrumb */}
        <div style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "12px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "#94A3B8" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <Link href="/certifications" style={{ color: "#94A3B8" }}>Certifications</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>{cert.nom}</span>
          </div>
        </div>

        {/* Hero */}
        <section style={{
          background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
          padding: "56px 24px 48px",
          borderBottom: "1px solid #E2E8F0",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100,
                    background: oc.bg, border: `1.5px solid ${oc.border}`,
                    fontSize: 12, fontWeight: 700, color: oc.text,
                  }}>{cert.outil}</span>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100,
                    background: `${niveauColor}15`,
                    border: `1.5px solid ${niveauColor}30`,
                    fontSize: 12, fontWeight: 700, color: niveauColor,
                  }}>{cert.niveau}</span>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100,
                    background: "#F1F5F9", border: "1px solid #E2E8F0",
                    fontSize: 12, color: "#64748B",
                  }}>{cert.categorie}</span>
                </div>

                <h1 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontWeight: 800, color: "#0F172A",
                  lineHeight: 1.15, letterSpacing: "-0.03em",
                  marginBottom: 16,
                }}>
                  {cert.nom}
                </h1>

                <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.8, maxWidth: 640, marginBottom: 28 }}>
                  {cert.description}
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <a
                    href={cert.lien_officiel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ fontSize: 14 }}
                  >
                    Voir la certification officielle →
                  </a>
                  <Link href="/newsletter" className="btn-secondary" style={{ fontSize: 14 }}>
                    Recevoir les guides →
                  </Link>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://data-universe.fr/certifications/${cert.id}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 18px", borderRadius: 10, border: "1.5px solid #BFDBFE", background: "#EFF6FF", color: "#0A66C2", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    Partager
                  </a>
                </div>
              </div>

              {/* Fiche pratique */}
              <div className="card" style={{ padding: "24px 26px", minWidth: 260 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 18 }}>
                  En un coup d&apos;œil
                </p>
                {[
                  { icon: "⏱️", label: "Préparation", value: cert.duree_prep },
                  { icon: "💰", label: "Coût", value: cert.cout },
                  { icon: "📅", label: "Validité", value: cert.validite },
                  { icon: "📊", label: "Popularité marché", value: `${cert.popularite}%` },
                  { icon: "🎯", label: "Difficulté", value: "★".repeat(cert.difficulte) + "☆".repeat(5 - cert.difficulte) },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 13, color: "#64748B" }}>{icon} {label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", fontFamily: label === "Difficulté" ? "monospace" : "inherit" }}>{value}</span>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <p style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>👤 Recommandée pour</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.5 }}>{cert.recommandee_pour.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }}>

          {/* Colonne principale */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

            {/* Compétences validées */}
            <div className="card" style={{ padding: "28px 26px" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: 20 }}>
                Compétences validées
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {cert.competences.map((comp, i) => (
                  <div key={comp} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: oc.bg, border: `1.5px solid ${oc.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: oc.text, flexShrink: 0,
                    }}>{i + 1}</div>
                    <p style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.5 }}>{comp}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Parcours recommandé */}
            <div style={{ background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)", borderRadius: 16, padding: "28px 26px", border: "1px solid #DDD6FE" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                Ressources de préparation
              </h2>
              <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20, lineHeight: 1.7 }}>
                Les meilleures ressources pour préparer {cert.nom} et maximiser tes chances de réussite.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Documentation officielle", desc: `Guide officiel de l'examen ${cert.organisme}`, href: cert.lien_officiel, tag: "Gratuit", tagColor: "#0E7490" },
                  { label: `Udemy — Cours ${cert.nom}`, desc: "Formation pratique avec labs et examens blancs", href: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(cert.nom)}`, tag: "Externe", tagColor: "#7C3AED" },
                  { label: "Udemy — Examens pratiques", desc: "Questions d'entraînement en conditions réelles", href: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(cert.nom + " practice test")}`, tag: "Externe", tagColor: "#7C3AED" },
                  { label: "Amazon — Livres de préparation", desc: `Ouvrages et guides pour réussir ${cert.nom}`, href: `https://www.amazon.fr/s?k=${encodeURIComponent(cert.nom + " certification")}&tag=dataunivers02-21`, tag: "Affilié", tagColor: "#B45309" },
                ].map(({ label, desc, href, tag, tagColor }) => (
                  <ResourceLink key={label} href={href} label={label} desc={desc} tag={tag} tagColor={tagColor} />
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 14, lineHeight: 1.6 }}>
                Les liens &ldquo;Externe&rdquo; ouvrent des recherches Udemy. Les liens &ldquo;Affilié&rdquo; sont des liens Amazon partenaires : si tu achètes via ces liens, Data Universe touche une petite commission sans coût supplémentaire pour toi.
              </p>
            </div>

            {/* CTA newsletter */}
            <div style={{ background: "#0B0F29", borderRadius: 16, padding: "28px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#A78BFA", marginBottom: 4 }}>Newsletter Data Universe</p>
                <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.3 }}>
                  Toutes les certifications data,<br />chaque semaine en français
                </p>
              </div>
              <Link href="/newsletter" className="btn-primary" style={{ flexShrink: 0 }}>
                S&apos;abonner gratuitement →
              </Link>
            </div>
          </div>

          {/* Colonne latérale */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>

            {/* Certifications similaires */}
            {related.length > 0 && (
              <div className="card" style={{ padding: "22px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 16 }}>
                  Dans la même famille
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {related.map(r => {
                    const roc = OUTIL_COLORS[r.outil] || { text: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.2)" };
                    return (
                      <Link
                        key={r.id}
                        href={`/certifications/${r.id}`}
                        style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 14px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", textDecoration: "none" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: roc.text }}>{r.outil}</span>
                          <span style={{ fontSize: 11, color: "#94A3B8" }}>{r.niveau}</span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.35 }}>{r.nom}</p>
                        <p style={{ fontSize: 11.5, color: "#64748B" }}>{r.cout} · {r.duree_prep}</p>
                      </Link>
                    );
                  })}
                </div>
                <Link href="/certifications" style={{ display: "block", textAlign: "center", marginTop: 14, fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>
                  Toutes les certifications →
                </Link>
              </div>
            )}

            {/* Popularité */}
            <div className="card" style={{ padding: "22px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8" }}>
                  Popularité marché France
                </p>
                <span style={{ fontSize: 10.5, padding: "3px 8px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontWeight: 600 }}>
                  Vérifié juin 2026
                </span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>Score de demande</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: oc.text }}>{cert.popularite}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${cert.popularite}%` }} />
                </div>
              </div>
              <p style={{ fontSize: 11.5, color: "#94A3B8", lineHeight: 1.65 }}>
                Score établi d&apos;après les rapports sectoriels dbt Labs, 365 Data Science et Dataquest (2025) et les tendances observées sur Indeed FR, France Travail et Welcome to the Jungle. Indicateur de demande relative, non un comptage exact.
              </p>
            </div>

            {/* Quiz de préparation */}
            {QUIZ_BY_OUTIL[cert.outil] && (
              <div className="card" style={{ padding: "22px 22px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "#94A3B8", marginBottom: 14 }}>
                  Tester ses connaissances
                </p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>🧠</span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Quiz {cert.outil}</p>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.55 }}>
                      Questions d&apos;entraînement pour évaluer ton niveau avant l&apos;examen.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/quiz/${QUIZ_BY_OUTIL[cert.outil]}`}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", borderRadius: 10, background: "#EDE9FE", color: "#6D28D9", fontWeight: 700, fontSize: 13.5, textDecoration: "none", border: "1.5px solid #DDD6FE" }}
                >
                  Démarrer le quiz →
                </Link>
              </div>
            )}

            {/* Données vérifiées */}
            <div style={{ padding: "14px 16px", borderRadius: 10, background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 15 }}>✅</span>
              <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.5 }}>
                <strong>Lien officiel vérifié :</strong> coût, durée et lien vers le site {cert.organisme} vérifiés le {new Date(data.derniere_verification).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
