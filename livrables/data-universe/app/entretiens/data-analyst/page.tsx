import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Préparer son entretien Data Analyst — Questions SQL, cas pratiques & conseils 2026 | Data Universe",
  description: "Guide complet pour réussir un entretien Data Analyst : questions SQL avec solutions, cas analytiques, statistiques, portfolio et questions à poser.",
};

const PROCESSUS = [
  {
    etape: 1, label: "Screening RH", duree: "30–45 min",
    color: "#7C3AED",
    desc: "Appel téléphonique ou visio avec un recruteur. Objectif : vérifier la cohérence du parcours, la motivation et les attentes salariales.",
    prep: ["Préparer son pitch en 90 secondes (qui tu es, d'où tu viens, pourquoi ce poste)", "Connaître son TJM ou ses prétentions salariales", "Avoir 2-3 questions sur l'équipe et le contexte"],
  },
  {
    etape: 2, label: "Test technique", duree: "1–3h à la maison",
    color: "#0E7490",
    desc: "SQL, parfois Python ou Excel. Souvent une analyse sur un jeu de données réel (CSV) avec questions guidées. L'objectif n'est pas la perfection mais la rigueur.",
    prep: ["Relire les window functions SQL (RANK, LAG, SUM OVER)", "Savoir faire un GROUP BY, JOIN et sous-requête", "Commenter son raisonnement même si la syntaxe est imparfaite"],
  },
  {
    etape: 3, label: "Entretien technique", duree: "45–60 min",
    color: "#B45309",
    desc: "Avec le Data Engineer ou le Lead Data Analyst. Questions SQL en live (souvent sur whiteboard ou Coderpad), questions sur tes projets passés et la stack.",
    prep: ["Réviser les jointures : INNER, LEFT, FULL OUTER", "Pratiquer la décomposition d'un problème à voix haute", "Connaître les outils de la stack annoncée dans l'offre"],
  },
  {
    etape: 4, label: "Cas métier / fit culturel", duree: "45–60 min",
    color: "#BE123C",
    desc: "Avec le manager et/ou les parties prenantes métier. On évalue la capacité à structurer un problème, communiquer des insights et travailler en équipe.",
    prep: ["Préparer 3 exemples STAR (Situation, Tâche, Action, Résultat)", "Avoir des exemples concrets d'impact de tes analyses", "Savoir expliquer un concept data simplement à un non-technicien"],
  },
];

