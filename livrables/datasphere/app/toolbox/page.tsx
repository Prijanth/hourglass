"use client";
import { useState } from "react";

/* ─── DONNÉES ─────────────────────────────────────────── */

const SNIPPETS = [
  /* SQL */
  {
    id: "sql-deduplicate", cat: "SQL", lang: "sql", emoji: "🗄️",
    titre: "Déduplication avec ROW_NUMBER()",
    desc: "Garder la ligne la plus récente par clé métier.",
    code: `WITH ranked AS (
  SELECT *,
    ROW_NUMBER() OVER (
      PARTITION BY client_id
      ORDER BY updated_at DESC
    ) AS rn
  FROM clients
)
SELECT * EXCEPT(rn)
FROM ranked
WHERE rn = 1;`,
  },
  {
    id: "sql-window", cat: "SQL", lang: "sql", emoji: "🗄️",
    titre: "Window functions — running total & rank",
    desc: "Cumul courant et classement par partition.",
    code: `SELECT
  date,
  produit,
  ventes,
  SUM(ventes) OVER (
    PARTITION BY produit
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumul_ventes,
  RANK() OVER (PARTITION BY date ORDER BY ventes DESC) AS rang_jour
FROM ventes_quotidiennes;`,
  },
  {
    id: "sql-lag", cat: "SQL", lang: "sql", emoji: "🗄️",
    titre: "LAG / LEAD — différence jour-à-jour",
    desc: "Comparer une valeur avec la période précédente.",
    code: `SELECT
  date,
  ca,
  LAG(ca, 1) OVER (ORDER BY date)           AS ca_veille,
  ca - LAG(ca, 1) OVER (ORDER BY date)       AS variation_absolue,
  ROUND(
    100.0 * (ca - LAG(ca,1) OVER (ORDER BY date))
    / NULLIF(LAG(ca,1) OVER (ORDER BY date), 0), 1
  )                                           AS variation_pct
FROM chiffre_affaires_mensuel
ORDER BY date;`,
  },
  {
    id: "sql-pivot", cat: "SQL", lang: "sql", emoji: "🗄️",
    titre: "Pivot conditionnel (CASE WHEN)",
    desc: "Transformer des lignes en colonnes sans PIVOT natif.",
    code: `SELECT
  mois,
  SUM(CASE WHEN region = 'Nord'  THEN ventes ELSE 0 END) AS nord,
  SUM(CASE WHEN region = 'Sud'   THEN ventes ELSE 0 END) AS sud,
  SUM(CASE WHEN region = 'Est'   THEN ventes ELSE 0 END) AS est,
  SUM(CASE WHEN region = 'Ouest' THEN ventes ELSE 0 END) AS ouest
FROM ventes
GROUP BY mois
ORDER BY mois;`,
  },
  {
    id: "sql-calendar", cat: "SQL", lang: "sql", emoji: "🗄️",
    titre: "Date spine (calendrier complet)",
    desc: "Générer une série de dates sans trous — utile pour les jointures temporelles.",
    code: `-- BigQuery / Snowflake
WITH RECURSIVE dates AS (
  SELECT DATE('2026-01-01') AS d
  UNION ALL
  SELECT DATEADD(day, 1, d) FROM dates WHERE d < DATE('2026-12-31')
)
SELECT d AS date_jour FROM dates;

-- BigQuery natif
SELECT d FROM UNNEST(
  GENERATE_DATE_ARRAY('2026-01-01', '2026-12-31', INTERVAL 1 DAY)
) AS d;`,
  },
  /* Python */
  {
    id: "py-profiling", cat: "Python", lang: "python", emoji: "🐍",
    titre: "Profiling rapide d'un DataFrame",
    desc: "5 lignes pour avoir un aperçu complet des données.",
    code: `import pandas as pd

def quick_profile(df: pd.DataFrame) -> pd.DataFrame:
    return pd.DataFrame({
        "dtype":    df.dtypes,
        "non_null": df.notna().sum(),
        "null_pct": (df.isna().mean() * 100).round(1),
        "unique":   df.nunique(),
        "sample":   df.iloc[0],
    })

# Usage
profile = quick_profile(df)
print(profile.to_string())`,
  },
  {
    id: "py-clean-cols", cat: "Python", lang: "python", emoji: "🐍",
    titre: "Nettoyage automatique des noms de colonnes",
    desc: "Normaliser les noms de colonnes en snake_case sans accents.",
    code: `import re
import unicodedata

def clean_columns(df):
    def slugify(s):
        s = unicodedata.normalize("NFKD", s)
        s = s.encode("ascii", "ignore").decode()
        s = re.sub(r"[^a-zA-Z0-9]+", "_", s).strip("_").lower()
        return s
    df.columns = [slugify(c) for c in df.columns]
    return df

df = clean_columns(df)
print(df.columns.tolist())`,
  },
  {
    id: "py-sklearn-pipeline", cat: "Python", lang: "python", emoji: "🐍",
    titre: "Pipeline sklearn complet",
    desc: "Template de pipeline reproductible avec preprocessing et modèle.",
    code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

num_features = ["age", "revenu", "anciennete"]
cat_features = ["region", "segment"]

preprocessor = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale",  StandardScaler()),
    ]), num_features),
    ("cat", Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("encode", OneHotEncoder(handle_unknown="ignore")),
    ]), cat_features),
])

