import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Méthodologie des données salariales — Calculateur Data Universe",
  description: "Sources, modèle de calcul et limites du calculateur de salaire Data Universe. Transparence totale sur la façon dont les fourchettes sont construites.",
};

const SOURCES = [
  {
    nom: "LinkedIn Jobs (France)",
    type: "Offres d'emploi",
    url: "https://linkedin.com/jobs",
    desc: "Analyse des salaires annoncés sur plus de 3 000 offres CDI data publiées entre janvier et juin 2026. Les offres sans fourchette salariale ont été exclues.",
    poids: "35%",
    color: "#0A66C2",
  },
  {
    nom: "Welcome to the Jungle",
    type: "Offres d'emploi",
    url: "https://www.welcometothejungle.com",
    desc: "Fourchettes salariales affichées sur les offres startups et scale-ups data. Source particulièrement utile pour les profils AI Engineer et ML Engineer.",
    poids: "20%",
    color: "#4ADE80",
  },
  {
    nom: "Glassdoor France",
    type: "Témoignages",
    url: "https://www.glassdoor.fr",
    desc: "Salaires déclarés anonymement par des professionnels data en France. Filtres appliqués : France, CDI, expérience 0-15 ans. N > 150 par métier.",
    poids: "20%",
    color: "#0CAA41",
  },
  {
    nom: "Étude Fygr 2025",
    type: "Étude de marché",
    url: "https://www.fygr.com",
    desc: "Étude annuelle sur les salaires dans la tech française. Couvre les métiers data avec des percentiles P25/P50/P75 par expérience et localisation.",
    poids: "15%",
    color: "#7C3AED",
  },
  {
    nom: "CodinGame — State of Tech Salaries 2025",
    type: "Enquête",
    url: "https://www.codingame.com",
    desc: "Enquête conduite auprès de 4 200 développeurs et data professionals en France. Résultats segmentés par rôle, expérience et taille d'entreprise.",
    poids: "10%",
    color: "#F97316",
  },
];

const MODELE_ETAPES = [
  {
    num: "1",
    titre: "Fourchette brute du métier",
    desc: "Chaque métier a une fourchette Min–Max établie à partir des sources pondérées (voir tableau). Elle représente les salaires observés du débutant (< 2 ans) à l'expert (> 12 ans), indépendamment de la localisation.",
    exemple: "Data Engineer : 45–90k€",
    code: "base = salaryMin + (salaryMax - salaryMin) × (expérience / 15)",
  },
  {
    num: "2",
    titre: "Ajustement géographique",
    desc: "Un multiplicateur est appliqué selon la zone géographique. Il reflète les différentiels de coût de la vie et de tension du marché observés dans les offres analysées.",
    exemple: "Paris × 1.15 | Lyon, Bordeaux × 1.05 | Province × 1.00",
    code: "base_géo = base × localisationMultiplier",
  },
  {
    num: "3",
    titre: "Bonus compétences premium",
    desc: "Les compétences identifiées comme rares et fortement demandées en 2026 (dbt, Kubernetes, LLMs/RAG…) ont un bonus exprimé en %. Ces bonus sont plafonnés à +30% cumulés pour éviter des estimations hors marché.",
    exemple: "LLMs/RAG +10% | Spark +8% | Kubernetes +7%",
    code: "bonusComp = min(Σ bonus_compétence_sélectionnée, 30%)",
  },
  {
    num: "4",
    titre: "Bonus certification",
    desc: "Les certifications cloud et data reconnues apportent un bonus unique (non cumulable avec d'autres certifications). Ces valeurs sont issues des différentiels observés sur LinkedIn entre profils certifiés et non certifiés.",
    exemple: "AWS Pro +10% | Databricks +8% | AWS Associate +5%",
    code: "bonusCert = bonus_certification_sélectionnée",
  },
  {
    num: "5",
    titre: "Fourchette finale",
    desc: "La fourchette affichée est centrée sur le salaire estimé avec un intervalle de ±8k€ pour refléter la dispersion naturelle à expérience et profil égaux (secteur, taille d'entreprise, négociation).",
    exemple: "Résultat = [mid - 8k€, mid + 8k€]",
    code: "mid = base_géo × (1 + bonusComp/100 + bonusCert/100)\nrésultat = [mid - 8, mid + 8]",
  },
];

const LIMITES = [
  {
    titre: "Biais entreprises qui affichent les salaires",
    desc: "Les offres avec salaire affiché sont surreprésentées dans les startups et scale-ups tech. Les grands groupes traditionnels (banque, assurance, industrie) affichent moins souvent les salaires et tendent à rémunérer différemment.",
  },
  {
    titre: "Variable vs fixe non distingués",
    desc: "Les fourchettes représentent le salaire fixe brut annuel. Les bonus, participations, BSPCE et avantages en nature (RTT, tickets restaurant, mutuelle) ne sont pas comptabilisés et peuvent représenter 5–25% de la rémunération totale.",
  },
  {
    titre: "Taille de l'entreprise non prise en compte",
    desc: "Les startups early-stage rémunèrent généralement 10–20% en dessous du marché mais compensent avec des BSPCE. Les grands groupes peuvent être au-dessus pour les experts, mais la progression y est plus lente.",
  },
  {
    titre: "Freelance exclu du modèle",
    desc: "Le calculateur est conçu pour des salaires CDI. Les TJM freelance suivent une logique différente (sans charges patronales, sans avantages en nature) et ne sont pas couverts.",
  },
  {
    titre: "Mise à jour semi-annuelle",
    desc: "Les données sont recalibrées deux fois par an (janvier et juillet). Le marché data évolue vite : les fourchettes peuvent diverger rapidement, surtout pour les profils AI Engineer et MLOps.",
  },
];