const SQL_QUESTIONS = [
  {
    question: "Écrire une requête qui classe les clients par chiffre d'affaires sur les 12 derniers mois.",
    difficulte: "Classique",
    code: `SELECT
  customer_id,
  SUM(amount)                          AS ca_12m,
  RANK() OVER (ORDER BY SUM(amount) DESC) AS rang
FROM orders
WHERE order_date >= DATEADD('month', -12, CURRENT_DATE)
GROUP BY customer_id
ORDER BY rang;`,
    note: "RANK() donne des ex-æquo. ROW_NUMBER() force un ordre strict. DENSE_RANK() évite les sauts de rang après un ex-æquo.",
  },
  {
    question: "Calculer le chiffre d'affaires glissant sur 7 jours pour chaque produit.",
    difficulte: "Intermédiaire",
    code: `SELECT
  product_id,
  order_date,
  SUM(amount) AS ca_jour,
  SUM(SUM(amount)) OVER (
    PARTITION BY product_id
    ORDER BY order_date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS ca_7j
FROM orders
GROUP BY product_id, order_date
ORDER BY product_id, order_date;`,
    note: "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW définit une fenêtre de 7 jours. Attention à RANGE vs ROWS pour les dates.",
  },
  {
    question: "Identifier les clients qui ont passé une commande le mois dernier mais pas ce mois-ci.",
    difficulte: "Classique",
    code: `-- Méthode 1 : NOT IN
SELECT DISTINCT customer_id
FROM orders
WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', DATEADD('month', -1, CURRENT_DATE))
  AND customer_id NOT IN (
    SELECT customer_id FROM orders
    WHERE DATE_TRUNC('month', order_date) = DATE_TRUNC('month', CURRENT_DATE)
  );

-- Méthode 2 : LEFT JOIN (plus performante sur grands volumes)
SELECT DISTINCT m.customer_id
FROM orders m
LEFT JOIN orders c
  ON  m.customer_id = c.customer_id
  AND DATE_TRUNC('month', c.order_date) = DATE_TRUNC('month', CURRENT_DATE)
WHERE DATE_TRUNC('month', m.order_date) = DATE_TRUNC('month', DATEADD('month', -1, CURRENT_DATE))
  AND c.customer_id IS NULL;`,
    note: "Préférer LEFT JOIN + IS NULL à NOT IN sur les grandes tables : NOT IN est O(n²), le JOIN tire parti des index.",
  },
  {
    question: "Trouver le deuxième salaire le plus élevé dans chaque département.",
    difficulte: "Classique entretien",
    code: `WITH ranked AS (
  SELECT
    department_id,
    employee_id,
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT department_id, employee_id, salary
FROM ranked
WHERE rnk = 2;`,
    note: "DENSE_RANK() gère les ex-æquo. Si deux employés ont le même salaire max, ils partagent le rang 1 et le prochain est rang 2.",
  },
  {
    question: "Calculer le taux de rétention mensuelle des utilisateurs.",
    difficulte: "Avancé",
    code: `WITH monthly AS (
  SELECT
    user_id,
    DATE_TRUNC('month', activity_date) AS mois
  FROM user_activity
  GROUP BY 1, 2
),
retention AS (
  SELECT
    m1.mois                      AS mois_ref,
    COUNT(DISTINCT m1.user_id)   AS actifs_mois_ref,
    COUNT(DISTINCT m2.user_id)   AS actifs_mois_suivant
  FROM monthly m1
  LEFT JOIN monthly m2
    ON  m1.user_id = m2.user_id
    AND m2.mois = DATEADD('month', 1, m1.mois)
  GROUP BY m1.mois
)
SELECT
  mois_ref,
  actifs_mois_ref,
  actifs_mois_suivant,
  ROUND(100.0 * actifs_mois_suivant / actifs_mois_ref, 1) AS taux_retention_pct
FROM retention
ORDER BY mois_ref;`,
    note: "C'est la question qui distingue les bons candidats. Elle combine CTE, auto-jointure et window function implicite.",
  },
];

const CAS_ANALYTIQUES = [
  {
    question: "Le taux de conversion de notre tunnel d'achat a chuté de 15% la semaine dernière. Comment analysez-vous la situation ?",
    methode: "Décomposer → Isoler → Hypothèses → Valider",
    etapes: [
      { label: "Décomposer", detail: "Segmenter la chute par device (mobile/desktop), source de trafic (SEA/SEO/direct), pays, type de produit, étape du tunnel (panier/checkout/paiement)." },
      { label: "Isoler", detail: "Y a-t-il un segment spécifique qui explique toute la baisse ? (ex : mobile représente 70% de la chute mais seulement 40% du trafic)" },
      { label: "Chercher les corrélations temporelles", detail: "Un déploiement produit, une campagne, un incident technique, un changement de prix ont-ils eu lieu le même jour ?" },
      { label: "Formuler 3 hypothèses", detail: "Ex : (1) Bug sur le bouton de paiement iOS, (2) Prix augmentés sur une catégorie, (3) Ralentissement du chargement après un déploiement." },
      { label: "Valider avec les données", detail: "Pour chaque hypothèse : requête SQL ou dashboard pour confirmer ou infirmer. Présenter les résultats avec des % et des volumes absolus." },
    ],
    pitfall: "Ne jamais conclure sans données. \"Je pense que c'est le mobile\" n'est pas une analyse.",
  },
  {
    question: "On vous demande de créer 10 dashboards en 2 semaines avec une équipe de 2 analystes. Comment priorisez-vous ?",
    methode: "Impact × Effort → Priorisation ICE",
    etapes: [
      { label: "Qualifier chaque dashboard", detail: "Qui l'utilise ? À quelle fréquence ? Quelle décision permet-il de prendre ? Est-il bloquant pour quelqu'un ?" },
      { label: "Scorer Impact / Confiance / Effort", detail: "ICE score = (Impact × Confiance) / Effort. Note chaque dashboard de 1 à 10 sur les 3 critères." },
      { label: "Identifier les dépendances de données", detail: "Certains dashboards partagent-ils les mêmes sources ? Si oui, les regrouper dans la même sprint pour mutualiser la préparation." },
      { label: "Communiquer le plan", detail: "Présenter la priorisation aux parties prenantes avec le raisonnement. Les 3 premiers à livrer, les 7 suivants avec date estimée." },
    ],
    pitfall: "Dire \"non\" sans alternative nuit à la relation. Dire \"oui\" à tout sans prioriser nuit à la qualité.",
  },
];