pipeline = Pipeline([
    ("prep",   preprocessor),
    ("model",  GradientBoostingClassifier(n_estimators=200, random_state=42)),
])

scores = cross_val_score(pipeline, X, y, cv=5, scoring="roc_auc")
print(f"AUC : {scores.mean():.3f} ± {scores.std():.3f}")`,
  },
  {
    id: "py-feature-importance", cat: "Python", lang: "python", emoji: "🐍",
    titre: "Feature importance avec SHAP",
    desc: "Expliquer un modèle XGBoost en 10 lignes.",
    code: `import shap
import xgboost as xgb
import matplotlib.pyplot as plt

model = xgb.XGBClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)

# Graphique global
shap.summary_plot(shap_values, X_test, plot_type="bar")

# Graphique détaillé
shap.summary_plot(shap_values, X_test)

# Explication d'une prédiction individuelle
shap.force_plot(explainer.expected_value, shap_values[0], X_test.iloc[0])`,
  },
  /* dbt */
  {
    id: "dbt-model", cat: "dbt", lang: "sql", emoji: "🔧",
    titre: "Template de model dbt standard",
    desc: "Structure de base pour un model dbt propre.",
    code: `{{
  config(
    materialized = 'table',
    schema       = 'mart',
    tags         = ['daily', 'finance']
  )
}}

with source as (
  select * from {{ ref('stg_orders') }}
),

renamed as (
  select
    order_id,
    customer_id,
    order_date,
    total_amount,
    status,
    -- dates
    date_trunc('month', order_date) as order_month,
    -- flags
    case when status = 'completed' then true else false end as is_completed
  from source
)

select * from renamed`,
  },
  {
    id: "dbt-incremental", cat: "dbt", lang: "sql", emoji: "🔧",
    titre: "Model incrémental dbt",
    desc: "Traiter uniquement les nouvelles données à chaque run.",
    code: `{{
  config(
    materialized = 'incremental',
    unique_key   = 'event_id',
    on_schema_change = 'sync_all_columns'
  )
}}

select
  event_id,
  user_id,
  event_type,
  created_at
from {{ source('raw', 'events') }}

{% if is_incremental() %}
  where created_at > (select max(created_at) from {{ this }})
{% endif %}`,
  },
  /* Spark */
  {
    id: "spark-optimize", cat: "PySpark", lang: "python", emoji: "⚡",
    titre: "Optimisations PySpark — partition & cache",
    desc: "Les patterns d'optimisation les plus courants en production.",
    code: `from pyspark.sql import functions as F

# 1. Repartitioner avant un groupBy ou join coûteux
df_repartitioned = df.repartition(200, "customer_id")

# 2. Broadcast join pour une petite table (< 10 MB)
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "key")

# 3. Cache une DataFrame réutilisée plusieurs fois
df_cached = df.cache()
df_cached.count()  # matérialise le cache

# 4. Éviter les UDFs Python (très lents) — préférer les fonctions natives
# Mauvais :
# df.withColumn("upper", udf(lambda x: x.upper())(col("name")))
# Bon :
df = df.withColumn("upper", F.upper(F.col("name")))

