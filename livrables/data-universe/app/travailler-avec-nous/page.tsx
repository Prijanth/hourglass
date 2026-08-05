import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travailler avec nous — Data Universe",
  description: "Besoin d'un expert data pour votre mission, votre transformation ou votre formation ? Consultants data certifiés, spécialisés AWS, Dataiku, reporting réglementaire et Data Engineering.",
  openGraph: {
    title: "Travailler avec nous — Data Universe",
    description: "Missions de conseil data : AWS, Dataiku, Data Engineering, reporting réglementaire (ESG, Pilier 3). Disponible en freelance ou en cabinet.",
    url: "https://data-universe.fr/travailler-avec-nous",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

const EXPERTISES = [
  {
    emoji: "☁️",
    titre: "Data Engineering & Cloud",
    desc: "Architecture data moderne : pipelines dbt, orchestration Airflow, plateformes Databricks, AWS (S3, Glue, Redshift, SageMaker), Azure, GCP.",
    tags: ["dbt", "Airflow", "Databricks", "AWS", "Azure", "Spark"],
  },
  {
    emoji: "📊",
    titre: "Reporting réglementaire",
    desc: "Taxonomie européenne, Pilier 3 ESG, CSRD, Bâle IV. Mise en conformité des chaînes de production de données réglementaires.",
    tags: ["ESG", "Taxonomie UE", "CSRD", "Pilier 3", "Bâle IV"],
  },
  {
    emoji: "🤖",
    titre: "IA & Machine Learning",
    desc: "Conception et déploiement de modèles ML, MLOps, agents IA, RAG. Spécialisation AWS ML Engineer, préparation à la certification.",
    tags: ["MLOps", "RAG", "AWS SageMaker", "Python", "LLM"],
  },
  {
    emoji: "🔧",
    titre: "Plateformes data low-code",
    desc: "Implémentation et montée en compétences sur Dataiku DSS, SAS Viya. Workflows, scoring, pipelines de données.",
    tags: ["Dataiku", "SAS Viya", "AutoML", "Feature Store"],
  },
  {
    emoji: "🎓",
    titre: "Formation & transfert de compétences",
    desc: "Ateliers sur mesure, formations certifiantes, accompagnement d'équipes data. Contenu pédagogique basé sur les standards du marché.",
    tags: ["Formation", "Data Literacy", "Certifications", "Workshop"],
  },
  {
    emoji: "📋",
    titre: "Appels d'offre & avant-vente",
    desc: "Structuration de réponses aux AO data & IA, rédaction de propositions techniques, qualification de besoins clients.",
    tags: ["Avant-vente", "Proposition technique", "SSII/ESN"],
  },
];

const FORMATS = [
  { titre: "Mission freelance", desc: "Engagement ponctuel ou récurrent, facturation à la journée (TJM). Idéal pour les renforcements d'équipe et les projets courts.", badge: "Disponible" },
  { titre: "Mission via cabinet", desc: "Intervention structurée avec support méthodologique et garantie de suivi. Gestion des aspects administratifs incluse.", badge: "Sur devis" },
  { titre: "Atelier formation", desc: "Session de formation sur mesure pour votre équipe, en présentiel ou distanciel. De 1 jour à plusieurs semaines.", badge: "Sur devis" },
];

export default function TravaillerAvecNousPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0B0F29 0%, #1E1B4B 60%, #0F1B35 100%)",
        padding: "80px 24px 72px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "rgba(124,58,237,0.1)", top: -200, right: -120, filter: "blur(90px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(8,145,178,0.07)", bottom: -100, left: "10%", filter: "blur(70px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 100,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 11, fontWeight: 700, color: "#A78BFA",
            letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 24,
          }}>
            Conseil & expertise data
          </span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.6rem)",
            fontWeight: 800, color: "#FFFFFF",
            lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 20,
          }}>
            Travaillons ensemble
          </h1>

          <p style={{
            fontSize: 17, color: "rgba(255,255,255,0.72)",
            lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px",
          }}>
            Data Universe est porté par des consultants data seniors actifs sur le terrain.
            Transformations data, plateformes ML, reporting réglementaire — nous intervenons là où ça compte.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            <a
              href="mailto:contact@data-universe.fr?subject=Mission data — prise de contact"
              className="btn-primary"
              style={{ fontSize: 15, padding: "13px 28px" }}
            >
              Nous contacter →
            </a>
            <a
              href="#expertises"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "12px 24px", borderRadius: 12,
                background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600,
                fontFamily: "var(--font-display)", textDecoration: "none",
              }}
            >
              Voir nos expertises
            </a>
          </div>
        </div>
      </section>

      {/* ── Expertises ───────────────────────────────────────── */}
      <section id="expertises" style={{ padding: "80px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="section-label">Nos domaines</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "var(--text)" }}>
            Dans quoi pouvons-nous vous aider ?
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {EXPERTISES.map(e => (
            <div key={e.titre} className="card-feature" style={{ padding: "26px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--indigo-tint)", border: "1px solid var(--indigo-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {e.emoji}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "var(--text)", lineHeight: 1.3 }}>{e.titre}</h3>
              </div>
              <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.75 }}>{e.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {e.tags.map(t => (
                  <span key={t} className="skill-pill" style={{ fontSize: 11.5 }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Formats d'intervention ───────────────────────────── */}
      <section style={{ background: "var(--navy)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-label">Comment travailler ensemble</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "var(--text)" }}>
              Formats d&apos;intervention
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {FORMATS.map(f => (
              <div key={f.titre} className="card" style={{ padding: "28px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--text)" }}>{f.titre}</h3>
                  <span className="badge badge-neutral">{f.badge}</span>
                </div>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA contact ──────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">Passons à l&apos;action</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "var(--text)", margin: "12px 0 16px", lineHeight: 1.2 }}>
            Décrivez-nous votre besoin
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 36px" }}>
            Un email avec votre contexte (secteur, périmètre, deadline) suffit. Nous répondons sous 48 h ouvrées avec une proposition ou des questions de cadrage.
          </p>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <a
              href="mailto:contact@data-universe.fr?subject=Mission data — prise de contact"
              className="btn-primary"
              style={{ fontSize: 15, padding: "14px 32px" }}
            >
              Envoyer un message →
            </a>
            <p style={{ fontSize: 13, color: "var(--faint)" }}>
              Ou directement à <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)", textDecoration: "underline" }}>contact@data-universe.fr</a>
            </p>
          </div>

          <div style={{ marginTop: 52, padding: "24px 28px", background: "var(--surface-2)", borderRadius: 16, border: "1px solid var(--border)", textAlign: "left" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>Ce que vous pouvez mentionner</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                "Le contexte de votre projet (secteur, taille d'équipe, maturité data)",
                "Le type de besoin (transformation, audit, formation, renforcement d'équipe)",
                "Votre contrainte principale (délai, budget, compétences à acquérir)",
                "Le niveau d'urgence et la durée estimée de la mission",
              ].map(item => (
                <div key={item} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "var(--text-2)" }}>
                  <span style={{ color: "var(--indigo)", fontWeight: 700, flexShrink: 0 }}>→</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