const STATS_QUESTIONS = [
  {
    q: "Quelle est la différence entre corrélation et causalité ?",
    r: "La corrélation mesure si deux variables évoluent ensemble (coefficient de Pearson entre -1 et 1). La causalité affirme qu'une variable cause l'autre. Une corrélation forte ne prouve pas de causalité : ventes de glaces et noyades corrèlent toutes les deux avec la chaleur estivale, sans lien causal entre elles. Pour établir la causalité, il faut un test contrôlé (A/B test), une expérience naturelle ou des méthodes d'inférence causale.",
    niveau: "Classique",
  },
  {
    q: "Qu'est-ce qu'une p-value ? À quel seuil la considère-t-on significative ?",
    r: "La p-value est la probabilité d'observer un résultat aussi extrême que celui mesuré si l'hypothèse nulle (H0 : pas d'effet) était vraie. Convention : p < 0,05 = résultat significatif au seuil de 5%. Attention : p < 0,05 ne signifie pas que l'effet est important, seulement qu'il est improbable d'être dû au hasard. Avec un échantillon énorme, un effet minuscule peut être statistiquement significatif mais économiquement nul.",
    niveau: "Classique",
  },
  {
    q: "Qu'est-ce qu'un outlier ? Quand le supprimer vs le conserver ?",
    r: "Un outlier est une valeur qui s'écarte fortement de la distribution (souvent défini comme > 3 écarts-types ou au-delà de 1,5 × IQR). Il faut d'abord vérifier si c'est une erreur de données (typo, doublons) ou une vraie valeur extrême. Supprimer un outlier valide biaise l'analyse. Le garder sans le mentionner aussi. La bonne pratique : documenter le choix, présenter les résultats avec et sans outliers si l'impact est significatif.",
    niveau: "Intermédiaire",
  },
  {
    q: "Comment calculer la taille d'échantillon nécessaire pour un A/B test ?",
    r: "3 paramètres : (1) l'effet minimal détectable (MDE — quelle amélioration relative minimale veux-tu détecter ?), (2) la puissance statistique cible (80% ou 90% par convention), (3) le seuil alpha (0,05). Plus le MDE est faible, plus l'échantillon doit être grand. En pratique, les outils comme Evan Miller's A/B Size Calculator ou scipy.stats.power calculent ça automatiquement. Un test lancé sans calcul préalable risque d'être sous-dimensionné et de manquer des effets réels.",
    niveau: "Avancé",
  },
];

const QUESTIONS_A_POSER = [
  {
    theme: "Sur la stack technique",
    questions: [
      "Quelle est votre stack data principale — warehouse, BI, orchestration ?",
      "Est-ce que l'équipe utilise dbt ? Git pour le versionning des requêtes ?",
      "Comment les analyses ad hoc sont-elles gérées — tickets, Slack, rituels ?",
    ],
  },
  {
    theme: "Sur l'équipe et la structure",
    questions: [
      "Comment est organisée l'équipe data (centralisée, embedded dans les BUs) ?",
      "À qui les Data Analysts sont-ils rattachés — DSI, CDO, direction métier ?",
      "Quel est le ratio Data Analysts / Data Engineers dans l'équipe ?",
    ],
  },
  {
    theme: "Sur le poste et la progression",
    questions: [
      "Quels seraient mes 3 premiers projets si je rejoins l'équipe ?",
      "Comment se passe l'onboarding — existe-t-il de la documentation ?",
      "Quelles sont les perspectives d'évolution vers Analytics Engineer ou Data Scientist ?",
    ],
  },
];