# 5. Écrire en Parquet partitionné
df.write.partitionBy("year", "month") \\
  .mode("overwrite") \\
  .parquet("s3://bucket/data/")`,
  },
];

const CHECKLISTS = [
  {
    id: "ml-launch", role: "Data Scientist", emoji: "🤖",
    titre: "Lancement d'un projet ML",
    desc: "De la définition du problème à la mise en production.",
    items: [
      "Définir la métrique métier de succès (pas juste l'AUC)",
      "Valider la disponibilité et la qualité des données",
      "Définir la fenêtre de prédiction et le label cible",
      "Établir une baseline simple (règle métier, modèle naïf)",
      "Analyse exploratoire et distribution de la variable cible",
      "Vérifier le déséquilibre de classes",
      "Définir la stratégie de validation (K-fold, time-split)",
      "Implémenter le feature engineering documenté",
      "Entraîner plusieurs modèles et comparer",
      "Analyser les erreurs du meilleur modèle",
      "Valider l'absence de data leakage",
      "Tester les performances sur une période récente (backtesting)",
      "Documenter les features utilisées et leur importance",
      "Présenter les résultats aux équipes métier",
      "Définir le monitoring en production",
    ],
  },
  {
    id: "data-quality", role: "Data Engineer", emoji: "🔍",
    titre: "Data Quality avant livraison",
    desc: "Vérifications à faire avant de passer un dataset en production.",
    items: [
      "Vérifier le volume de lignes (cohérent avec l'attendu ?)",
      "Contrôler les valeurs nulles sur les colonnes critiques",
      "Vérifier l'unicité des clés primaires",
      "Contrôler les plages de valeurs (min/max cohérents)",
      "Vérifier la fraîcheur des données (timestamp max récent ?)",
      "Contrôler les références (FK vers tables de référence valides)",
      "Vérifier les formats (dates, codes, montants)",
      "Comparer les totaux avec le système source",
      "Vérifier l'absence de duplicats",
      "Tester les cas limites (valeurs extremes, chaînes vides)",
      "Valider la cohérence entre tables (agrégats cohérents)",
      "Documenter les règles de qualité appliquées",
    ],
  },
  {
    id: "ml-deploy", role: "MLOps Engineer", emoji: "🚀",
    titre: "Avant déploiement d'un modèle ML",
    desc: "Checklist de validation avant de mettre un modèle en production.",
    items: [
      "Modèle versionné dans le Model Registry (MLflow ou équivalent)",
      "Tests unitaires sur le code de prétraitement",
      "Validation des performances sur un jeu de test récent (3 derniers mois)",
      "Validation de la latence de prédiction (< SLA défini)",
      "Documentation des features et de leur source",
      "Validation par l'équipe métier (shadow mode ou A/B test)",
      "Plan de rollback documenté",
      "Monitoring configuré (drift, latence, taux d'erreur)",
      "Alertes définies en cas de dégradation",
      "Approbation formelle du Data Owner",
      "Documentation du comportement attendu sur les cas limites",
      "Revue de sécurité (données PII, RGPD)",
    ],
  },
  {
    id: "governance", role: "Data Manager", emoji: "🏛️",
    titre: "Gouvernance d'un nouveau dataset",
    desc: "Intégrer correctement un nouveau jeu de données dans le SI data.",
    items: [
      "Identifier le Data Owner (référent métier responsable)",
      "Documenter la définition de chaque colonne",
      "Classifier les données (public, interne, confidentiel, PII)",
      "Identifier les données personnelles (RGPD)",
      "Définir la durée de conservation",
      "Configurer les droits d'accès (RBAC)",
      "Intégrer dans le Data Catalog",
      "Documenter le lineage (source → transformations → destination)",
      "Définir les règles de qualité et les SLA de fraîcheur",
      "Informer les équipes consommatrices",
      "Prévoir le processus de demande d'accès",
      "Définir le processus de signalement d'anomalie",
    ],
  },
];

const TIPS: Record<string, { titre: string; tips: string[] }[]> = {
  "Data Analyst": [
    {
      titre: "SQL & Données",
      tips: [
        "Toujours écrire un commentaire en tête de requête : date, auteur, objectif.",
        "Utiliser des CTEs plutôt que des sous-requêtes imbriquées : 10× plus lisible.",
        "Avant toute analyse, vérifier le COUNT(*) et COUNT(DISTINCT clé) — repère les duplicats.",
        "NULLIF(x, 0) évite les divisions par zéro sans IF imbriqués.",
        "Les window functions (LAG, LEAD, RANK, SUM OVER) remplacent 80% des auto-jointures complexes.",
      ],
    },
    {
      titre: "Power BI & Tableau",
      tips: [
        "Créer une table 'Dates' dédiée dans Power BI : indispensable pour les time intelligence.",
        "Les mesures DAX avec CALCULATE + FILTER sont plus flexibles que les colonnes calculées.",
        "Dans Tableau : utiliser les LOD FIXED pour des calculs indépendants du niveau de détail de la vue.",
        "Toujours nommer les axes et titres de graphiques : un tableau de bord sans titres est inutilisable.",
        "Ajouter une date de dernière mise à jour visible sur chaque dashboard.",
      ],
    },
    {
      titre: "Productivité",
      tips: [
        "Apprendre 5 raccourcis clavier de ton éditeur SQL : tu gagnes des dizaines de minutes par jour.",
        "DBeaver (gratuit) + connexion à toutes les bases = outil universel pour tout Data Analyst.",
        "Sauvegarder ses requêtes fréquentes dans un fichier .sql versionné sur Git.",
        "ChatGPT / Claude est excellent pour debugger du SQL et expliquer des fonctions inconnues.",
      ],
    },
  ],
  "Data Scientist": [
    {
      titre: "Machine Learning",
      tips: [
        "Toujours commencer par un modèle naïf (baseline) avant d'aller vers la complexité.",
        "La validation croisée avec stratification est obligatoire sur des classes déséquilibrées.",
        "SHAP > feature_importances_ : explique mieux et détecte les interactions entre variables.",
        "Un modèle interprétable avec AUC 0.85 vaut souvent mieux qu'une boîte noire à 0.87.",
        "Documenter chaque expérience dans MLflow : params, métriques, artifacts.",
      ],
    },
    {
      titre: "Code & Reproductibilité",
      tips: [
        "requirements.txt ou pyproject.toml : toujours versionner ses dépendances.",
        "Fixer la random_state partout (train_test_split, modèles) pour des résultats reproductibles.",
        "Un notebook Jupyter = exploration. La production = modules Python avec tests.",
        "nbstripout : retire les outputs des notebooks avant chaque commit Git.",
        "Rédiger le README en premier : ça force à clarifier l'objectif avant de coder.",
      ],
    },
    {
      titre: "Prompts LLM utiles",
      tips: [
        "\"Explique cette erreur Python et propose 3 corrections : [coller l'erreur]\"",
        "\"Génère une fonction Python qui [description précise]. Inclure les type hints et les docstrings.\"",
        "\"Voici mon code SQL. Identifie les problèmes de performance potentiels et propose des optimisations.\"",
        "\"Génère des données de test réalistes (50 lignes) pour ce schéma SQL : [schéma]\"",
        "\"Transforme ce code pandas en PySpark équivalent : [code pandas]\"",
      ],
    },
  ],
  "Data Engineer": [
    {
      titre: "Pipelines & Architecture",
      tips: [
        "Idempotence first : un pipeline qui peut s'exécuter plusieurs fois sans effets de bord est un bon pipeline.",
        "Partitionner les tables par date dès le départ : impossible à ajouter proprement après.",
        "Les petits fichiers tuent les performances Spark et BigQuery — compacter régulièrement.",
        "Toujours logger les volumes en entrée et sortie de chaque étape ETL.",
        "dbt + Airflow = le duo standard du Data Engineer en 2026 : maîtriser les deux.",
      ],
    },
    {
      titre: "Git & Collaboration",
      tips: [
        "Convention de branches : feat/xxx, fix/xxx, chore/xxx — la PR review devient 5× plus simple.",
        "Les commits atomiques (une modification = un commit) facilitent le revert.",
        ".gitignore pour data projects : ne jamais committer de fichiers .csv, .parquet ou de credentials.",
        "GitHub Actions (ou GitLab CI) pour dbt : les tests passent ou la PR est bloquée.",
        "Code review croisée entre data engineers : essentielle pour homogénéiser les standards.",
      ],
    },
    {
      titre: "Cloud & Coûts",
      tips: [
        "Snowflake : éteindre les virtual warehouses inactifs via AUTO_SUSPEND = 60 secondes.",
        "BigQuery : préférer les slots réservés si les requêtes sont fréquentes (>200 TB/mois scannés).",
        "AWS S3 : stocker en Parquet compressé Snappy — divise par 5-10 la taille et le coût.",
        "Databricks : utiliser les spot instances pour les jobs batch — 60-80% moins cher.",
        "Tagging des ressources cloud : indispensable pour l'allocation des coûts par projet.",
      ],
    },
  ],
  "Data Manager": [
    {
      titre: "Gouvernance & Organisation",
      tips: [
        "Commencer par identifier 3-5 Data Owners motivés : la gouvernance sans sponsor métier échoue.",
        "Un Data Catalog utilisé > un Data Catalog parfait. Commencer simple et itérer.",
        "Mesurer le temps passé à chercher des données : c'est le ROI du Data Catalog.",
        "RGPD : une cartographie des données personnelles par domaine métier avant tout projet IA.",
        "Les réunions de Data Quality mensuelle (30 min) évitent les crises en production.",
      ],
    },
    {
      titre: "Pilotage & Communication",
      tips: [
        "3 métriques suffit pour piloter une équipe data : délai de livraison, qualité, satisfaction métier.",
        "Un roadmap data visible de tous (Confluence, Notion) réduit les demandes répétées.",
        "Traduire les résultats ML en langage métier : pas l'AUC, mais '12% de fraude en moins'.",
        "Les quick wins (< 2 semaines) sont essentiels pour maintenir la confiance des sponsors.",
        "Documentation du schéma de données = actif stratégique, pas une corvée.",
      ],
    },
  ],
};

const RESSOURCES = {
  docs: [
    { nom: "Python 3", url: "https://docs.python.org/fr/3/", desc: "Documentation officielle Python en français", tags: ["Python", "Débutant"] },
    { nom: "Pandas", url: "https://pandas.pydata.org/docs/", desc: "Manipulation de données tabulaires en Python", tags: ["Python", "Analyse"] },
    { nom: "Scikit-learn", url: "https://scikit-learn.org/stable/", desc: "ML en Python : algorithmes, pipelines, métriques", tags: ["ML", "Python"] },
    { nom: "Apache Spark", url: "https://spark.apache.org/docs/latest/", desc: "Traitement distribué de données à grande échelle", tags: ["Big Data", "PySpark"] },
    { nom: "dbt", url: "https://docs.getdbt.com/", desc: "Transformation SQL avec tests et documentation", tags: ["SQL", "Analytics Engineering"] },
    { nom: "Apache Airflow", url: "https://airflow.apache.org/docs/", desc: "Orchestration de pipelines de données", tags: ["Orchestration", "Python"] },
    { nom: "Databricks", url: "https://docs.databricks.com/", desc: "Plateforme Lakehouse unifiée (Spark + Delta Lake + ML)", tags: ["Spark", "ML", "Lakehouse"] },
    { nom: "Snowflake", url: "https://docs.snowflake.com/", desc: "Data Cloud — SQL sur données à l'échelle", tags: ["SQL", "Data Warehouse"] },
    { nom: "BigQuery", url: "https://cloud.google.com/bigquery/docs", desc: "Data Warehouse serverless Google Cloud", tags: ["GCP", "SQL", "Analytics"] },
    { nom: "AWS Glue", url: "https://docs.aws.amazon.com/glue/", desc: "Service ETL serverless d'AWS", tags: ["AWS", "ETL"] },
    { nom: "MLflow", url: "https://mlflow.org/docs/latest/", desc: "Tracking, packaging et déploiement de modèles ML", tags: ["ML", "MLOps"] },
    { nom: "Power BI", url: "https://learn.microsoft.com/fr-fr/power-bi/", desc: "Documentation complète Power BI en français", tags: ["BI", "Microsoft"] },
    { nom: "Tableau", url: "https://help.tableau.com/", desc: "Documentation officielle Tableau", tags: ["BI", "Visualisation"] },
    { nom: "Dataiku", url: "https://doc.dataiku.com/", desc: "Documentation DSS — la plateforme ML tout-en-un", tags: ["ML", "No-code"] },
    { nom: "Great Expectations", url: "https://docs.greatexpectations.io/", desc: "Tests de qualité de données en Python", tags: ["Data Quality", "Python"] },
    { nom: "Hugging Face", url: "https://huggingface.co/docs", desc: "Modèles NLP, LLM, Computer Vision open source", tags: ["NLP", "LLM", "IA"] },
  ],
  youtube: [
    { nom: "Alex The Analyst", url: "https://www.youtube.com/@AlexTheAnalyst", desc: "SQL, Power BI, Python pour débutants — très clair", tags: ["SQL", "Power BI", "Débutant"] },
    { nom: "Ken Jee", url: "https://www.youtube.com/@KenJee_ds", desc: "Carrière Data Science, projets ML, retours d'expérience", tags: ["Data Science", "Carrière"] },
    { nom: "Zach Wilson (Data with Zach)", url: "https://www.youtube.com/@zachawilson", desc: "Data Engineering avancé — pipelines, Spark, architecture", tags: ["Data Engineering", "Avancé"] },
    { nom: "StatQuest (Josh Starmer)", url: "https://www.youtube.com/@statquest", desc: "Concepts statistiques et ML expliqués visuellement", tags: ["ML", "Statistiques", "Concepts"] },
    { nom: "Andrej Karpathy", url: "https://www.youtube.com/@AndrejKarpathy", desc: "Deep Learning, LLMs — cours by ex-Tesla AI", tags: ["Deep Learning", "LLM", "Avancé"] },
    { nom: "Data Engineering Podcast", url: "https://www.youtube.com/@DataEngineeringPodcast", desc: "Interviews et deep dives sur l'ingénierie des données", tags: ["Data Engineering"] },
    { nom: "Seattle Data Guy", url: "https://www.youtube.com/@SeattleDataGuy", desc: "Architecture data, dbt, Airflow en pratique", tags: ["dbt", "Architecture"] },
    { nom: "Tina Huang", url: "https://www.youtube.com/@TinaHuang1", desc: "Data Science, ML — approche pratique et honnête", tags: ["Data Science", "ML"] },
  ],
  podcasts: [
    { nom: "DataFramed", url: "https://www.datacamp.com/podcast", desc: "Interviews de praticiens data — DataCamp (EN)", tags: ["Général", "Interviews"] },
    { nom: "Data Engineering Podcast", url: "https://www.dataengineeringpodcast.com/", desc: "Architectures, outils, retours terrain (EN)", tags: ["Data Engineering"] },
    { nom: "Super Data Science", url: "https://www.superdatascience.com/podcast", desc: "Data Science et carrière — format accessible (EN)", tags: ["Data Science", "Carrière"] },
    { nom: "The TWIML AI Podcast", url: "https://twimlai.com/", desc: "ML et IA de pointe — interviews chercheurs et practitioners (EN)", tags: ["ML", "IA", "Avancé"] },
    { nom: "Practical AI", url: "https://changelog.com/practicalai", desc: "IA appliquée dans l'industrie — très actionnable (EN)", tags: ["IA", "Pratique"] },
  ],
  newsletters: [
    { nom: "Data Engineering Weekly", url: "https://www.dataengineeringweekly.com/", desc: "Actualités data engineering — articles et outils de la semaine", tags: ["Data Engineering"] },
    { nom: "Data Elixir", url: "https://dataelixir.com/", desc: "Sélection hebdo des meilleurs articles data et ML", tags: ["Général", "ML"] },
    { nom: "The Batch (deeplearning.ai)", url: "https://www.deeplearning.ai/the-batch/", desc: "Newsletter IA d'Andrew Ng — focus business et technique", tags: ["IA", "Deep Learning"] },
    { nom: "The Analytics Engineering Roundup", url: "https://roundup.getdbt.com/", desc: "dbt Labs — data stack moderne, SQL, analytics engineering", tags: ["dbt", "Analytics Engineering"] },
    { nom: "TLDR Data", url: "https://tldr.tech/data", desc: "Résumé daily des news data & IA en 5 minutes", tags: ["Général", "Débutant"] },
  ],
  cours: [
    { nom: "Databricks Academy", url: "https://www.databricks.com/learn/training/home", desc: "Cours officiels Databricks — Spark, Delta Lake, MLflow (gratuits)", tags: ["Databricks", "Gratuit"] },
    { nom: "dbt Learn", url: "https://courses.getdbt.com/", desc: "Cours officiels dbt Labs — de débutant à avancé (gratuit)", tags: ["dbt", "Gratuit"] },
    { nom: "AWS Skill Builder", url: "https://skillbuilder.aws/", desc: "Catalogue complet de formations AWS — 500+ cours gratuits", tags: ["AWS", "Gratuit"] },
    { nom: "Google Cloud Skills Boost", url: "https://cloudskillsboost.google/", desc: "Labs interactifs Google Cloud — du fondamental au pro", tags: ["GCP", "Gratuit"] },
    { nom: "Microsoft Learn", url: "https://learn.microsoft.com/fr-fr/", desc: "Azure, Power BI, ML Studio — en français, gratuit", tags: ["Azure", "Gratuit"] },
    { nom: "Kaggle Learn", url: "https://www.kaggle.com/learn", desc: "Python, ML, SQL, Data Viz — mini-cours pratiques (gratuits)", tags: ["ML", "Python", "Gratuit"] },
    { nom: "fast.ai", url: "https://www.fast.ai/", desc: "Deep Learning from scratch — approche top-down, très efficace", tags: ["Deep Learning", "Gratuit"] },
    { nom: "Deeplearning.ai", url: "https://www.deeplearning.ai/courses/", desc: "Spécialisation ML et IA signée Andrew Ng (partiellement gratuit)", tags: ["ML", "IA"] },
  ],
};

/* ─── COMPOSANTS ──────────────────────────────────────── */

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={{
        padding: "5px 12px", borderRadius: 6, fontSize: 11.5, fontWeight: 600,
        background: copied ? "#F0FDF4" : "#F8FAFC",
        color: copied ? "#15803D" : "#64748B",
        border: `1px solid ${copied ? "#86EFAC" : "#E2E8F0"}`,
        cursor: "pointer", transition: "all 0.2s", fontFamily: "inherit",
      }}
    >
      {copied ? "✓ Copié !" : "Copier"}
    </button>
  );
}

function ABCalculator() {
  const [baseline, setBaseline] = useState(5);
  const [lift, setLift] = useState(10);
  const [confidence, setConfidence] = useState(95);

  const z_alpha = confidence === 99 ? 2.576 : confidence === 90 ? 1.645 : 1.96;
  const z_beta = 0.84;
  const p1 = baseline / 100;
  const p2 = p1 * (1 + lift / 100);
  const n = Math.ceil(
    Math.pow(z_alpha + z_beta, 2) * (p1 * (1 - p1) + p2 * (1 - p2)) /
    Math.pow(p1 - p2, 2)
  );
  const total = n * 2;
  const daysAt10k = Math.ceil(total / 10000);

  return (
    <div className="card" style={{ padding: 28, maxWidth: 560 }}>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, marginBottom: 20, color: "#0F172A" }}>
        📊 Calculateur taille d'échantillon A/B test
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 24 }}>
        {[
          { label: "Taux de conversion actuel (%)", val: baseline, setter: setBaseline, min: 0.1, max: 50, step: 0.5 },
          { label: "Amélioration minimale détectable (%)", val: lift, setter: setLift, min: 1, max: 50, step: 1 },
        ].map(({ label, val, setter, min, max, step }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 13, color: "#1E293B", fontWeight: 500 }}>{label}</label>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED", fontFamily: "var(--font-mono)" }}>{val}%</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val}
              onChange={e => setter(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#7C3AED" }} />
          </div>
        ))}
        <div>
          <label style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, display: "block", marginBottom: 8 }}>Niveau de confiance</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[90, 95, 99].map(v => (
              <button key={v} onClick={() => setConfidence(v)} style={{
                padding: "6px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: confidence === v ? "#EDE9FE" : "#F8FAFC",
                color: confidence === v ? "#5B21B6" : "#64748B",
                border: confidence === v ? "1.5px solid #C4B5FD" : "1.5px solid #E2E8F0",
                fontFamily: "inherit",
              }}>{v}%</button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background: "#F5F3FF", borderRadius: 12, padding: "20px 24px", border: "1px solid #DDD6FE" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Par variant", val: n.toLocaleString("fr-FR") },
            { label: "Total (A + B)", val: total.toLocaleString("fr-FR") },
          ].map(({ label, val }) => (
            <div key={label}>
              <p style={{ fontSize: 11.5, color: "#94A3B8", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "#5B21B6" }}>{val}</p>
              <p style={{ fontSize: 11, color: "#94A3B8" }}>utilisateurs</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #DDD6FE" }}>
          <p style={{ fontSize: 12.5, color: "#64748B" }}>
            À <strong style={{ color: "#0F172A" }}>10 000 visites/jour</strong>, ce test prend environ{" "}
            <strong style={{ color: "#7C3AED" }}>{daysAt10k} jour{daysAt10k > 1 ? "s" : ""}</strong>.
          </p>
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 12 }}>
        Formule : n = (z_α + z_β)² × (p₁(1−p₁) + p₂(1−p₂)) / (p₁−p₂)² — Power 80%, deux queues
      </p>
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────────── */

const TABS = [
  { id: "snippets", label: "Snippets & Code", emoji: "💻" },
  { id: "checklists", label: "Checklists", emoji: "✅" },
  { id: "tips", label: "Tips & Astuces", emoji: "💡" },
  { id: "ressources", label: "Ressources", emoji: "📚" },
  { id: "calculateurs", label: "Calculateurs", emoji: "🧮" },
];

const SNIPPET_CATS = ["Tous", "SQL", "Python", "dbt", "PySpark"];
const TIPS_ROLES = ["Data Analyst", "Data Scientist", "Data Engineer", "Data Manager"];
const RES_CATS = [
  { id: "docs", label: "Documentations", emoji: "📄" },
  { id: "youtube", label: "YouTube", emoji: "▶️" },
  { id: "podcasts", label: "Podcasts", emoji: "🎙️" },
  { id: "newsletters", label: "Newsletters", emoji: "📬" },
  { id: "cours", label: "Cours gratuits", emoji: "🎓" },
];

export default function ToolboxPage() {
  const [activeTab, setActiveTab] = useState("snippets");
  const [snippetCat, setSnippetCat] = useState("Tous");
  const [tipsRole, setTipsRole] = useState("Data Analyst");
  const [resCat, setResCat] = useState("docs");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const filteredSnippets = snippetCat === "Tous" ? SNIPPETS : SNIPPETS.filter(s => s.cat === snippetCat);

  const toggleCheck = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "72px 24px 56px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid #DDD6FE",
      }}>
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(124,58,237,0.08)", top: -150, right: -80 }} />
        <div className="orb" style={{ width: 300, height: 300, background: "rgba(14,165,233,0.06)", bottom: -80, left: "8%", animationDelay: "6s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-indigo" style={{ marginBottom: 20 }}>🛠️ Toolbox Data</span>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 14, maxWidth: 740 }}>
            La boîte à outils du
            <span className="text-gradient"> data professionnel</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 580, lineHeight: 1.7, marginBottom: 36 }}>
            Snippets réutilisables, checklists métier, tips par rôle, ressources d&apos;apprentissage et calculateurs. Tout ce qui fait gagner du temps au quotidien.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { n: SNIPPETS.length, l: "snippets de code" },
              { n: CHECKLISTS.length * 12, l: "items de checklist" },
              { n: Object.values(RESSOURCES).flat().length, l: "ressources" },
              { n: "4", l: "rôles couverts" },
            ].map(({ n, l }) => (
              <div key={l} className="card" style={{ padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="stat-num" style={{ fontSize: "1.4rem" }}>{n}</span>
                <span style={{ color: "#64748B", fontSize: 12 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS ──────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 58, zIndex: 40,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "14px 18px",
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#7C3AED" : "#64748B",
              borderBottom: activeTab === tab.id ? "2.5px solid #7C3AED" : "2.5px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit",
            }}>
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* SNIPPETS */}
        {activeTab === "snippets" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {SNIPPET_CATS.map(cat => (
                <button key={cat} onClick={() => setSnippetCat(cat)} className={`filter-chip ${snippetCat === cat ? "active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filteredSnippets.map(s => (
                <div key={s.id} className="card" style={{ overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span className="badge badge-indigo">{s.cat}</span>
                        <span className="badge badge-neutral" style={{ fontFamily: "var(--font-mono)" }}>{s.lang}</span>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{s.titre}</h3>
                      <p style={{ fontSize: 13, color: "#64748B" }}>{s.desc}</p>
                    </div>
                    <CopyButton code={s.code} />
                  </div>
                  <pre style={{
                    margin: 0, padding: "18px 24px",
                    background: "#F8FAFC", borderTop: "1px solid #E2E8F0",
                    overflowX: "auto", fontSize: 12.5, lineHeight: 1.7,
                    color: "#1E293B", fontFamily: "var(--font-mono)",
                  }}>
                    <code>{s.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHECKLISTS */}
        {activeTab === "checklists" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))", gap: 24 }}>
            {CHECKLISTS.map(cl => {
              const doneCount = cl.items.filter((_, idx) => checkedItems[`${cl.id}-${idx}`]).length;
              const pct = Math.round((doneCount / cl.items.length) * 100);
              return (
                <div key={cl.id} className="card" style={{ padding: 28 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <span className="badge badge-indigo" style={{ marginBottom: 8 }}>{cl.role}</span>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{cl.emoji} {cl.titre}</h3>
                      <p style={{ fontSize: 12.5, color: "#64748B", marginTop: 4 }}>{cl.desc}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: pct === 100 ? "#15803D" : "#94A3B8", flexShrink: 0 }}>{doneCount}/{cl.items.length}</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: 20 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {cl.items.map((item, idx) => {
                      const key = `${cl.id}-${idx}`;
                      const checked = !!checkedItems[key];
                      return (
                        <label key={idx} onClick={() => toggleCheck(key)} style={{
                          display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
                          padding: "6px 8px", borderRadius: 8,
                          background: checked ? "#F0FDF4" : "transparent",
                          transition: "background 0.15s",
                        }}>
                          <div style={{
                            width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                            border: checked ? "none" : "2px solid #CBD5E1",
                            background: checked ? "#16A34A" : "transparent",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                          </div>
                          <span style={{ fontSize: 13, color: checked ? "#64748B" : "#1E293B", textDecoration: checked ? "line-through" : "none", lineHeight: 1.5 }}>
                            {item}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TIPS */}
        {activeTab === "tips" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {TIPS_ROLES.map(role => (
                <button key={role} onClick={() => setTipsRole(role)} className={`filter-chip ${tipsRole === role ? "active" : ""}`}>
                  {role}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 20 }}>
              {(TIPS[tipsRole] || []).map((section, si) => (
                <div key={si} className="card" style={{ padding: 24 }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "#7C3AED", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {section.titre}
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {section.tips.map((tip, ti) => (
                      <div key={ti} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: "#7C3AED", fontSize: 12, marginTop: 3, flexShrink: 0 }}>▸</span>
                        <p style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.6 }}>{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESSOURCES */}
        {activeTab === "ressources" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
              {RES_CATS.map(rc => (
                <button key={rc.id} onClick={() => setResCat(rc.id)} className={`filter-chip ${resCat === rc.id ? "active" : ""}`}>
                  {rc.emoji} {rc.label}
                </button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {(RESSOURCES[resCat as keyof typeof RESSOURCES] || []).map((r: {nom: string; url: string; desc: string; tags: string[]}, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="card"
                  style={{ padding: 20, display: "block", textDecoration: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "#0F172A" }}>{r.nom}</h3>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.55, marginBottom: 12 }}>{r.desc}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {r.tags.map(t => (
                      <span key={t} className="tag-pill">{t}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* CALCULATEURS */}
        {activeTab === "calculateurs" && (
          <div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 28 }}>
              Outils de calcul interactifs pour prendre de meilleures décisions data.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <ABCalculator />

              {/* Placeholder pour futurs calculateurs */}
              {[
                { titre: "Estimateur coût cloud", desc: "Comparer S3, BigQuery, Snowflake sur un volume de données.", badge: "Bientôt" },
                { titre: "Convertisseur de format", desc: "CSV → Parquet → JSON — gain de taille estimé.", badge: "Bientôt" },
              ].map(c => (
                <div key={c.titre} className="card" style={{ padding: 28, maxWidth: 560, opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{c.titre}</h3>
                    <span className="badge badge-neutral">{c.badge}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#64748B" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