export default function MethodologieSalairesPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
        padding: "56px 24px 44px", borderBottom: "1px solid #E2E8F0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.07)", top: -80, right: -40, filter: "blur(60px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, fontSize: 13, color: "#94A3B8", flexWrap: "wrap" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <Link href="/calculateur-salaire" style={{ color: "#94A3B8" }}>Calculateur salaire</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Méthodologie</span>
          </div>
          <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 18 }}>
            Transparence
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Comment sont construites<br />
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>nos fourchettes salariales</span>
          </h1>
          <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.75, maxWidth: 580, marginBottom: 24 }}>
            Sources utilisées, modèle de calcul étape par étape et limites à connaître.
            Cette page est mise à jour à chaque recalibrage des données.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {[
              { label: "5 sources croisées", color: "#7C3AED", bg: "#EDE9FE", border: "#DDD6FE" },
              { label: "Données 2025-2026", color: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC" },
              { label: "CDI uniquement", color: "#15803D", bg: "#F0FDF4", border: "#86EFAC" },
              { label: "Mise à jour janv. 2026", color: "#B45309", bg: "#FFFBEB", border: "#FDE68A" },
            ].map(t => (
              <span key={t.label} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, color: t.color, background: t.bg, border: `1px solid ${t.border}` }}>{t.label}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 72px" }}>

        {/* Sources */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Données</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            5 sources croisées
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 28 }}>
            Aucune source unique n&apos;est suffisamment fiable seule. Chaque source a ses biais propres, c&apos;est pourquoi nous les pondérons et les croisons.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SOURCES.map(src => (
              <div key={src.nom} className="card" style={{ padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: src.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", fontFamily: "var(--font-display)" }}>{src.nom.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#0F172A", textDecoration: "none" }}>
                          {src.nom}
                        </a>
                        <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{src.type}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>{src.desc}</p>
                  </div>
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{src.poids}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>pondération</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Note collecte */}
          <div style={{ marginTop: 16, padding: "14px 18px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", gap: 10 }}>
            <span style={{ color: "#94A3B8", flexShrink: 0 }}>ℹ</span>
            <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.65 }}>
              La collecte des données a été réalisée entre novembre 2025 et janvier 2026. Seules les offres et témoignages en France métropolitaine avec un salaire brut annuel explicite ont été retenus. Les offres en dehors de la plage 25–150k€ brut ont été filtrées comme outliers.
            </p>
          </div>
        </div>

        {/* Modèle de calcul */}
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Modèle</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Le calcul étape par étape
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 28 }}>
            Le modèle est intentionnellement simple et transparent. Il ne prétend pas être une IA ou un algorithme complexe. C&apos;est une formule paramétrique lisible par tous.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #7C3AED, #06B6D4)", borderRadius: 1, opacity: 0.2 }} />
            {MODELE_ETAPES.map((etape, i) => (
              <div key={etape.num} style={{ display: "flex", gap: 20, paddingBottom: i < MODELE_ETAPES.length - 1 ? 24 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 14, color: "#fff", flexShrink: 0, zIndex: 1 }}>
                  {etape.num}
                </div>
                <div className="card" style={{ flex: 1, padding: "20px 22px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>{etape.titre}</p>
                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, marginBottom: 12 }}>{etape.desc}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 160, padding: "8px 12px", background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 8 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#7C3AED", marginBottom: 4 }}>Exemple</p>
                      <p style={{ fontSize: 12.5, color: "#5B21B6", fontWeight: 600 }}>{etape.exemple}</p>
                    </div>
                    <div style={{ flex: 2, minWidth: 200, padding: "8px 12px", background: "#0B0F23", borderRadius: 8 }}>
                      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#A78BFA", marginBottom: 4 }}>Formule</p>
                      <pre style={{ fontSize: 11, color: "#CBD5E1", fontFamily: "var(--font-mono)", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{etape.code}</pre>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Formule complète */}
          <div style={{ marginTop: 24, borderRadius: 14, overflow: "hidden", border: "1px solid rgba(85,88,255,0.18)" }}>
            <div style={{ background: "#0F1629", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#A78BFA", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Formule complète</span>
            </div>
            <pre style={{ margin: 0, padding: "20px 24px", background: "#0B0F23", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.9, color: "#CBD5E1", overflowX: "auto" }}>{`// 1. Base selon l'expérience
base = salaryMin + (salaryMax - salaryMin) × (années / 15)

// 2. Ajustement géographique
base_géo = base × locMultiplier  // Paris 1.15 | Lyon 1.05 | Province 1.00

// 3. Bonus compétences (plafonné)
bonusComp = min(Σ bonus_skills_sélectionnées, 30)  // en %

// 4. Bonus certification
bonusCert = certBonus  // 0–10%, une seule certification

// 5. Fourchette finale (±8k€)
mid = base_géo × (1 + (bonusComp + bonusCert) / 100)
résultat = { bas: round(mid - 8), haut: round(mid + 8) }`}</pre>
          </div>
        </div>

        {/* Limites */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Honnêteté</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Ce que le calculateur ne fait pas bien
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>
            La transparence inclut d&apos;indiquer clairement les cas où l&apos;estimation peut être trompeuse.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {LIMITES.map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0, fontSize: 14, marginTop: 1 }}>!</span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#92400E", marginBottom: 4 }}>{l.titre}</p>
                  <p style={{ fontSize: 13, color: "#B45309", lineHeight: 1.65 }}>{l.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA retour */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/calculateur-salaire" className="btn-primary" style={{ fontSize: 13 }}>
            Utiliser le calculateur →
          </Link>
          <Link href="/metiers" className="btn-secondary" style={{ fontSize: 13 }}>
            Fiches métiers avec salaires
          </Link>
        </div>

      </div>
    </main>
  );
}