const ERREURS = [
  { titre: "Écrire du SQL sans l'expliquer", desc: "En entretien live, penser à voix haute. L'interlocuteur évalue autant le raisonnement que la syntaxe." },
  { titre: "Confondre la question et l'hypothèse", desc: "\"Je pense que le problème vient de X\" n'est pas une analyse. Une analyse commence par une question, pas une réponse." },
  { titre: "Ne pas connaître ses propres projets", desc: "Si un projet est sur ton CV, tu dois pouvoir expliquer chaque décision technique et chaque limitation en 2 minutes." },
  { titre: "Ignorer les questions sur les données manquantes", desc: "Tout vrai dataset a des nulls et des anomalies. Montrer que tu sais les traiter est un signal fort de maturité." },
  { titre: "Ne poser aucune question", desc: "Un candidat qui ne pose pas de questions paraît désintéressé. Prépare 3 questions pertinentes — pas sur le salaire en premier entretien." },
  { titre: "Surestimer son niveau SQL", desc: "Le niveau SQL d'un Junior est souvent surévalué par les candidats. Mieux vaut dire 'je n'ai jamais utilisé les CTEs mais voici comment j'approcherais le problème'." },
];

export default function EntretiensDataAnalystPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "64px 24px 52px", borderBottom: "1px solid #E2E8F0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(124,58,237,0.07)", top: -100, right: -60, filter: "blur(80px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, fontSize: 13, color: "#94A3B8" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <Link href="/entretiens" style={{ color: "#94A3B8" }}>Entretiens</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Data Analyst</span>
          </div>
          <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            Guide entretien
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Réussir son entretien<br />
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Data Analyst</span>
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, maxWidth: 600, marginBottom: 32 }}>
            Questions SQL avec solutions, cas analytiques, statistiques et questions à poser. Ce que les recruteurs attendent vraiment en 2026.
          </p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {[
              { n: "5", l: "questions SQL avec solutions" },
              { n: "2", l: "cas analytiques détaillés" },
              { n: "4", l: "questions stats expliquées" },
              { n: "6", l: "erreurs à éviter" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "#7C3AED" }}>{n}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px" }}>

        {/* Processus type */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Processus</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Les 4 étapes d&apos;un entretien Data Analyst
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, position: "relative" }}>
            <div style={{ position: "absolute", left: 19, top: 0, bottom: 0, width: 2, background: "linear-gradient(180deg, #7C3AED, #06B6D4)", borderRadius: 1, opacity: 0.2 }} />
            {PROCESSUS.map((p, i) => (
              <div key={p.etape} style={{ display: "flex", gap: 20, paddingBottom: i < PROCESSUS.length - 1 ? 28 : 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: p.color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "#fff", flexShrink: 0, zIndex: 1 }}>
                  {p.etape}
                </div>
                <div className="card" style={{ flex: 1, padding: "20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{p.label}</span>
                    <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>{p.duree}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, marginBottom: 14 }}>{p.desc}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {p.prep.map((item, j) => (
                      <div key={j} style={{ display: "flex", gap: 8 }}>
                        <span style={{ color: p.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions SQL */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Technique</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Questions SQL incontournables
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Synthèse des questions les plus fréquentes dans les entretiens DA en France — avec les solutions et les pièges à éviter.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {SQL_QUESTIONS.map((q, i) => (
              <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.5, flex: 1 }}>{q.question}</p>
                  <span style={{
                    padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: q.difficulte === "Avancé" ? "#EDE9FE" : q.difficulte === "Intermédiaire" ? "#FEF3C7" : "#F0FDF4",
                    color: q.difficulte === "Avancé" ? "#5B21B6" : q.difficulte === "Intermédiaire" ? "#92400E" : "#15803D",
                  }}>
                    {q.difficulte}
                  </span>
                </div>
                <div style={{ background: "#0B0F23" }}>
                  <div style={{ padding: "8px 20px", background: "#0F1629", borderBottom: "1px solid rgba(85,88,255,0.15)" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#06B6D4", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>SQL</span>
                  </div>
                  <pre style={{ margin: 0, padding: "18px 22px", fontFamily: "var(--font-mono)", fontSize: 12.5, lineHeight: 1.75, color: "#CBD5E1", overflowX: "auto", whiteSpace: "pre" }}>
                    <code>{q.code}</code>
                  </pre>
                </div>
                <div style={{ padding: "12px 22px", background: "#FFFBEB", borderTop: "1px solid #FDE68A", display: "flex", gap: 8 }}>
                  <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>!</span>
                  <p style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>{q.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cas analytiques */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Cas pratiques</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Structurer un cas analytique
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Ces questions n&apos;ont pas de bonne réponse unique. Ce qu&apos;on évalue : la structure du raisonnement, la rigueur et la communication.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {CAS_ANALYTIQUES.map((cas, i) => (
              <div key={i} className="card" style={{ padding: "26px 28px" }}>
                <div style={{ padding: "12px 16px", borderRadius: 10, background: "#F5F3FF", border: "1px solid #DDD6FE", marginBottom: 20 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", lineHeight: 1.55 }}>&ldquo;{cas.question}&rdquo;</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#7C3AED" }}>Méthode :</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#475569" }}>{cas.methode}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cas.etapes.map((e, j) => (
                    <div key={j} style={{ display: "flex", gap: 14 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 11, color: "#fff", flexShrink: 0, marginTop: 1 }}>
                        {j + 1}
                      </div>
                      <div>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{e.label} — </span>
                        <span style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.6 }}>{e.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 18, padding: "10px 14px", borderRadius: 8, background: "#FFF1F2", border: "1px solid #FECDD3", display: "flex", gap: 8 }}>
                  <span style={{ color: "#BE123C", fontWeight: 700, flexShrink: 0 }}>✗</span>
                  <p style={{ fontSize: 12.5, color: "#9F1239", lineHeight: 1.55 }}><strong>Piège :</strong> {cas.pitfall}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Questions statistiques */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Statistiques</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Questions de statistiques et probabilités
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {STATS_QUESTIONS.map((sq, i) => (
              <div key={i} className="card" style={{ padding: "22px 26px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.45, flex: 1 }}>{sq.q}</p>
                  <span style={{
                    padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0,
                    background: sq.niveau === "Avancé" ? "#EDE9FE" : sq.niveau === "Intermédiaire" ? "#FEF3C7" : "#F0FDF4",
                    color: sq.niveau === "Avancé" ? "#5B21B6" : sq.niveau === "Intermédiaire" ? "#92400E" : "#15803D",
                  }}>
                    {sq.niveau}
                  </span>
                </div>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.75 }}>{sq.r}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions à poser */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Prépare aussi</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Questions à poser à ton interlocuteur
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>
            Un entretien est un échange, pas un interrogatoire. Tes questions signalent ta maturité professionnelle.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {QUESTIONS_A_POSER.map(cat => (
              <div key={cat.theme} className="card" style={{ padding: "20px 22px" }}>
                <p style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#7C3AED", marginBottom: 14 }}>{cat.theme}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cat.questions.map((q, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#7C3AED", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>?</span>
                      <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.55 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Erreurs fréquentes */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>À éviter</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Les 6 erreurs qui coûtent l&apos;offre
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 12 }}>
            {ERREURS.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "16px 18px", borderRadius: 12, background: "#FFF1F2", border: "1px solid #FECDD3" }}>
                <span style={{ color: "#BE123C", fontWeight: 800, fontSize: 15, flexShrink: 0, marginTop: 1 }}>✗</span>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#9F1239", marginBottom: 4 }}>{e.titre}</p>
                  <p style={{ fontSize: 13, color: "#BE123C", lineHeight: 1.55 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA footer */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#0B0F29", borderRadius: 16, padding: "28px 24px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA", marginBottom: 6 }}>Approfondir le SQL</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 18 }}>
              Concepts : window functions, CTEs, optimisation des requêtes
            </p>
            <Link href="/concepts/segmentation-rfm" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
              Voir un exemple SQL complet →
            </Link>
          </div>
          <div style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", borderRadius: 16, padding: "28px 24px", border: "1px solid #DDD6FE" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 6 }}>Fiche métier complète</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 18 }}>
              Data Analyst — salaire, compétences et trajectoire 2026
            </p>
            <Link href="/metiers/data-analyst" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
              Voir la fiche Data Analyst →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
