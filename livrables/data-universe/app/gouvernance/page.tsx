import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Gouvernance — Frameworks, outils et conformité 2026 | Data Universe",
  description: "Guide complet de la data gouvernance : data catalog, data lineage, data contracts, qualité des données, RGPD, AI Act. Frameworks et outils pour les équipes data.",
};

const PILLARS = [
  {
    id: "catalog-lineage",
    titre: "Catalogue & Lineage",
    color: "#7C3AED",
    bg: "#EDE9FE",
    border: "#DDD6FE",
    desc: "Savoir où sont vos données, d'où elles viennent et qui les utilise. Le fondement de toute gouvernance.",
    concepts: [
      { id: "data-lineage",         label: "Data Lineage" },
      { id: "data-gouvernance",     label: "Data Gouvernance" },
      { id: "master-data-management", label: "MDM" },
    ],
    outils: ["Collibra", "DataHub (LinkedIn)", "OpenMetadata", "AWS Glue Catalog", "Unity Catalog"],
    checklist: [
      "Inventorier toutes les sources de données critiques",
      "Documenter les transformations clés (dbt lineage, Spark jobs)",
      "Définir un Data Owner par domaine métier",
      "Mettre en place un Data Catalog consultable par les équipes",
    ],
  },
  {
    id: "qualite-contracts",
    titre: "Qualité & Contrats",
    color: "#0E7490",
    bg: "#ECFEFF",
    border: "#A5F3FC",
    desc: "Garantir la fiabilité des données à la source, pas en bout de chaîne. Les data contracts changent la responsabilité.",
    concepts: [
      { id: "data-contract",                    label: "Data Contract" },
      { id: "data-contract-avance",             label: "Data Contract avancé" },
      { id: "data-quality-great-expectations",  label: "Great Expectations" },
      { id: "monte-carlo-data-quality",         label: "Monte Carlo" },
    ],
    outils: ["Great Expectations", "Soda Core", "Monte Carlo", "dbt tests", "Atlan"],
    checklist: [
      "Définir des SLAs de fraîcheur et complétude par table critique",
      "Implémenter des tests dbt sur les modèles Gold",
      "Signer des data contracts entre équipes productrices/consommatrices",
      "Alerter automatiquement en cas de violation (volume, fraîcheur, nulls)",
    ],
  },
  {
    id: "securite-privacy",
    titre: "Sécurité & Privacy",
    color: "#BE123C",
    bg: "#FFF1F2",
    border: "#FECDD3",
    desc: "RGPD, accès aux données sensibles, pseudonymisation. La conformité n'est pas optionnelle en 2026.",
    concepts: [
      { id: "rgpd-data",       label: "RGPD & données" },
      { id: "privacy-by-design", label: "Privacy by Design" },
      { id: "bcbs-239",        label: "BCBS 239" },
    ],
    outils: ["Privacera", "Immuta", "BigID", "AWS Macie", "Informatica CDGC"],
    checklist: [
      "Cartographier les données personnelles et sensibles (DCP)",
      "Mettre en place le contrôle d'accès basé sur les rôles (RBAC/ABAC)",
      "Implémenter la pseudonymisation des données en développement",
      "Documenter les durées de conservation et les traitements (registre RGPD)",
    ],
  },
  {
    id: "organisation-culture",
    titre: "Organisation & Culture",
    color: "#B45309",
    bg: "#FFFBEB",
    border: "#FDE68A",
    desc: "La gouvernance échoue sans l'humain. Data Mesh, stewardship et comités de gouvernance font la différence.",
    concepts: [
      { id: "data-mesh",         label: "Data Mesh" },
      { id: "data-stewardship",  label: "Data Stewardship" },
      { id: "dataops",           label: "DataOps" },
    ],
    outils: ["Slack / Teams (data channels)", "Confluence", "Jira", "dbt Docs", "Atlan"],
    checklist: [
      "Constituer un Data Council (CDO, DSI, DPO, responsables métier)",
      "Nommer des Data Stewards par domaine",
      "Publier une charte de gouvernance data accessible à tous",
      "Former les équipes métier aux enjeux de la qualité des données",
    ],
  },
];

const REGLEMENTAIRE = [
  {
    label: "RGPD",
    desc: "Données personnelles, consentement, durées de conservation, droit à l'oubli. Applicable depuis 2018.",
    concept: "rgpd-data",
    urgency: "En vigueur",
    color: "#BE123C",
  },
  {
    label: "AI Act (UE)",
    desc: "Obligations selon le niveau de risque du système IA. Watermarking des contenus dès décembre 2026.",
    concept: "ai-act-europeen",
    urgency: "Décembre 2026",
    color: "#7C3AED",
  },
  {
    label: "BCBS 239",
    desc: "Agrégation des données de risque pour les banques systémiques. Lineage et reporting < 24h.",
    concept: "bcbs-239",
    urgency: "En vigueur",
    color: "#0E7490",
  },
  {
    label: "Taxonomie ESG",
    desc: "Classification des activités économiques durables. Reporting obligatoire pour les grandes entreprises.",
    concept: "taxonomie-esg",
    urgency: "En vigueur",
    color: "#15803D",
  },
  {
    label: "Pilier 3",
    desc: "Reporting de discipline de marché Bâle III/IV. Publication trimestrielle des risques.",
    concept: "pilier-3-reporting",
    urgency: "En vigueur",
    color: "#B45309",
  },
];

