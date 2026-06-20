import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CDO & Directeur Data — Frameworks stratégiques 2026 | Data Universe",
  description: "Ressources stratégiques pour les CDOs et Directeurs Data : Data Strategy Canvas, KPIs programme data, modèles d'organisation, budget, 100 premiers jours.",
};

const DIMENSIONS = [
  {
    key: "people", label: "Personnes & Organisation",
    color: "#7C3AED", bg: "#EDE9FE", border: "#C4B5FD",
    items: [
      "Cartographier les compétences data existantes",
      "Nommer des Data Owners et Data Stewards par domaine",
      "Créer un Data Council transverse",
      "Développer la data literacy des équipes métier",
      "Structurer la fonction data (centralisée, fédérée ou hybride)",
    ],
    kpi: "% employés formés à la data literacy",
  },
  {
    key: "process", label: "Processus & Gouvernance",
    color: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC",
    items: [
      "Définir les politiques de gouvernance des données",
      "Mettre en place le catalogue de données",
      "Standardiser les data contracts entre équipes",
      "Établir les procédures de qualité des données",
      "Documenter les processus de conformité (RGPD, AI Act)",
    ],
    kpi: "% données avec Data Owner et SLA définis",
  },
  {
    key: "technology", label: "Technologie & Architecture",
    color: "#B45309", bg: "#FFFBEB", border: "#FDE68A",
    items: [
      "Choisir la plateforme data centrale (Lakehouse / DWH)",
      "Rationaliser le nombre d'outils dans la stack data",
      "Implémenter le data lineage end-to-end",
      "Déployer une plateforme de self-service analytique",
      "Définir la stratégie cloud data (single cloud vs multi-cloud)",
    ],
    kpi: "Coût data par Go de données traitées",
  },
  {
    key: "assets", label: "Données comme actif",
    color: "#BE123C", bg: "#FFF1F2", border: "#FECDD3",
    items: [
      "Inventorier et valoriser les actifs data stratégiques",
      "Identifier les data products à fort potentiel de valeur",
      "Monétiser les données (interne / externe)",
      "Mesurer le ROI des projets data",
      "Construire le Data P&L (profit & loss de la donnée)",
    ],
    kpi: "Valeur économique des actifs data valorisés",
  },
];

const KPIS = [
  {
    categorie: "Qualité & Disponibilité",
    color: "#0E7490",
    indicateurs: [
      { label: "Data Availability Rate", def: "% du temps où les données critiques sont disponibles dans les SLA", cible: "> 99,5%" },
      { label: "Data Quality Score", def: "Score composite : complétude, exactitude, fraîcheur, cohérence", cible: "> 95/100" },
      { label: "MTTR Data Incidents", def: "Mean Time To Resolve — délai moyen de résolution d'un incident data", cible: "< 4h" },
    ],
  },
  {
    categorie: "Usage & Adoption",
    color: "#7C3AED",
    indicateurs: [
      { label: "Self-service Adoption Rate", def: "% de décisions métier prises avec des données en self-service vs requests ad hoc", cible: "> 60%" },
      { label: "Active Data Users", def: "Nombre d'utilisateurs actifs mensuels sur les outils BI / data catalog", cible: "Croissance MoM" },
      { label: "Time to Insight", def: "Délai entre une question métier et une réponse data structurée", cible: "< 2 jours" },
    ],
  },
  {
    categorie: "Programme & Valeur",
    color: "#B45309",
    indicateurs: [
      { label: "Data ROI", def: "Revenus générés ou coûts évités grâce aux initiatives data / budget data", cible: "> 3x" },
      { label: "Data Projects Delivered On Time", def: "% de projets data livrés dans les délais et le budget initiaux", cible: "> 75%" },
      { label: "Use Cases en production", def: "Nombre de cas d'usage data / IA actifs en production avec des utilisateurs", cible: "Progression annuelle" },
    ],
  },
];

