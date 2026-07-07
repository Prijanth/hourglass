import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Réussir son entretien data — Guide complet tous rôles 2026 | Data Universe",
  description: "Guide pour réussir un entretien data : DA, DE, DS, Analytics Engineer, ML Engineer. SQL, Python, ML, cas pratiques, STAR et questions à poser.",
};

/* ── Données ──────────────────────────────────────────── */

const ROLES = [
  { id: "da",  label: "Data Analyst",        color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", techs: ["SQL", "Excel/BI", "Statistiques", "Visualisation"] },
  { id: "de",  label: "Data Engineer",       color: "#0E7490", bg: "#ECFEFF", border: "#A5F3FC", techs: ["SQL", "Python", "Architecture", "Orchestration"] },
  { id: "ds",  label: "Data Scientist",      color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", techs: ["Python", "ML", "Statistiques", "Feature Engineering"] },
  { id: "ae",  label: "Analytics Engineer",  color: "#15803D", bg: "#F0FDF4", border: "#86EFAC", techs: ["SQL avancé", "dbt", "Modélisation", "Git"] },
  { id: "mle", label: "ML Engineer",         color: "#BE123C", bg: "#FFF1F2", border: "#FECDD3", techs: ["Python", "MLOps", "Docker/K8s", "System Design"] },
  { id: "cdo", label: "CDO / Manager Data",  color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0", techs: ["Stratégie", "Communication", "KPIs", "Budget"] },
];


const SQL_QUESTIONS = [
  {
    question: "Classer les clients par chiffre d'affaires sur les 12 derniers mois.",
    roles: ["DA", "AE", "DE"],
    difficulte: "Classique",
    code: `SELECT
  customer_id,
  SUM(amount)                               AS ca_12m,
  RANK() OVER (ORDER BY SUM(amount) DESC)   AS rang
FROM orders
WHERE order_date >= DATEADD('month', -12, CURRENT_DATE)
GROUP BY customer_id
ORDER BY rang;`,
    note: "RANK() donne des ex-æquo. ROW_NUMBER() force un ordre strict. DENSE_RANK() évite les sauts de rang après un ex-æquo.",
  },
  {
    question: "Calculer le chiffre d'affaires glissant sur 7 jours par produit.",
    roles: ["DA", "AE"],
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
GROUP BY product_id, order_date;`,
    note: "ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = fenêtre de 7 jours. Attention : RANGE vs ROWS diffère sur les dates dupliquées.",
  },
  {
    question: "Clients actifs le mois dernier mais pas ce mois-ci.",
    roles: ["DA", "AE", "DE"],
    difficulte: "Classique",
    code: `-- Méthode recommandée : LEFT JOIN + IS NULL (plus performant que NOT IN)
SELECT DISTINCT m.customer_id
FROM orders m
LEFT JOIN orders c
  ON  m.customer_id = c.customer_id
  AND DATE_TRUNC('month', c.order_date) = DATE_TRUNC('month', CURRENT_DATE)
WHERE DATE_TRUNC('month', m.order_date) = DATE_TRUNC('month', DATEADD('month', -1, CURRENT_DATE))
  AND c.customer_id IS NULL;`,
    note: "NOT IN est O(n²) sur grandes tables. LEFT JOIN + IS NULL tire parti des index et est plus lisible.",
  },
  {
    question: "Trouver le deuxième salaire le plus élevé dans chaque département.",
    roles: ["DA", "DE", "AE"],
    difficulte: "Classique entretien",
    code: `WITH ranked AS (
  SELECT
    department_id, employee_id, salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT department_id, employee_id, salary
FROM ranked
WHERE rnk = 2;`,
    note: "DENSE_RANK() gère les ex-æquo. Si deux personnes partagent le rang 1, le suivant est bien rang 2 (pas 3 comme avec RANK).",
  },
  {
    question: "Calculer le taux de rétention mensuelle des utilisateurs.",
    roles: ["DA", "DS"],
    difficulte: "Avancé",
    code: `WITH monthly AS (
  SELECT user_id, DATE_TRUNC('month', activity_date) AS mois
  FROM user_activity
  GROUP BY 1, 2
),
retention AS (
  SELECT
    m1.mois                     AS mois_ref,
    COUNT(DISTINCT m1.user_id)  AS actifs_ref,
    COUNT(DISTINCT m2.user_id)  AS actifs_suivant
  FROM monthly m1
  LEFT JOIN monthly m2
    ON  m1.user_id = m2.user_id
    AND m2.mois = DATEADD('month', 1, m1.mois)
  GROUP BY m1.mois
)
SELECT mois_ref, ROUND(100.0 * actifs_suivant / actifs_ref, 1) AS retention_pct
FROM retention ORDER BY mois_ref;`,
    note: "La question qui distingue les meilleurs candidats — combine CTE, auto-jointure temporelle et calcul de ratio.",
  },
  {
    question: "Détecter les doublons dans une table et garder la ligne la plus récente.",
    roles: ["DE", "AE"],
    difficulte: "Classique DE",
    code: `WITH dedup AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY customer_id
      ORDER BY updated_at DESC
    ) AS rn
  FROM customers
)
SELECT * EXCLUDE (rn)
FROM dedup
WHERE rn = 1;`,
    note: "Pattern fondamental en Data Engineering. ROW_NUMBER() + PARTITION BY est le moyen standard de dédupliquer. EXCLUDE est Snowflake/BigQuery — adapter à la syntaxe du warehouse.",
  },
  {
    question: "Calculer la médiane d'un salaire par département sans fonction MEDIAN().",
    roles: ["DA", "DS"],
    difficulte: "Avancé",
    code: `WITH ordered AS (
  SELECT
    department_id, salary,
    ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary) AS rn,
    COUNT(*) OVER (PARTITION BY department_id)                     AS total
  FROM employees
)
SELECT department_id,
  AVG(salary) AS mediane
FROM ordered
WHERE rn IN (FLOOR((total + 1) / 2.0), CEIL((total + 1) / 2.0))
GROUP BY department_id;`,
    note: "La médiane nécessite de gérer les cas pair/impair. AVG sur les deux valeurs centrales fonctionne pour les deux cas.",
  },
  {
    question: "Écrire un pipeline dbt-style : créer une table de faits commandes à partir de 3 sources.",
    roles: ["AE", "DE"],
    difficulte: "Avancé AE",
    code: `-- models/marts/fct_orders.sql
WITH orders AS (SELECT * FROM {{ ref('stg_orders') }}),
     customers AS (SELECT * FROM {{ ref('stg_customers') }}),
     products AS (SELECT * FROM {{ ref('stg_products') }})

SELECT
  o.order_id,
  o.order_date,
  c.customer_id,
  c.country,
  p.product_id,
  p.category,
  o.quantity,
  o.unit_price,
  o.quantity * o.unit_price AS revenue
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.customer_id
LEFT JOIN products  p ON o.product_id  = p.product_id`,
    note: "En AE, on attend que tu structures la logique en couches (staging → intermediate → marts). Expliquer pourquoi on LEFT JOIN et pas INNER JOIN est un signal de maturité.",
  },
];

const PYTHON_QUESTIONS = [
  {
    question: "Nettoyer et transformer un DataFrame : doublons, nulls, types.",
    roles: ["DS", "DE", "MLE"],
    difficulte: "Classique",
    code: `import pandas as pd

df = pd.read_csv("data.csv")

# 1. Doublons
df = df.drop_duplicates(subset=["customer_id", "order_date"])

# 2. Valeurs manquantes
df["revenue"] = df["revenue"].fillna(0)
df = df.dropna(subset=["customer_id"])  # obligatoire

# 3. Types
df["order_date"] = pd.to_datetime(df["order_date"])
df["customer_id"] = df["customer_id"].astype(str)

# 4. Vérification
assert df["customer_id"].nunique() == df.shape[0], "IDs non uniques"
print(df.dtypes)`,
    note: "Toujours vérifier avec assert ou des tests après transformation. L'absence de validation est une red flag en entretien.",
  },
  {
    question: "Écrire une classe Python pour un pipeline ETL simple.",
    roles: ["DE", "MLE"],
    difficulte: "Intermédiaire",
    code: `class ETLPipeline:
    def __init__(self, source: str, target: str):
        self.source = source
        self.target = target

    def extract(self) -> pd.DataFrame:
        return pd.read_csv(self.source)

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.dropna()
        df["amount_eur"] = df["amount_usd"] * 0.92
        return df

    def load(self, df: pd.DataFrame) -> None:
        df.to_parquet(self.target, index=False)

    def run(self) -> None:
        raw = self.extract()
        clean = self.transform(raw)
        self.load(clean)
        print(f"Pipeline OK — {len(clean)} lignes chargées")

pipeline = ETLPipeline("input.csv", "output.parquet")
pipeline.run()`,
    note: "L'interviewer évalue : séparation des responsabilités, typage, logs/assertions. Une seule fonction monolithique est un signal négatif.",
  },
  {
    question: "Détecter une data leakage dans un pipeline ML.",
    roles: ["DS", "MLE"],
    difficulte: "Avancé",
    code: `from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

X, y = features, labels

# ❌ MAUVAIS : le scaler voit le test set
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)       # <-- leakage
# X_train, X_test = train_test_split(X_scaled, ...)

# ✅ BON : le scaler n'est fit que sur le train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model",  LogisticRegression()),
])
pipe.fit(X_train, y_train)  # fit uniquement sur train
score = pipe.score(X_test, y_test)`,
    note: "La leakage est l'erreur la plus courante en DS junior. Un Pipeline sklearn garantit que le preprocessing est fit uniquement sur les données d'entraînement.",
  },
];

const ML_QUESTIONS = [
  {
    q: "Quelle est la différence entre biais et variance ? Comment les gérer ?",
    r: "Le biais est l'erreur due à des hypothèses trop simplistes (underfitting) — le modèle ne capture pas la complexité des données. La variance est l'erreur due à une trop grande sensibilité aux données d'entraînement (overfitting) — le modèle mémorise le bruit. Pour réduire le biais : modèle plus complexe, plus de features. Pour réduire la variance : régularisation (L1/L2), plus de données, dropout, ensemble methods. Le trade-off biais-variance est fondamental : réduire l'un augmente souvent l'autre.",
    niveau: "Classique DS/MLE",
  },
  {
    q: "Qu'est-ce que la validation croisée ? Pourquoi l'utiliser ?",
    r: "La cross-validation (k-fold) divise le dataset en k parties. Le modèle est entraîné sur k-1 parties et évalué sur la dernière, répété k fois. Avantages : meilleure estimation de la performance (moins de variance que un seul split), utilise toutes les données à la fois pour l'entraînement et la validation. En pratique : k=5 ou k=10. Pour les séries temporelles, utiliser TimeSeriesSplit pour éviter de voir le futur.",
    niveau: "Classique DS/MLE",
  },
  {
    q: "Quelle est la différence entre corrélation et causalité ?",
    r: "La corrélation mesure si deux variables évoluent ensemble (Pearson entre -1 et 1). La causalité affirme qu'une variable cause l'autre. Une corrélation forte ne prouve pas de causalité. Pour établir la causalité, il faut un A/B test, une expérience naturelle ou des méthodes d'inférence causale (DiD, IV, RDD).",
    niveau: "Classique DA/DS",
  },
  {
    q: "Comment calculer la taille d'échantillon nécessaire pour un A/B test ?",
    r: "3 paramètres : (1) l'effet minimal détectable (MDE), (2) la puissance statistique cible (80% ou 90%), (3) le seuil alpha (0,05). Plus le MDE est faible, plus l'échantillon doit être grand. Outils : Evan Miller's A/B Size Calculator, scipy.stats.power. Un test lancé sans calcul préalable risque d'être sous-dimensionné (underpowered) et de manquer des effets réels.",
    niveau: "Intermédiaire",
  },
  {
    q: "Quelle métrique choisir entre précision, rappel et F1-score ?",
    r: "Dépend du coût des erreurs. Précision = TP / (TP + FP) : à maximiser quand un faux positif est coûteux (ex : spam filter — ne pas filtrer un vrai email). Rappel = TP / (TP + FN) : à maximiser quand un faux négatif est coûteux (ex : détection de cancer — ne pas rater un cas réel). F1 = moyenne harmonique : bon compromis quand les deux comptent. Si les classes sont déséquilibrées, AUC-ROC ou F1 plutôt que l'accuracy.",
    niveau: "Classique DS/MLE",
  },
  {
    q: "Qu'est-ce qu'un outlier ? Quand le supprimer vs le conserver ?",
    r: "Un outlier est une valeur qui s'écarte fortement de la distribution (> 3 écarts-types ou au-delà de 1,5 × IQR). Vérifier d'abord si c'est une erreur (typo, doublon) ou une valeur extrême réelle. Supprimer un outlier valide biaise l'analyse. La bonne pratique : documenter le choix, présenter les résultats avec et sans si l'impact est significatif.",
    niveau: "Intermédiaire",
  },
  {
    q: "Qu'est-ce que le feature engineering ? Donnez 3 exemples concrets.",
    r: "Le feature engineering est la création de nouvelles variables à partir des données brutes pour améliorer la performance d'un modèle ML. Exemples : (1) Extraction temporelle — créer 'heure de la journée', 'jour de la semaine', 'est_weekend' à partir d'un timestamp. (2) Agrégations glissantes — moyenne des achats des 30 derniers jours par client. (3) Encodage d'interactions — créer 'ancienneté × niveau d'activité' pour un modèle de churn. Un bon feature engineering peut multiplier la performance d'un modèle simple par 2 — parfois plus efficace qu'un modèle plus complexe.",
    niveau: "Classique DS/MLE",
  },
  {
    q: "Comment traiter un dataset fortement déséquilibré (ex : 98% négatifs, 2% positifs) ?",
    r: "Plusieurs approches : (1) Ne pas utiliser l'accuracy comme métrique — préférer F1, AUC-ROC, précision/rappel. (2) Rééchantillonner : undersampling de la classe majoritaire (RandomUnderSampler) ou oversampling de la minoritaire (SMOTE). (3) Ajuster le class_weight dans le modèle (class_weight='balanced' dans sklearn). (4) Changer le seuil de classification (abaisser à 0.3 au lieu de 0.5 pour augmenter le rappel). (5) Algorithmes adaptés : Isolation Forest pour l'anomalie, modèles avec prior. Ordre recommandé : d'abord tester class_weight, puis SMOTE si insuffisant.",
    niveau: "Intermédiaire DS/MLE",
  },
  {
    q: "Quelle est la différence entre un modèle Random Forest et un Gradient Boosting ?",
    r: "Random Forest : ensemble d'arbres construits en parallèle, chacun sur un sous-ensemble aléatoire des données et des features. Le vote final est la moyenne (régression) ou le vote majoritaire (classification). Robuste, rapide à entraîner, peu sensible aux hyperparamètres. Gradient Boosting (XGBoost, LightGBM) : arbres construits séquentiellement, chaque arbre corrige les erreurs du précédent. Plus performant sur des données tabulaires hétérogènes, mais plus lent à entraîner et plus sensible au surapprentissage. En pratique : XGBoost/LightGBM dominent les compétitions Kaggle sur données tabulaires.",
    niveau: "Intermédiaire DS/MLE",
  },
  {
    q: "Qu'est-ce que le MLOps et pourquoi est-ce important ?",
    r: "MLOps est l'ensemble des pratiques pour déployer, surveiller et maintenir des modèles ML en production de manière fiable et reproductible. Analogie avec DevOps mais pour le ML. Composants clés : versioning des données et modèles (MLflow, DVC), CI/CD pour le réentraînement, monitoring de la performance en production (data drift, model drift), registre de modèles. Problème typique sans MLOps : un modèle entraîné en dev ne peut pas être reproduit en prod 6 mois plus tard car les dépendances ont changé. En pratique : Databricks ML, MLflow, AWS SageMaker, Vertex AI.",
    niveau: "Classique MLE",
  },
];

const STAR_QUESTIONS = [
  {
    question: "Parlez d'un projet data qui a échoué ou n'a pas abouti.",
    angle: "Ce qu'on évalue",
    detail: "La maturité et l'honnêteté. Tout le monde a des échecs — la question est de savoir si tu en tires des leçons. L'interlocuteur veut voir : identification claire des causes, actions correctives, et ce que tu ferais différemment.",
    exemple: "Exemple de structure : 'Nous avons construit un modèle de scoring crédit (S). Mon rôle était de valider la qualité des features (T). On a livré en production mais le modèle dérivait — on n'avait pas surveillé le data drift (A). Le modèle a dû être retiré 3 mois après (R). Depuis, j'intègre systématiquement un monitoring de distribution des inputs.'",
  },
  {
    question: "Comment avez-vous géré un désaccord technique avec un collègue ou un manager ?",
    angle: "Ce qu'on évalue",
    detail: "La capacité à défendre un point de vue avec des arguments, à céder quand c'est justifié, et à ne pas personnaliser les désaccords. On cherche quelqu'un qui n'abandonne pas au premier signe de résistance mais qui sait écouter.",
    exemple: "Exemple de structure : 'Mon manager voulait utiliser Excel pour un reporting mensuel (S). Je pensais que ça ne passerait pas à l'échelle (T). J'ai présenté une POC en Python en 2 jours avec les mêmes résultats mais automatisée (A). Le manager a validé la POC — on a gagné 2 jours de travail par mois (R).'",
  },
  {
    question: "Décrivez un projet où vous avez eu un impact mesurable.",
    angle: "Ce qu'on évalue",
    detail: "La capacité à quantifier la valeur de son travail. Beaucoup de profils data parlent de ce qu'ils ont fait (techniquement) mais pas de ce que ça a changé (business). Les meilleurs candidats ont toujours un chiffre : temps gagné, revenus générés, erreurs évitées.",
    exemple: "Structure gagnante : commencer par le résultat ('J'ai réduit le délai de reporting de 5 jours à 4 heures'), puis expliquer comment. Le recruteur doit pouvoir le citer en interne pour défendre ton profil.",
  },
  {
    question: "Vous avez dû convaincre un stakeholder réticent à utiliser les données pour prendre une décision.",
    angle: "Ce qu'on évalue",
    detail: "La capacité à vendre la data en interne — compétence critique souvent sous-estimée. On cherche quelqu'un qui comprend que les données seules ne suffisent pas : il faut adapter le message à l'interlocuteur, anticiper les objections et créer de la confiance progressive.",
    exemple: "Exemple de structure : 'Mon directeur commercial prenait ses décisions à l'instinct (S). Je devais faire adopter un outil de scoring pour cibler nos relances (T). J'ai commencé par lui montrer un cas où son intuition et le modèle concordaient — puis un où le modèle avait raison contre son intuition (A). Il a testé le modèle sur une campagne, les résultats ont convaincu (R).' Clé : montrer la progression, pas l'imposition.",
  },
  {
    question: "Décrivez une situation où vous avez dû livrer sous une contrainte de temps très forte.",
    angle: "Ce qu'on évalue",
    detail: "La gestion de la pression et la capacité à prioriser. On cherche quelqu'un qui ne panique pas, qui sait ce qu'il peut couper et ce qui est non-négociable, et qui communique de manière transparente sur les délais et les risques.",
    exemple: "Exemple : 'Nous avions 48h pour livrer un reporting réglementaire suite à une demande de l'ACP (S). J'étais seul sur le sujet (T). J'ai identifié les 3 indicateurs bloquants, automatisé la collecte, et produit une version simplifiée documentée avec ses limites (A). Le reporting a été validé, les limites ont été acceptées car documentées (R).' Montrer qu'on a communiqué les risques est essentiel.",
  },
];

const CAS_ANALYTIQUES = [
  {
    role: "Data Analyst",
    question: "Le taux de conversion a chuté de 15% la semaine dernière. Comment analysez-vous ?",
    methode: "Décomposer → Isoler → Hypothèses → Valider",
    etapes: [
      { label: "Décomposer", detail: "Segmenter par device, source de trafic, pays, type de produit, étape du tunnel." },
      { label: "Isoler", detail: "Y a-t-il un segment qui explique toute la baisse ? (ex : mobile = 70% de la chute mais 40% du trafic)." },
      { label: "Corrélations temporelles", detail: "Un déploiement, une campagne, un incident, un changement de prix ont-ils eu lieu le même jour ?" },
      { label: "3 hypothèses", detail: "Ex : (1) Bug bouton paiement iOS, (2) Prix augmentés sur une catégorie, (3) Ralentissement après déploiement." },
      { label: "Valider", detail: "Pour chaque hypothèse : requête SQL ou dashboard. Présenter avec % et volumes absolus." },
    ],
    pitfall: "Ne jamais conclure sans données. 'Je pense que c'est le mobile' n'est pas une analyse.",
  },
  {
    role: "Data Engineer",
    question: "Notre pipeline de données tombe toutes les nuits. Comment diagnostiquez-vous ?",
    methode: "Logs → Isoler le composant → Root cause → Fix durable",
    etapes: [
      { label: "Lire les logs", detail: "Error, timestamp, composant. Est-ce le même endroit chaque nuit (cronjob ?) ou aléatoire ?" },
      { label: "Isoler la couche", detail: "Source (API rate limit ?), transformation (mémoire, timeout ?), destination (credentials expirés, quota ?)." },
      { label: "Reproduire localement", detail: "Rejouer le pipeline sur les données du soir d'échec. Isoler avec des assertions à chaque étape." },
      { label: "Fix et monitoring", detail: "Alertes sur les métriques critiques (durée, volume de lignes), retry automatique, idempotence garantie." },
    ],
    pitfall: "Patcher sans monitoring = même incident dans 3 semaines. L'observabilité est partie intégrante du fix.",
  },
  {
    role: "Data Scientist",
    question: "Votre modèle de churn a 94% de précision mais le métier n'est pas satisfait. Pourquoi ?",
    methode: "Analyser les classes → Choisir la bonne métrique → Recalibrer",
    etapes: [
      { label: "Dataset déséquilibré ?", detail: "Si 94% des clients ne churnent pas, un modèle qui prédit 'jamais de churn' a 94% d'accuracy sans rien apprendre." },
      { label: "Quelle est la vraie métrique cible ?", detail: "Pour le churn, le rappel compte plus que la précision — mieux vaut contacter 10 faux positifs que rater un vrai churner." },
      { label: "Matrice de confusion", detail: "Afficher TP, FP, TN, FN. Le métier voit le coût réel de chaque type d'erreur." },
      { label: "Recalibrer le seuil", detail: "Abaisser le seuil de classification pour augmenter le rappel au prix de plus de faux positifs. Ou rééchantillonner (SMOTE)." },
    ],
    pitfall: "Défendre l'accuracy devant le métier sans contexte, c'est perdre la confiance. Toujours traduire les métriques en impact business.",
  },
  {
    role: "Analytics Engineer",
    question: "On vous demande de créer 10 dashboards en 2 semaines avec 2 analystes. Comment priorisez-vous ?",
    methode: "Qualifier → ICE score → Dépendances → Communiquer",
    etapes: [
      { label: "Qualifier chaque dashboard", detail: "Qui l'utilise ? Quelle décision permet-il de prendre ? Est-il bloquant ?" },
      { label: "ICE score", detail: "Impact × Confiance / Effort (1–10 chacun). Classer les 10 dashboards par score décroissant." },
      { label: "Dépendances de données", detail: "Certains dashboards partagent-ils les mêmes sources ? Regrouper pour mutualiser la préparation." },
      { label: "Communiquer le plan", detail: "Présenter la priorisation avec le raisonnement. Les 3 premiers à livrer, les 7 suivants avec date estimée." },
    ],
    pitfall: "Dire 'non' sans alternative nuit à la relation. Dire 'oui' à tout sans prioriser nuit à la qualité.",
  },
];

const QUESTIONS_A_POSER = [
  {
    theme: "Stack & outils",
    questions: [
      "Quelle est votre stack data principale — warehouse, orchestrateur, BI ?",
      "Utilisez-vous dbt ? Git pour le versionning des requêtes ?",
      "Comment les analyses ad hoc sont-elles gérées — tickets, Slack, rituels ?",
    ],
  },
  {
    theme: "Équipe & structure",
    questions: [
      "Comment est organisée l'équipe data (centralisée, embedded dans les BUs) ?",
      "Quel est le ratio entre profils data et parties prenantes métier ?",
      "Comment se passe la collaboration entre Data Engineers et Analysts ?",
    ],
  },
  {
    theme: "Poste & impact",
    questions: [
      "Quels seraient mes 3 premiers projets si je rejoins l'équipe ?",
      "Quel est le projet data dont l'équipe est la plus fière cette année ?",
      "Quelles sont les perspectives d'évolution après 2 ans sur ce poste ?",
    ],
  },
];

const ERREURS = [
  { titre: "Écrire du code sans expliquer", desc: "En entretien live, penser à voix haute. L'interlocuteur évalue le raisonnement autant que la syntaxe." },
  { titre: "Confondre question et hypothèse", desc: "'Je pense que le problème vient de X' n'est pas une analyse. Une analyse part d'une question, pas d'une conclusion." },
  { titre: "Ne pas connaître ses propres projets", desc: "Si un projet est sur ton CV, tu dois pouvoir expliquer chaque décision technique et chaque limitation en 2 minutes chrono." },
  { titre: "Ignorer les nulls et les anomalies", desc: "Tout dataset réel a des valeurs manquantes et des outliers. Montrer que tu les traites est un signal fort de maturité." },
  { titre: "Défendre l'accuracy devant le métier", desc: "94% d'accuracy sur un dataset déséquilibré est souvent inutile. Toujours traduire les métriques ML en impact business." },
  { titre: "Ne poser aucune question", desc: "Un candidat qui ne pose pas de questions paraît désintéressé. Prépare 3 questions pertinentes — pas sur le salaire en premier." },
  { titre: "Surestimer son niveau SQL", desc: "Mieux vaut dire 'je n'ai jamais utilisé les CTEs mais voici comment j'approcherais le problème' que de coder quelque chose de faux avec assurance." },
  { titre: "Oublier de quantifier son impact", desc: "Les meilleurs candidats parlent en résultats : 'j'ai réduit le délai de 5 jours à 4 heures'. Pas : 'j'ai automatisé un processus'." },
];

const PREPARATION = {
  timeline: [
    {
      label: "Le weekend avant",
      color: "#7C3AED",
      bg: "#F5F3FF",
      border: "#DDD6FE",
      titre: "2–3h de révision ciblée",
      actions: [
        "Identifier les 2–3 points faibles sur le rôle visé — pas tout réviser",
        "Refaire 5–6 requêtes SQL des types demandés (window functions, jointures)",
        "Écrire son pitch en 90 secondes et le relire à voix haute une fois",
        "Préparer 2 exemples STAR sur du concret : un succès, une difficulté surmontée",
      ],
    },
    {
      label: "2–3 jours avant",
      color: "#0E7490",
      bg: "#ECFEFF",
      border: "#A5F3FC",
      titre: "30 min/soir sur les soirées",
      actions: [
        "Lire le site de l'entreprise, ses actualités récentes, comprendre le business",
        "Identifier la stack data (offres d'emploi publiées, blog tech, LinkedIn des équipes)",
        "Relire chaque projet marquant du CV — chaque choix technique doit être explicable",
        "Préparer 3 questions à poser : une sur la stack, une sur l'équipe, une sur le poste",
      ],
    },
    {
      label: "La veille",
      color: "#15803D",
      bg: "#F0FDF4",
      border: "#86EFAC",
      titre: "20 min max, puis repos",
      actions: [
        "Relire la fiche de poste et ses 2 exemples STAR",
        "Vérifier l'heure, le lieu ou le lien visio — rien d'autre",
        "Ne pas bachoter — la fatigue coûte plus cher qu'une révision de dernière minute",
      ],
    },
  ],
  ressources: [
    { nom: "StrataScratch", desc: "SQL sur de vrais cas d'entreprise (Meta, Netflix, Google). Le meilleur pour les DA/AE.", url: "https://www.stratascratch.com", tag: "SQL", color: "#7C3AED" },
    { nom: "LeetCode", desc: "SQL + Python. Section Database pour les classiques d'entretien.", url: "https://leetcode.com/studyplan/top-sql-50/", tag: "SQL / Python", color: "#0E7490" },
    { nom: "dbt Learn", desc: "Parcours gratuit officiel dbt Labs. Indispensable pour les AE.", url: "https://learn.getdbt.com", tag: "Analytics Eng.", color: "#FF694A" },
    { nom: "Fast.ai", desc: "Cours ML pratique gratuit, orienté code. Idéal pour DS/MLE.", url: "https://www.fast.ai", tag: "ML", color: "#B45309" },
    { nom: "Kaggle Learn", desc: "Modules courts : Python, pandas, SQL, ML, feature engineering.", url: "https://www.kaggle.com/learn", tag: "Tous rôles", color: "#20BEFF" },
    { nom: "Mode SQL Tutorial", desc: "Guide SQL progressif avec éditeur en ligne. Parfait pour les débutants.", url: "https://mode.com/sql-tutorial/", tag: "SQL débutant", color: "#64748B" },
  ],
  portfolio: [
    "2–3 projets GitHub avec README clair : contexte, données, approche, résultats",
    "Au moins un projet end-to-end : ingest → transform → visualisation ou modèle en production",
    "Données publiques : Kaggle Datasets, data.gouv.fr, NYC Open Data",
    "Pour les DE : un pipeline Airflow ou dbt documenté vaut mieux que 10 notebooks",
    "Pour les DS : un notebook avec markdown structuré (problème → hypothèse → résultat) montre la rigueur",
    "Quantifier l'impact dans le README même sur des projets perso : 'réduit le temps de X à Y'",
  ],
};

const ARCHI_QUESTIONS = [
  {
    q: "Comment concevoir un pipeline pour traiter 10 milliards d'événements par jour ?",
    roles: ["DE", "MLE"],
    r: "Étape 1 : estimer le throughput. 10B / 86 400s ≈ 116 000 events/s au pic. Étape 2 : ingestion via Kafka ou Kinesis (partitionné par type d'événement ou user_id). Étape 3 : traitement avec Spark Streaming ou Flink pour les agrégations temps réel. Étape 4 : stockage en Parquet/Delta Lake partitionné par date. Étape 5 : orchestration avec Airflow ou Dagster pour les batchs T+1h. Points à mentionner : idempotence, monitoring des lags Kafka, alertes sur les dead-letter queues.",
    note: "Ne pas partir sur la solution technique sans poser les contraintes : latence acceptable ? Tolérance aux pertes ? Budget cloud ?",
  },
  {
    q: "Batch vs Streaming : comment choisir ?",
    roles: ["DE", "MLE"],
    r: "Batch : traitement différé (T+1h, T+24h), volumes importants, transformations complexes, coût faible. Cas : reporting BI quotidien, ML batch scoring, agrégations DWH. Streaming : latence < 1 min, détection en temps réel. Cas : fraude, alertes, personalisation temps réel. Micro-batch (Spark Structured Streaming, toutes les 30s) : bon compromis pour 80% des use cases. Règle pratique : si le métier ne prend pas de décision en moins de 5 min sur ces données, le batch suffit.",
    note: "Le streaming coûte 3–5x plus cher à maintenir. Justifier le besoin temps réel avant de s'y engager.",
  },
  {
    q: "Qu'est-ce que l'idempotence dans un pipeline ? Comment l'implémenter ?",
    roles: ["DE"],
    r: "Un pipeline idempotent peut être rejoué plusieurs fois avec les mêmes données sans effets de bord (pas de doublons, pas d'état incohérent). Critique pour les reprises sur erreur. Implémentation : MERGE INTO (upsert) plutôt qu'INSERT simple, clés uniques fonctionnelles en amont, partitions de remplacement (INSERT OVERWRITE PARTITION) plutôt qu'APPEND. En dbt : la stratégie incremental avec unique_key garantit l'idempotence.",
    note: "Une question très fréquente en DE sénior. Répondre avec un exemple concret (ex : pipeline de facturation) est un très bon signal.",
  },
  {
    q: "Qu'est-ce que le théorème CAP et quelles sont ses implications pour le choix d'un système de données ?",
    roles: ["DE", "MLE"],
    r: "Le théorème CAP dit qu'un système distribué ne peut garantir simultanément que 2 de ces 3 propriétés : Consistance (toutes les lectures voient la dernière écriture), Disponibilité (toutes les requêtes reçoivent une réponse), Tolérance aux partitions (le système fonctionne malgré des coupures réseau). CP : HBase, MongoDB (consistance prioritaire — banque, inventaire). AP : Cassandra, DynamoDB (disponibilité prioritaire — réseaux sociaux, catalogue). Implication : choisir selon la tolérance aux données temporairement inconsistantes.",
    note: "Question surtout posée en DE/MLE sénior ou architect. Ne pas apprendre par cœur — comprendre l'implication business (banque vs réseau social) suffit.",
  },
  {
    q: "ETL vs ELT : quelle approche choisir et pourquoi ?",
    roles: ["DE", "AE"],
    r: "ETL (Extract-Transform-Load) : la transformation se fait avant le chargement, souvent hors du warehouse. Adapté quand les données sensibles ne doivent pas être stockées brutes ou quand le volume est faible. ELT (Extract-Load-Transform) : on charge d'abord les données brutes dans le warehouse, puis on transforme avec SQL. Devenu la norme avec les warehouses modernes (Snowflake, BigQuery, Redshift) qui ont une puissance de calcul massive. Avantages ELT : données brutes toujours disponibles pour retraitement, transformations versionnées en SQL/dbt, pas de couche intermédiaire à maintenir.",
    note: "La réponse attendue en 2026 est ELT pour les architectures cloud modernes. Mentionner dbt comme outil de transformation en ELT est un plus.",
  },
  {
    q: "Qu'est-ce que le lakehouse et en quoi diffère-t-il du data warehouse classique ?",
    roles: ["DE", "MLE"],
    r: "Le data warehouse stocke des données structurées et optimisées pour le SQL analytique (Snowflake, BigQuery). Le data lake stocke tout (brut, semi-structuré, non structuré) en format ouvert mais sans garanties ACID ni performance SQL. Le lakehouse combine les deux : stockage en format ouvert (Parquet/Delta Lake) sur object storage, avec des couches de gouvernance, des garanties ACID et des performances SQL proches du warehouse. Exemples : Databricks Lakehouse, Delta Lake, Apache Iceberg. Avantage clé : une seule copie des données pour les usages BI et ML.",
    note: "Question de plus en plus fréquente depuis 2023. Mentionner Delta Lake ou Iceberg comme format de table ouvert montre une connaissance à jour.",
  },
  {
    q: "Comment garantir la fiabilité d'un pipeline en production ?",
    roles: ["DE"],
    r: "4 axes : (1) Observabilité — logs structurés, métriques (durée, volume de lignes, taux d'erreurs), alertes sur les anomalies. (2) Idempotence — le pipeline peut être rejoué sans créer de doublons. (3) Gestion des erreurs — dead-letter queues, retry avec backoff exponentiel, alertes humaines pour les pannes durables. (4) Tests — tests unitaires sur les transformations, tests de données (volume, nulls, unicité) à chaque run. En dbt : tests natifs (not_null, unique, accepted_values) + dbt-expectations pour aller plus loin.",
    note: "La fiabilité se construit dès la conception, pas en patch après un incident. Un candidat qui parle de tests et d'alertes dès la conception montre de la maturité.",
  },
];

const MODELING_QUESTIONS = [
  {
    q: "Star schema vs 3NF : quand utiliser quoi ?",
    roles: ["AE", "DE"],
    r: "3NF (normalisé) : élimine la redondance, optimisé pour les écritures et les transactions (OLTP). Utilisé dans les bases opérationnelles. Star schema (dénormalisé) : une table de faits centrale entourée de dimensions. Optimisé pour la lecture et l'agrégation (OLAP). Les jointures sont simplifiées (1 niveau), les requêtes BI sont plus rapides. Snowflake schema : extension du star schema où les dimensions sont elles-mêmes normalisées. En analytics, le star schema est la norme.",
    note: "Répondre avec un exemple : 'Pour un reporting commercial, je préfère le star schema — les analystes écrivent moins de jointures et les requêtes sont 2–3x plus rapides sur Snowflake.'",
  },
  {
    q: "Qu'est-ce qu'un SCD Type 2 et quand l'utiliser ?",
    roles: ["AE", "DE"],
    r: "SCD (Slowly Changing Dimension) Type 2 : au lieu de mettre à jour une ligne, on ajoute une nouvelle ligne avec les nouvelles valeurs et des colonnes d'historisation (valid_from, valid_to, is_current). Permet de retrouver l'état d'une dimension à n'importe quelle date. Use cases : historique d'adresse client, changement de manager, changement de catégorie produit. En dbt, la stratégie snapshot implémente nativement le SCD Type 2. SCD Type 1 : on écrase (pas d'historique). SCD Type 3 : on garde uniquement la valeur précédente (colonne old_xxx).",
    note: "Souvent posé comme : 'Si un client change de région, comment mettez-vous à jour votre DWH sans perdre les ventes historiques ?' — répondre SCD2.",
  },
  {
    q: "Comment définir le 'grain' d'une table de faits ?",
    roles: ["AE", "DE", "DA"],
    r: "Le grain définit ce que représente exactement une ligne dans la table de faits. Exemples : une ligne = une transaction (grain transaction), une ligne = un jour × un produit × un magasin (grain journalier). Définir le grain est la première décision en modélisation — tout le reste en découle. Un grain mal défini crée des doubles comptages dans les agrégations. Règle : le grain doit être le plus fin possible (transaction > jour > mois), quitte à pré-agréger pour les dashboards.",
    note: "Poser la question du grain en entretien AE/DE est un signal fort de maturité. Un candidat qui ne mentionne pas le grain sur un cas de modélisation rate un point essentiel.",
  },
  {
    q: "Qu'est-ce que le concept de 'data contract' et pourquoi c'est important ?",
    roles: ["AE", "DE"],
    r: "Un data contract est un accord formel entre le producteur de données et le consommateur, qui définit le schéma, les SLAs (fraîcheur, disponibilité), les règles de qualité et les responsabilités. Implémenté en YAML (ex : format sdf ou dbt contracts). Avantages : évite les breaking changes silencieux, clarifie les responsabilités entre équipes, facilite les tests de qualité automatisés. Outil courant : Great Expectations, dbt tests, Soda. Exemple : si le producteur change un type de colonne, le contract échoue en CI avant d'atteindre la prod.",
    note: "Sujet très actuel (2024–2026). Un candidat qui mentionne les data contracts spontanément dans un contexte DE/AE se distingue nettement.",
  },
  {
    q: "Qu'est-ce qu'un incremental load et quand le préférer à un full refresh ?",
    roles: ["AE", "DE"],
    r: "Full refresh : on recharge toute la table à chaque run. Simple mais coûteux en temps et en ressources sur de grands volumes. Incremental load : on ne traite que les données nouvelles ou modifiées depuis le dernier run (via un champ updated_at ou un watermark). Quand préférer l'incremental : tables > 10M lignes, données immuables en append-only (logs, événements), SLA de fraîcheur < 1h. Risque : si une donnée historique est modifiée sans changer updated_at, elle sera manquée. En dbt : stratégie incremental avec unique_key pour les upserts.",
    note: "Toujours mentionner le risque de lignes modifiées sans mise à jour du watermark. C'est le piège classique de l'incremental.",
  },
  {
    q: "Qu'est-ce que le Data Mesh et dans quel contexte est-ce pertinent ?",
    roles: ["DE", "AE", "CDO"],
    r: "Le Data Mesh est un paradigme organisationnel (Zhamak Dehghani, 2020) qui décentralise la propriété des données vers les domaines métier plutôt que de tout centraliser dans une équipe data centrale. 4 principes : données comme produit (chaque domaine produit ses données avec qualité et SLAs), propriété par domaine, infrastructure self-service, gouvernance fédérée. Pertinent dans les grandes organisations (> 500 personnes data) où les équipes centralisées deviennent un goulot d'étranglement. Pas adapté aux équipes data < 20 personnes — le coût de coordination dépasse les bénéfices.",
    note: "Souvent survendu. La bonne réponse est : 'pertinent à grande échelle, pas une solution universelle'. Montrer qu'on connaît les limites est apprécié.",
  },
  {
    q: "Comment évaluer la qualité d'un modèle de données avant de le livrer en production ?",
    roles: ["AE", "DE", "DA"],
    r: "3 niveaux de vérification : (1) Tests de schéma — les colonnes attendues existent, les types sont corrects, les clés primaires sont uniques et non nulles. (2) Tests de données — les valeurs sont dans les plages attendues (ex : revenue > 0), les distributions ne dérivent pas (volume de lignes stable ±20%), les jointures ne créent pas de fanout. (3) Tests métier — les totaux correspondent aux sources de référence, les agrégations matchent les rapports existants. En dbt : great_expectations ou dbt-expectations permettent d'automatiser tout ça en CI.",
    note: "Un AE ou DE qui ne parle pas de tests automatisés en entretien est un signal d'alerte en 2026. Les tests de données en CI sont devenus standard.",
  },
];

const GOUVERNANCE_QUESTIONS = [
  {
    q: "Quelles sont les dimensions de la qualité des données ? Comment les mesurer ?",
    roles: ["DA", "AE", "DE", "CDO"],
    r: "Les 6 dimensions classiques : (1) Complétude — % de valeurs non nulles sur les champs obligatoires. (2) Exactitude — les valeurs correspondent à la réalité (ex : adresse valide). (3) Cohérence — même donnée représentée pareil dans différents systèmes. (4) Fraîcheur — délai entre la réalité et le reflet dans les données. (5) Unicité — pas de doublons sur les clés métier. (6) Validité — respect des formats et plages attendus. Comment mesurer : tests automatisés dans le pipeline (dbt tests, Great Expectations, Soda), dashboards de qualité, alertes sur les dérives.",
    note: "Question classique pour les rôles CDO, Data Governance et seniors. Avoir 3 dimensions avec leurs métriques en tête suffit — pas besoin de tout réciter.",
  },
  {
    q: "Qu'est-ce qu'un data catalog ? À quoi ça sert concrètement ?",
    roles: ["DA", "AE", "DE", "CDO"],
    r: "Un data catalog est un inventaire des données disponibles dans l'organisation, avec leur définition, leur provenance (lineage), leur propriétaire et leur qualité. Utilité concrète : un analyste peut chercher 'table clients' et savoir exactement ce que contient chaque colonne, qui la maintient et d'où elle vient — sans demander à un DE. Exemples d'outils : Atlan, DataHub (open source), Collibra, Alation. En pratique, le data catalog est souvent sous-alimenté car il demande de la discipline de documentation — le vrai défi est organisationnel, pas technique.",
    note: "Mentionner le problème d'adoption ('le catalog vide de contenu') montre de la maturité. C'est le problème n°1 des équipes qui déploient un catalog.",
  },
  {
    q: "Comment gérez-vous les données personnelles (RGPD) dans un pipeline de données ?",
    roles: ["DE", "DA", "AE"],
    r: "4 pratiques clés : (1) Minimisation — ne collecter que les données nécessaires à l'usage. (2) Pseudonymisation / anonymisation — remplacer les PII (nom, email, IBAN) par des identifiants techniques en amont des couches analytiques. (3) Gestion des droits d'accès — accès aux données brutes limité, données agrégées accessibles plus largement. (4) Gestion des suppressions — implémenter le 'droit à l'oubli' : identifier toutes les tables contenant l'id d'un utilisateur et pouvoir les purger à la demande. En pratique, les pipelines analytiques ne devraient jamais exposer de PII non nécessaires.",
    note: "Ne pas répondre uniquement 'on anonymise' — les recruteurs attendent aussi la gestion des droits d'accès et du droit à l'oubli.",
  },
  {
    q: "Qu'est-ce que l'observabilité des données (data observability) ?",
    roles: ["DE", "AE"],
    r: "L'observabilité des données est la capacité à comprendre l'état de santé des données dans un pipeline — volume, fraîcheur, distribution, schéma, lineage. Analogie avec le monitoring applicatif (Datadog) mais pour les données. Composantes : détection automatique des anomalies (volume de lignes divisé par 2 ? distribution d'une colonne qui dérive ?), alertes en temps réel, visualisation du lineage (quelle transformation a produit cette table ?). Outils : Monte Carlo, Bigeye, dbt tests + Grafana, Metaplane. Différence avec les tests unitaires : les tests vérifient le code, l'observabilité surveille les données en production.",
    note: "Sujet émergent mais très demandé en 2025–2026. Un candidat DE qui mentionne la data observability spontanément se distingue nettement.",
  },
];

const OUTILS_QUESTIONS = [
  {
    q: "Pourquoi utiliser dbt plutôt que des procédures stockées SQL ?",
    roles: ["AE", "DE", "DA"],
    r: "dbt apporte 4 avantages que les procédures stockées n'ont pas : (1) Versionning Git — les transformations sont du code, donc historisées, reviewées en PR, déployées via CI/CD. (2) Tests automatisés — not_null, unique, accepted_values intégrés. (3) Documentation auto-générée — chaque modèle documenté en Markdown, visible dans le catalog dbt Docs. (4) Lineage visuel — graphe de dépendances entre les modèles. Les procédures stockées sont du SQL dans la base, difficiles à tester, à versionner et à faire évoluer en équipe. Limite de dbt : ne fait que de l'ELT (transformation SQL), pas d'ingestion.",
    note: "Question très courante pour les rôles AE. La réponse attendue tourne autour du versionning, des tests et de la documentation — pas juste 'c'est plus moderne'.",
  },
  {
    q: "Quand utiliser Spark plutôt que pandas ?",
    roles: ["DE", "DS", "MLE"],
    r: "pandas : optimal pour des datasets < 10–20 Go, en mémoire sur une seule machine. Très lisible, riche en fonctionnalités, parfait pour l'exploration et les pipelines légers. Spark : nécessaire quand les données ne tiennent pas en RAM, quand on a besoin de distribuer le traitement sur un cluster, ou quand on travaille avec des formats distribués (Parquet sur S3/ADLS). Règle pratique : commencer avec pandas. Passer à Spark (ou Polars comme intermédiaire) quand pandas OOM ou devient trop lent. Polars est souvent un meilleur choix intermédiaire — 5–10x plus rapide que pandas sans la complexité de Spark.",
    note: "Mentionner Polars comme alternative à mi-chemin est un signal de connaissance à jour (2024–2026). Beaucoup de candidats ne connaissent que pandas/Spark.",
  },
  {
    q: "Snowflake vs BigQuery vs Databricks : comment choisir ?",
    roles: ["DE", "AE"],
    r: "Snowflake : excellent SQL analytique, séparation compute/storage, multi-cloud, très utilisé en Europe dans les entreprises mid-market. Idéal pour les analytics purs et l'ELT. BigQuery : natif GCP, serverless (pas de cluster à gérer), facturation à la requête, très performant sur les grands volumes. Idéal si déjà dans l'écosystème Google. Databricks : force sur l'IA/ML et le lakehouse, meilleur si les cas d'usage mélangent analytics et ML, fort en streaming avec Spark. Plus de complexité opérationnelle. En pratique : le choix dépend souvent du cloud provider déjà en place dans l'entreprise, pas des fonctionnalités seules.",
    note: "Ne pas donner un vainqueur absolu — chaque outil a ses forces. La réponse montre la capacité à contextualiser selon les contraintes.",
  },
  {
    q: "Qu'est-ce qu'un orchestrateur (Airflow, Prefect, Dagster) ? Quand en a-t-on besoin ?",
    roles: ["DE", "MLE"],
    r: "Un orchestrateur gère le séquencement, le scheduling et le monitoring des pipelines de données. Il répond à : 'Dans quel ordre, à quelle heure, et que faire si une étape échoue ?' Airflow : le plus répandu, basé sur des DAGs Python, large communauté mais infrastructure à maintenir. Prefect / Dagster : plus modernes, meilleure DX, gestion des erreurs plus fine. On en a besoin dès qu'on a plusieurs pipelines interdépendants, des reprises sur erreur à gérer, ou des SLAs à respecter. Avant ça, un simple cron + logs peut suffire. Erreur courante : sur-ingéniering avec Airflow pour 2 pipelines.",
    note: "Mentionner la mise en garde contre le sur-ingéniering est apprécié. Un orchestrateur ajoute de la complexité — justifier le besoin avant de le déployer.",
  },
];
export default function EntretiensPage() {
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
          <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            Guide entretien data 2026
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Réussir son entretien<br />
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>data — tous rôles</span>
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, maxWidth: 620, marginBottom: 32 }}>
            SQL, Python, ML, cas pratiques et STAR — ce que les recruteurs attendent vraiment selon le rôle visé.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px" }}>

        {/* Rôles couverts */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Rôles couverts</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Ce guide est fait pour toi si tu vises…
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Les compétences testées diffèrent selon le rôle. Chaque section indique les rôles concernés.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
            {ROLES.map(r => (
              <div key={r.id} style={{ background: r.bg, border: `1.5px solid ${r.border}`, borderRadius: 12, padding: "16px 20px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 800, color: r.color, marginBottom: 10 }}>{r.label}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {r.techs.map(t => (
                    <span key={t} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 11, background: "#fff", border: `1px solid ${r.border}`, color: r.color, fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment se préparer */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Préparation</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Comment se préparer en étant en poste
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Un plan réaliste pour quelqu&apos;un qui travaille : quelques soirées et un weekend suffisent si la préparation est ciblée.
          </p>

          {/* Timeline */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
            {PREPARATION.timeline.map(t => (
              <div key={t.label} style={{ background: t.bg, border: `1.5px solid ${t.border}`, borderRadius: 14, padding: "22px 22px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: t.color, color: "#fff" }}>{t.label}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 800, color: t.color }}>{t.titre}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {t.actions.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: t.color, fontWeight: 700, flexShrink: 0, fontSize: 12 }}>→</span>
                      <span style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.55 }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Ressources */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>Ressources de pratique</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
              {PREPARATION.ressources.map(r => (
                <a key={r.nom} href={r.url} target="_blank" rel="noopener noreferrer" className="hover-border-indigo" style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#fff", textDecoration: "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: r.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", fontFamily: "var(--font-mono)" }}>{r.nom.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{r.nom}</p>
                      <span style={{ padding: "1px 7px", borderRadius: 100, fontSize: 10, background: "#EDE9FE", color: "#5B21B6", fontWeight: 600 }}>{r.tag}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{r.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div style={{ background: "#0B0F23", borderRadius: 14, padding: "24px 26px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#A78BFA", marginBottom: 14 }}>Portfolio GitHub — ce qui fait la différence</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PREPARATION.portfolio.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 10 }}>
                  <span style={{ color: "#A78BFA", fontWeight: 700, flexShrink: 0, fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sections accordéons */}
        <div style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Questions & Thèmes</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 8 }}>
            Banque de questions par thème
          </h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
            Clique sur un thème pour dérouler les questions et les réponses attendues.
          </p>

          {/* SQL */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Questions SQL incontournables</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>8 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>DA</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>AE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>DE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Window functions, CTEs, performances, jointures</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Les plus fréquentes dans les entretiens data en France — avec solutions et pièges.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {SQL_QUESTIONS.map((q, i) => (
                  <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.5, marginBottom: 8 }}>{q.question}</p>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {q.roles.map(r => (
                            <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "#EDE9FE", color: "#5B21B6", fontWeight: 600 }}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <span style={{
                        padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0,
                        background: q.difficulte.startsWith("Avancé") ? "#EDE9FE" : q.difficulte === "Intermédiaire" ? "#FEF3C7" : "#F0FDF4",
                        color: q.difficulte.startsWith("Avancé") ? "#5B21B6" : q.difficulte === "Intermédiaire" ? "#92400E" : "#15803D",
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
          </details>

          {/* Python */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Questions Python</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>3 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>DE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>DS</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>MLE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>pandas, ETL, data leakage — code + explication</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Principalement pour les rôles Data Engineer, Data Scientist et ML Engineer.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {PYTHON_QUESTIONS.map((q, i) => (
                  <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: "#0F172A", lineHeight: 1.5, marginBottom: 8 }}>{q.question}</p>
                        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                          {q.roles.map(r => (
                            <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "#ECFEFF", color: "#0E7490", fontWeight: 600 }}>{r}</span>
                          ))}
                        </div>
                      </div>
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
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#A78BFA", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Python</span>
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
          </details>

          {/* Architecture */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Architecture & Système</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>7 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>DE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>MLE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Pipelines, batch vs streaming, idempotence, CAP theorem, lakehouse</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Ces questions évaluent la capacité à concevoir des systèmes robustes, pas juste à les coder.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {ARCHI_QUESTIONS.map((q, i) => (
                  <div key={i} className="card" style={{ padding: "22px 26px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.45, flex: 1 }}>{q.q}</p>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        {q.roles.map(r => (
                          <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "#ECFEFF", color: "#0E7490", fontWeight: 600 }}>{r}</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.75, marginBottom: 12 }}>{q.r}</p>
                    <div style={{ padding: "10px 14px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", display: "flex", gap: 8 }}>
                      <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>!</span>
                      <p style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>{q.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Data Modeling */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Data Modeling</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>7 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>AE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>DE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Star schema, SCD Type 2, grain, Data Mesh, data contracts</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                La modélisation est souvent le point faible des profils juniors. Ces questions distinguent les AE et DE solides.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {MODELING_QUESTIONS.map((q, i) => (
                  <div key={i} className="card" style={{ padding: "22px 26px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.45, flex: 1 }}>{q.q}</p>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        {q.roles.map(r => (
                          <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "#F0FDF4", color: "#15803D", fontWeight: 600 }}>{r}</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.75, marginBottom: 12 }}>{q.r}</p>
                    <div style={{ padding: "10px 14px", background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", display: "flex", gap: 8 }}>
                      <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0, fontSize: 13 }}>!</span>
                      <p style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>{q.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* ML & Stats */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>ML & Statistiques</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>10 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#FFF1F2", color: "#BE123C" }}>DS</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#FFF1F2", color: "#BE123C" }}>MLE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Biais/variance, A/B test, feature engineering, MLOps, imbalanced datasets</p>
              </div>
            </summary>
            <div className="accordion-body">
              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 20 }}>
                {ML_QUESTIONS.map((sq, i) => (
                  <div key={i} className="card" style={{ padding: "22px 26px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0F172A", lineHeight: 1.45, flex: 1 }}>{sq.q}</p>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0, background: "#FEF3C7", color: "#92400E" }}>
                        {sq.niveau}
                      </span>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.75 }}>{sq.r}</p>
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* STAR */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Questions comportementales STAR</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>5 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F5F3FF", color: "#7C3AED" }}>Tous rôles</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Échec projet, désaccord technique, impact mesurable, contraintes</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                La méthode STAR (Situation, Tâche, Action, Résultat) est attendue par tous les recruteurs. Ces questions distinguent les bons candidats.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {STAR_QUESTIONS.map((sq, i) => (
                  <div key={i} className="card" style={{ padding: "26px 28px" }}>
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "#F5F3FF", border: "1px solid #DDD6FE", marginBottom: 20 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", lineHeight: 1.55 }}>&ldquo;{sq.question}&rdquo;</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#7C3AED" }}>{sq.angle} :</span>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, marginBottom: 16 }}>{sq.detail}</p>
                    <div style={{ padding: "14px 16px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #86EFAC" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#15803D", marginBottom: 8 }}>Exemple de structure</p>
                      <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.7 }}>{sq.exemple}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Gouvernance */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Gouvernance & Qualité des données</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>4 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>AE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F0FDF4", color: "#15803D" }}>CDO</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Dimensions qualité, data catalog, RGPD, data observability</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Incontournables pour les rôles seniors, AE et CDO. Ces questions testent ta vision au-delà du code.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {GOUVERNANCE_QUESTIONS.map((item, i) => (
                  <div key={i} className="card" style={{ padding: "24px 26px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 14 }}>
                      {item.roles.map(r => (
                        <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: "#F0FDF4", color: "#15803D", border: "1px solid #86EFAC" }}>{r}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", lineHeight: 1.55, marginBottom: 16 }}>{item.q}</p>
                    <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.75, marginBottom: item.note ? 14 : 0 }}>{item.r}</p>
                    {item.note && (
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", gap: 8 }}>
                        <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0 }}>!</span>
                        <p style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.55 }}>{item.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Outils */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Outils & Choix techniques</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>4 questions</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>AE</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#ECFEFF", color: "#0E7490" }}>DE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>dbt, Spark vs pandas, Snowflake vs BigQuery, orchestrateurs</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Questions de comparaison technologique — on attend du contexte, pas un vainqueur absolu.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {OUTILS_QUESTIONS.map((item, i) => (
                  <div key={i} className="card" style={{ padding: "24px 26px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 14 }}>
                      {item.roles.map(r => (
                        <span key={r} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: "#ECFEFF", color: "#0E7490", border: "1px solid #A5F3FC" }}>{r}</span>
                      ))}
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#0F172A", lineHeight: 1.55, marginBottom: 16 }}>{item.q}</p>
                    <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.75, marginBottom: item.note ? 14 : 0 }}>{item.r}</p>
                    {item.note && (
                      <div style={{ padding: "10px 14px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FDE68A", display: "flex", gap: 8 }}>
                        <span style={{ color: "#B45309", fontWeight: 700, flexShrink: 0 }}>!</span>
                        <p style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.55 }}>{item.note}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </details>

          {/* Cas pratiques */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Cas pratiques par rôle</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>4 cas</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F5F3FF", color: "#7C3AED" }}>DA · DE · DS · AE</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Structurer un raisonnement — ce qu&apos;on évalue vraiment</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Ces questions n&apos;ont pas de bonne réponse unique. Ce qu&apos;on évalue : la structure du raisonnement et la communication.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {CAS_ANALYTIQUES.map((cas, i) => (
                  <div key={i} className="card" style={{ padding: "26px 28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: "#EDE9FE", color: "#5B21B6" }}>{cas.role}</span>
                    </div>
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
          </details>

          {/* Questions à poser */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Questions à poser à ton interlocuteur</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#F5F3FF", color: "#7C3AED" }}>Tous rôles</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Stack, équipe, poste — signale ta maturité professionnelle</p>
              </div>
            </summary>
            <div className="accordion-body">
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20, paddingTop: 20 }}>
                Un entretien est un échange. Tes questions signalent ta maturité professionnelle.
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
          </details>

          {/* Erreurs */}
          <details className="section-accordion">
            <summary>
              <span className="accordion-chevron">▶</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "#0F172A" }}>Les 8 erreurs qui coûtent l&apos;offre</span>
                  <span style={{ padding: "2px 9px", borderRadius: 100, fontSize: 10, fontWeight: 600, background: "#FFF1F2", color: "#BE123C", border: "1px solid #FECDD3" }}>À éviter</span>
                </div>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Erreurs classiques que les recruteurs remarquent immédiatement</p>
              </div>
            </summary>
            <div className="accordion-body" style={{ paddingTop: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
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
          </details>

        </div>

        {/* CTA */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#0B0F29", borderRadius: 16, padding: "28px 24px" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#A78BFA", marginBottom: 6 }}>Fiche métier</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 18 }}>
              Salaires, compétences et trajectoires 2026 par rôle
            </p>
            <Link href="/metiers" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
              Voir les fiches métiers →
            </Link>
          </div>
          <div style={{ background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)", borderRadius: 16, padding: "28px 24px", border: "1px solid #DDD6FE" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", marginBottom: 6 }}>Préparer les certifications</p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 18 }}>
              166 certifs AWS, Azure, GCP, Databricks — dans le bon ordre
            </p>
            <Link href="/certifications/roadmap" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
              Voir la roadmap certifications →
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