const MATURITE = [
  {
    level: 1, label: "Ad hoc",
    desc: "Pas de gouvernance formelle. Les données sont dans des silos, les définitions varient selon les équipes. La qualité est découverte a posteriori, souvent en production.",
    signes: ["Chaque équipe a sa propre définition d'un KPI", "Pas de documentation des sources", "Incidents data réguliers non tracés"],
    color: "#EF4444",
  },
  {
    level: 2, label: "Défini",
    desc: "Des règles existent, portées par une poignée de personnes. Un Data Catalog est en place mais partiellement alimenté. Les tests dbt couvrent les tables critiques.",
    signes: ["Catalog alimenté pour 30-50% des tables", "Data Owners identifiés dans les équipes clés", "SLAs définis mais non automatiquement mesurés"],
    color: "#F59E0B",
  },
  {
    level: 3, label: "Géré",
    desc: "La gouvernance est systématisée. Les data contracts sont signés entre équipes. La qualité est mesurée en continu avec des alertes automatiques.",
    signes: ["100% des tables Gold avec tests automatisés", "Data contracts en production", "Tableau de bord qualité visible par tous"],
    color: "#0EA5E9",
  },
  {
    level: 4, label: "Optimisé",
    desc: "La données est traitée comme un actif stratégique. Le Data Mesh distribue la responsabilité. L'IA aide à détecter les anomalies et à enrichir le catalog.",
    signes: ["Self-service data avec guardrails automatiques", "Lineage bout en bout automatique", "Conformité réglementaire mesurée et reportée"],
    color: "#10B981",
  },
];

export default function GouvernancePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "var(--navy)", padding: "64px 24px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(124,58,237,0.2)", top: -120, right: "3%", animationDelay: "4s" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(6,182,212,0.12)", bottom: -60, left: "10%", animationDelay: "11s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Cadre stratégique</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 14,
          }}>
            Data Gouvernance
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
            Catalogue, lineage, qualité, contrats et conformité réglementaire. Le guide pratique pour les équipes data et les CDOs.
          </p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { n: "4", l: "piliers de gouvernance" },
              { n: "5", l: "réglementations couvertes" },
              { n: "4", l: "niveaux de maturité" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--indigo)" }}>{n}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>

        {/* Intro CDO */}
        <div style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", border: "1px solid #DDD6FE", borderRadius: 16, padding: "28px 32px", marginBottom: 52, display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
            🏛️
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>
              Pourquoi la gouvernance est stratégique en 2026
            </p>
            <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>
              L&apos;AI Act impose des exigences de traçabilité sur les systèmes IA à risque. Le RGPD expose à des amendes jusqu&apos;à 4% du CA mondial. Les modèles ML entraînés sur des données non gouvernées produisent des décisions biaisées. La gouvernance n&apos;est plus un sujet IT — c&apos;est un enjeu de direction. Les organisations qui ne l&apos;adressent pas en 2026 se retrouveront bloquées dans leur transformation IA.
            </p>
          </div>
        </div>

        {/* 4 Piliers */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Framework</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Les 4 piliers de la gouvernance data
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 20 }}>
            {PILLARS.map(p => (
              <div key={p.id} style={{ background: p.bg, border: `1.5px solid ${p.border}`, borderRadius: 18, padding: "28px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: p.color, marginBottom: 8 }}>
                    {p.titre}
                  </h3>
                  <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.65 }}>{p.desc}</p>
                </div>

                {/* Concepts liés */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: p.color, marginBottom: 8 }}>
                    Concepts clés
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {p.concepts.map(c => (
                      <Link key={c.id} href={`/concepts/${c.id}`} style={{
                        padding: "4px 12px", borderRadius: 100, fontSize: 12.5, fontWeight: 600,
                        background: "rgba(255,255,255,0.7)", color: p.color,
                        border: `1px solid ${p.border}`, textDecoration: "none",
                        transition: "background 0.15s",
                      }}>
                        {c.label} →
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: p.color, marginBottom: 8 }}>
                    Checklist pratique
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {p.checklist.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <span style={{ color: p.color, fontWeight: 700, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                        <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outils */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: p.color, marginBottom: 8 }}>
                    Outils du marché
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {p.outils.map(o => (
                      <span key={o} style={{ padding: "3px 9px", borderRadius: 6, fontSize: 11.5, fontFamily: "var(--font-mono)", background: "rgba(255,255,255,0.6)", color: "#334155", border: "1px solid rgba(0,0,0,0.08)" }}>
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modèle de maturité */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Évaluation</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Modèle de maturité en 4 niveaux
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Où en est votre organisation ? Les signes caractéristiques de chaque niveau.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {MATURITE.map(m => (
              <div key={m.level} className="card" style={{ padding: "24px 22px", borderTop: `4px solid ${m.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "#fff", flexShrink: 0 }}>
                    {m.level}
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{m.label}</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 16 }}>{m.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {m.signes.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                      <span style={{ color: m.color, fontWeight: 700, flexShrink: 0, fontSize: 12, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Obligations réglementaires */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Conformité</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Réglementations à connaître
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REGLEMENTAIRE.map(r => (
              <Link key={r.label} href={`/concepts/${r.concept}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, transition: "box-shadow 0.15s" }}>
                  <div style={{ width: 56, flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 800, color: r.color }}>{r.label}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>{r.desc}</p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: `${r.color}15`, color: r.color, border: `1px solid ${r.color}30` }}>
                      {r.urgency}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)", flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA double */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 0 }}>
          <div style={{ background: "#0B0F29", borderRadius: 16, padding: "32px 28px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA", marginBottom: 8 }}>Approfondir</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 20 }}>
              134 concepts dans l&apos;encyclopédie, dont 20+ sur la gouvernance
            </p>
            <Link href="/concepts" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Voir l&apos;encyclopédie →
            </Link>
          </div>
          <div style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", borderRadius: 16, padding: "32px 28px", border: "1px solid #DDD6FE" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 8 }}>Métier associé</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 20 }}>
              Chief Data Officer — rôle, salaire et trajectoire
            </p>
            <Link href="/metiers/chief-data-officer" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Voir la fiche CDO →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