const ORGANISATIONS = [
  {
    label: "Centralisée",
    subtitle: "Équipe data unique, rattachée à la DSI ou au CDO",
    color: "#7C3AED",
    pour: ["Standards communs, éviter la duplication", "Gouvernance centralisée plus simple", "Idéal pour les PME ou les débutants en data"],
    contre: ["Goulot d'étranglement sur les demandes métier", "Déconnexion avec les enjeux opérationnels", "Scalabilité limitée au-delà de 20-30 personnes data"],
    quand: "Moins de 15 personnes data, fort besoin de standardisation",
  },
  {
    label: "Fédérée / Hybride",
    subtitle: "Équipes data embarquées dans les BUs + équipe centrale de plateforme",
    color: "#0E7490",
    pour: ["Proximité métier et réactivité", "Scalabilité : chaque BU recrute selon ses besoins", "Meilleure adoption des outils par les équipes"],
    contre: ["Risque de silos et de duplication", "Standards difficiles à imposer", "Gouvernance plus complexe à piloter"],
    quand: "Organisation multi-BU, 20+ personnes data, maturité data avancée",
  },
  {
    label: "Data Mesh",
    subtitle: "Domaines autonomes propriétaires de leurs data products",
    color: "#B45309",
    pour: ["Responsabilité claire par domaine", "Scalabilité maximale", "Self-service réel pour les consommateurs de données"],
    contre: ["Complexité organisationnelle élevée", "Nécessite une plateforme self-service mature", "Transformation culturelle longue (3-5 ans)"],
    quand: "Grande organisation (100+ data practitioners), culture data mature",
  },
];

const BUDGET_REPARTITION = [
  { poste: "Plateformes & licences cloud", pct: 35, color: "#7C3AED" },
  { poste: "Masse salariale équipe data", pct: 45, color: "#0E7490" },
  { poste: "Formations & certifications", pct: 8,  color: "#B45309" },
  { poste: "Prestataires & conseil",      pct: 12, color: "#BE123C" },
];

const CENT_JOURS = [
  {
    phase: "J1–J30", label: "Écouter & Diagnostiquer",
    color: "#7C3AED", bg: "#EDE9FE",
    actions: [
      "Rencontrer tous les stakeholders clés (DSI, DAF, DRH, CDO sortant)",
      "Auditer l'existant : stack technique, équipe, projets en cours",
      "Identifier les 3 enjeux data critiques de l'organisation",
      "Cartographier les sources de données et les flux principaux",
      "Recenser les dettes techniques et incidents récurrents",
    ],
  },
  {
    phase: "J30–J60", label: "Prioriser & Planifier",
    color: "#0E7490", bg: "#ECFEFF",
    actions: [
      "Formaliser le diagnostic dans un document de 5 pages max",
      "Définir 3 quick wins à livrer en 90 jours (visibilité immédiate)",
      "Ébaucher la data strategy à 18 mois",
      "Présenter au COMEX la vision et les priorités",
      "Lancer le recrutement des profils manquants",
    ],
  },
  {
    phase: "J60–J100", label: "Exécuter & Montrer",
    color: "#B45309", bg: "#FFFBEB",
    actions: [
      "Livrer le premier quick win avec une démo aux équipes métier",
      "Mettre en place le Data Council et sa cadence de réunion",
      "Définir les KPIs du programme data et le premier tableau de bord CDO",
      "Valider le budget data pour l'année en cours",
      "Communiquer les premiers résultats en interne",
    ],
  },
];

const COMEX_ARGUMENTS = [
  {
    angle: "Risque réglementaire",
    arg: "Sans gouvernance des données, l'entreprise s'expose à des amendes RGPD jusqu'à 4% du CA mondial et à des pénalités AI Act dès décembre 2026. Le programme data est une assurance.",
    hook: "Combien nous coûterait une amende RGPD sur ce traitement ?",
  },
  {
    angle: "Efficacité opérationnelle",
    arg: "Les équipes passent 30-40% de leur temps à chercher, nettoyer et réconcilier des données. Chaque heure économisée par analyste = ROI direct sur la masse salariale.",
    hook: "Combien d'ETP passent du temps à préparer des données manuellement ?",
  },
  {
    angle: "Avantage concurrentiel IA",
    arg: "Les modèles IA ne valent que ce que valent les données sur lesquelles ils s'appuient. Sans données gouvernées, nos projets IA seront biaisés ou non conformes.",
    hook: "Pouvons-nous lancer un pilote IA sans savoir d'où viennent nos données ?",
  },
  {
    angle: "Valorisation de l'actif data",
    arg: "Nos données sont un actif au bilan — pas encore valorisé. Des concurrents les monétisent déjà (data sharing, data products). C'est une opportunité de revenu.",
    hook: "Quelle est la valeur de notre patrimoine data si nous le céderions demain ?",
  },
];

export default function CdoPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #0B0F29 0%, #1E1B4B 50%, #0E1230 100%)",
        padding: "64px 24px 56px", position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.3)",
      }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.12)", top: -150, right: -80, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(6,182,212,0.08)", bottom: -80, left: "15%", filter: "blur(60px)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.14em", color: "#A78BFA", marginBottom: 16, display: "block" }}>
            Ressources stratégiques
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 16,
          }}>
            CDO & Directeur Data
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 580, marginBottom: 36 }}>
            Frameworks pratiques, KPIs, modèles d&apos;organisation et checklist des 100 premiers jours pour piloter la transformation data d&apos;une organisation.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/metiers/chief-data-officer" style={{ padding: "10px 20px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Fiche métier CDO →
            </Link>
            <Link href="/gouvernance" style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
              Guide Gouvernance →
            </Link>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>

        {/* Data Strategy Canvas — 4 dimensions */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Framework</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Data Strategy Canvas
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28, maxWidth: 620 }}>
            4 dimensions à piloter simultanément. Négliger l&apos;une d&apos;elles compromet les trois autres. La technologie sans les personnes, c&apos;est un outil sans pilote.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 16 }}>
            {DIMENSIONS.map(d => (
              <div key={d.key} style={{ background: d.bg, border: `1.5px solid ${d.border}`, borderRadius: 18, padding: "26px 28px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: d.color, marginBottom: 16 }}>
                  {d.label}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                  {d.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: d.color, fontWeight: 700, flexShrink: 0, fontSize: 13, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "9px 14px", borderRadius: 8, background: "rgba(255,255,255,0.6)", border: `1px solid ${d.border}` }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: d.color }}>KPI clé : </span>
                  <span style={{ fontSize: 12.5, color: "#334155" }}>{d.kpi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KPIs programme data */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Mesure</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            KPIs d&apos;un programme data
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Ce qui ne se mesure pas ne s&apos;améliore pas. Et ce qui ne se présente pas au COMEX n&apos;existe pas.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {KPIS.map(cat => (
              <div key={cat.categorie} className="card" style={{ padding: "24px 28px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: cat.color, marginBottom: 16, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>
                  {cat.categorie}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
                  {cat.indicateurs.map(ind => (
                    <div key={ind.label} style={{ padding: "14px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{ind.label}</span>
                        <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: `${cat.color}15`, color: cat.color, flexShrink: 0 }}>
                          {ind.cible}
                        </span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.55 }}>{ind.def}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modèles d'organisation */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Organisation</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            3 modèles d&apos;organisation data
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>Il n&apos;y a pas de modèle universel. Le meilleur dépend de la taille, de la maturité et de la culture de l&apos;organisation.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {ORGANISATIONS.map(org => (
              <div key={org.label} className="card" style={{ padding: "26px 24px", borderTop: `4px solid ${org.color}` }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: org.color, marginBottom: 4 }}>{org.label}</h3>
                <p style={{ fontSize: 12.5, color: "#94A3B8", marginBottom: 20 }}>{org.subtitle}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#15803D", marginBottom: 6 }}>Avantages</p>
                    {org.pour.map((p, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                        <span style={{ color: "#15803D", fontWeight: 700, flexShrink: 0 }}>+</span>
                        <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#BE123C", marginBottom: 6 }}>Limites</p>
                    {org.contre.map((c, i) => (
                      <div key={i} style={{ display: "flex", gap: 7, marginBottom: 4 }}>
                        <span style={{ color: "#BE123C", fontWeight: 700, flexShrink: 0 }}>−</span>
                        <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>{c}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "9px 12px", borderRadius: 8, background: `${org.color}10`, border: `1px solid ${org.color}25` }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: org.color }}>Idéal quand : </span>
                    <span style={{ fontSize: 12, color: "#475569" }}>{org.quand}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget data */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Budget</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Structure du budget data
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card" style={{ padding: "28px 24px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#64748B", marginBottom: 20 }}>Répartition type (hors data science avancée)</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {BUDGET_REPARTITION.map(b => (
                  <div key={b.poste}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13.5, color: "#334155", fontWeight: 500 }}>{b.poste}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: b.color, fontSize: 15 }}>{b.pct}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${b.pct}%`, background: b.color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Benchmark budget data / CA", value: "0,5 – 2%", note: "du CA annuel selon le secteur et la maturité" },
                { label: "Ratio optimal data engineers / analysts", value: "1 : 2", note: "un ingénieur pour deux analystes en moyenne" },
                { label: "Coût annuel moyen d'un data practitioner", value: "65 – 90k€", note: "charges comprises, hors management" },
                { label: "Amortissement d'une plateforme data", value: "3 – 5 ans", note: "avant de dépasser le ROI des solutions précédentes" },
              ].map(b => (
                <div key={b.label} className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12.5, color: "#64748B", marginBottom: 2 }}>{b.label}</p>
                    <p style={{ fontSize: 11.5, color: "#94A3B8" }}>{b.note}</p>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: "#7C3AED", flexShrink: 0 }}>{b.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Communication COMEX */}
        <div style={{ marginBottom: 64 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Influence</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Comment convaincre le COMEX
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Le COMEX raisonne en risque, revenu et coût — pas en architecture ou en technologie. Traduire chaque initiative data dans ce langage.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 14 }}>
            {COMEX_ARGUMENTS.map(a => (
              <div key={a.angle} className="card" style={{ padding: "22px 24px", borderLeft: "4px solid #7C3AED" }}>
                <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#7C3AED", display: "block", marginBottom: 8 }}>
                  {a.angle}
                </span>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.65, marginBottom: 14 }}>{a.arg}</p>
                <div style={{ padding: "8px 12px", borderRadius: 8, background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>Question à poser : </span>
                  <span style={{ fontSize: 12.5, color: "#5B21B6", fontStyle: "italic" }}>{a.hook}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 100 premiers jours */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Prise de poste</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Les 100 premiers jours
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            La cadence de prise de poste qui maximise la crédibilité et l&apos;impact à court terme.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {CENT_JOURS.map(phase => (
              <div key={phase.phase} style={{ background: phase.bg, border: `1.5px solid ${phase.color}25`, borderRadius: 16, padding: "26px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: phase.color, background: `${phase.color}15`, padding: "3px 9px", borderRadius: 100 }}>
                    {phase.phase}
                  </span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{phase.label}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {phase.actions.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: phase.color, fontWeight: 700, flexShrink: 0, fontSize: 12, marginTop: 2 }}>✓</span>
                      <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { href: "/metiers/chief-data-officer", label: "Fiche métier CDO complète", sub: "Salaire, compétences, journée type", color: "#7C3AED" },
            { href: "/gouvernance",                label: "Guide Data Gouvernance",    sub: "4 piliers, maturity model, checklists", color: "#0E7490" },
            { href: "/concepts/data-mesh",         label: "Concept : Data Mesh",      sub: "Architecture distribuée par domaine", color: "#B45309" },
          ].map(c => (
            <Link key={c.href} href={c.href} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "20px 20px", borderTop: `3px solid ${c.color}`, height: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.3 }}>{c.label}</span>
                <span style={{ fontSize: 12, color: "#94A3B8" }}>{c.sub}</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: c.color, marginTop: "auto" }}>Voir →</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
