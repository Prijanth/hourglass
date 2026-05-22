const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname);

// ─── HELPERS ────────────────────────────────────────────────────────────────

function newDoc() {
  return new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 }, bufferPages: true });
}

function coverPage(doc, title, subtitle, color) {
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(color);
  doc.rect(0, doc.page.height - 8, doc.page.width, 8).fill('#ffffff22');
  doc.fillColor('#ffffff').fontSize(42).font('Helvetica-Bold')
     .text(title, 60, 200, { width: doc.page.width - 120, align: 'center' });
  doc.fontSize(20).font('Helvetica')
     .text(subtitle, 60, 270, { width: doc.page.width - 120, align: 'center' });
  doc.moveDown(2);
  doc.fontSize(13).fillColor('#ffffffcc')
     .text('Fiche de référence expert — Prijanth Seevaratnam', 60, 330, { width: doc.page.width - 120, align: 'center' });
  doc.fontSize(11).fillColor('#ffffff99')
     .text('Mai 2026', 60, 360, { width: doc.page.width - 120, align: 'center' });
}

function sectionTitle(doc, text, color) {
  doc.addPage();
  doc.rect(0, 0, doc.page.width, 6).fill(color);
  doc.moveDown(0.5);
  doc.fillColor(color).fontSize(22).font('Helvetica-Bold')
     .text(text, 50, 70);
  doc.moveTo(50, doc.y + 4).lineTo(doc.page.width - 50, doc.y + 4).strokeColor(color).lineWidth(1.5).stroke();
  doc.moveDown(0.8);
}

function h2(doc, text, color) {
  doc.moveDown(0.6);
  doc.fillColor(color).fontSize(14).font('Helvetica-Bold').text(text);
  doc.moveDown(0.2);
}

function h3(doc, text) {
  doc.moveDown(0.4);
  doc.fillColor('#333333').fontSize(12).font('Helvetica-Bold').text(text);
  doc.moveDown(0.1);
}

function body(doc, text) {
  doc.fillColor('#222222').fontSize(10).font('Helvetica').text(text, { lineGap: 2 });
}

function bullet(doc, items, indent = 60) {
  items.forEach(item => {
    const y = doc.y;
    doc.fillColor('#444444').fontSize(10).font('Helvetica')
       .text('•', 50, y, { width: 12, continued: false });
    doc.text(item, indent, y, { width: doc.page.width - indent - 50, lineGap: 2 });
    doc.moveDown(0.1);
  });
}

function subbullet(doc, items) {
  items.forEach(item => {
    const y = doc.y;
    doc.fillColor('#666666').fontSize(9.5).font('Helvetica')
       .text('–', 68, y, { width: 12 });
    doc.text(item, 82, y, { width: doc.page.width - 82 - 50, lineGap: 2 });
    doc.moveDown(0.1);
  });
}

function infoBox(doc, label, text, color) {
  const x = 50, w = doc.page.width - 100;
  const startY = doc.y + 4;
  doc.rect(x, startY, 4, 36).fill(color);
  doc.rect(x + 4, startY, w - 4, 36).fill(color + '18');
  doc.fillColor(color).fontSize(9).font('Helvetica-Bold').text(label, x + 12, startY + 6, { width: w - 20 });
  doc.fillColor('#333333').fontSize(9).font('Helvetica').text(text, x + 12, startY + 18, { width: w - 20 });
  doc.moveDown(0.3);
  doc.y = startY + 44;
}

function pageNumbers(doc) {
  const range = doc.bufferedPageRange();
  for (let i = range.start + 1; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc.fillColor('#aaaaaa').fontSize(8).font('Helvetica')
       .text(`Page ${i}`, 50, doc.page.height - 35, { width: doc.page.width - 100, align: 'right' });
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  FICHE 1 — DATAIKU DSS
// ═══════════════════════════════════════════════════════════════════════════

function buildDataiku() {
  const doc = newDoc();
  const C = '#1a4f8a';
  const stream = fs.createWriteStream(path.join(OUTPUT_DIR, 'Fiche_Expert_Dataiku.pdf'));
  doc.pipe(stream);

  // COVER
  coverPage(doc, 'DATAIKU DSS', 'Guide Expert — Compétences & Fonctionnalités', C);

  // ── 1. VUE D'ENSEMBLE ────────────────────────────────────────────────────
  sectionTitle(doc, '1. Vue d\'ensemble', C);
  body(doc, 'Dataiku DSS (Data Science Studio) est une plateforme collaborative de data science et de machine learning. Elle permet à des profils variés (data scientists, data engineers, analystes, développeurs) de collaborer sur des projets de données de bout en bout : de l\'ingestion à la mise en production de modèles.');
  doc.moveDown(0.5);
  h2(doc, 'Positionnement marché', C);
  bullet(doc, [
    'Concurrent direct : Alteryx, Knime, Azure ML Studio, SAS Viya, Palantir Foundry',
    'Points différenciants : interface visuelle + code natif, collaboration multi-profils, MLOps intégré',
    'Clients types : grandes entreprises (banques, assurances, retail, industrie)',
    'Modèle de licence : online (cloud) et on-premise, licences par utilisateur ou par nœud',
  ]);
  h2(doc, 'Cas d\'usage principaux', C);
  bullet(doc, [
    'Préparation et transformation de données à grande échelle',
    'Développement et déploiement de modèles ML (prédiction, scoring, clustering)',
    'Automatisation de pipelines data (batch et temps réel)',
    'Reporting analytique et tableaux de bord via webapps',
    'Feature store et gouvernance des modèles',
    'Orchestration de workflows complexes multi-systèmes',
  ]);

  // ── 2. ARCHITECTURE ───────────────────────────────────────────────────────
  sectionTitle(doc, '2. Architecture technique', C);
  h2(doc, 'Composants principaux', C);
  h3(doc, 'DSS Server (backend Java)');
  bullet(doc, [
    'Serveur central qui orchestre tous les traitements',
    'Stocke les métadonnées, la configuration et les résultats',
    'Expose une API REST complète pour l\'automatisation externe',
  ]);
  h3(doc, 'Engines de calcul (back-ends)');
  bullet(doc, [
    'In-memory DSS (Python/Pandas) : par défaut, limité à la RAM du serveur',
    'In-database : pousse les calculs vers la base source (SQL, Snowflake, BigQuery, Redshift…)',
    'Spark : distribué, intégration native Spark 2/3, PySpark / SparkR / SparkSQL',
    'Hadoop / Hive / Impala : sur cluster HDFS, via YARN',
    'Kubernetes : exécution de containers Docker pour l\'isolation des workloads',
  ]);
  h3(doc, 'Storage');
  bullet(doc, [
    'Managed datasets : stockés sur le filesystem du serveur DSS',
    'External datasets : pointeurs vers des sources externes (S3, ADLS, GCS, HDFS, JDBC…)',
    'Feature store : couche de partage de features entre projets',
  ]);
  h2(doc, 'Déploiement et scaling', C);
  bullet(doc, [
    'Installation sur Linux (RHEL, Debian, Ubuntu) — pas de support Windows natif',
    'Architecture single-node (dev/test) ou multi-node avec clusters Spark/K8s',
    'API Node : nœud de déploiement séparé pour servir les modèles en production',
    'Automation Node : nœud dédié à l\'exécution des scénarios automatiques',
    'Design Node : nœud de développement interactif',
    'Séparation recommandée design / automation / API en prod',
  ]);

  // ── 3. CONCEPTS FONDAMENTAUX ─────────────────────────────────────────────
  sectionTitle(doc, '3. Concepts fondamentaux', C);
  h2(doc, 'Objets clés DSS', C);
  h3(doc, 'Project');
  bullet(doc, [
    'Unité organisationnelle principale — contient tous les objets d\'un cas d\'usage',
    'Isolation des permissions : un projet = un périmètre de sécurité',
    'Versioning via Git intégré (commit, push, pull, merge sur un projet entier)',
  ]);
  h3(doc, 'Dataset');
  bullet(doc, [
    'Représentation d\'une source de données (table SQL, fichier CSV, S3, API…)',
    'Chaque dataset a un schéma, des statistiques et une configuration de stockage',
    'Types : Filesystem (CSV, Parquet, ORC…), SQL (PostgreSQL, MySQL, Oracle…), Cloud (S3, GCS, ADLS), NoSQL (MongoDB, Elasticsearch, Cassandra), Streaming (Kafka, Kinesis)',
    'Managed vs External : managed = DSS gère le stockage, external = la source est externe',
  ]);
  h3(doc, 'Recipe');
  bullet(doc, [
    'Transformation entre datasets — c\'est le cœur du flow de traitement',
    'Deux familles : Visual (no-code/low-code) et Code (Python, R, SQL, Spark…)',
    'Chaque recette est reproductible, versionnable et schedulable',
  ]);
  h3(doc, 'Flow');
  bullet(doc, [
    'Représentation graphique DAG (Directed Acyclic Graph) des datasets et recettes',
    'Permet de visualiser les dépendances et l\'impact d\'un changement',
    'Recalcul partiel ou total (bouton "Build")',
    'Mécanisme de cache : si les inputs n\'ont pas changé, on ne recalcule pas',
  ]);
  h3(doc, 'Job');
  bullet(doc, [
    'Instance d\'exécution d\'un build de dataset ou de plusieurs datasets',
    'Log en temps réel, diagnostics d\'erreur, historique des exécutions',
    'Statuts : Running, Done, Failed, Aborted',
  ]);

  // ── 4. RECETTES ───────────────────────────────────────────────────────────
  sectionTitle(doc, '4. Recettes — Visual & Code', C);
  h2(doc, 'Recettes visuelles (Visual Recipes)', C);
  bullet(doc, [
    'Prepare : nettoyage et transformation colonne par colonne (200+ processeurs)',
    'Join : jointures entre datasets (inner, left, right, full, cross, fuzzy join)',
    'Group/Aggregate : agrégations (sum, count, avg, min, max, first, last, collect, percentile…)',
    'Window : fonctions fenêtre (lag, lead, rank, row_number, cumulative sum/avg)',
    'Stack : empilement vertical de datasets (UNION)',
    'Split : découpage d\'un dataset en plusieurs selon une condition ou un ratio',
    'Sampling : échantillonnage (aléatoire, stratifié, top N, premier/dernier N%)',
    'Sort : tri sur une ou plusieurs colonnes',
    'Distinct : dédoublonnage',
    'Top N : filtrage des N premières lignes selon un critère',
    'Pivot : transformation lignes en colonnes',
    'Unpivot : transformation colonnes en lignes',
    'Sync : copie d\'un dataset vers un autre format/stockage',
    'Download : téléchargement de données depuis une URL',
    'Upload : chargement de fichiers externes',
    'Export : export vers un système externe',
  ]);
  h2(doc, 'Recettes Code', C);
  bullet(doc, [
    'Python : Pandas, NumPy, Scikit-learn, etc. — accès aux datasets via l\'API DSS',
    'R : intégration tidyverse, data.table — accès aux datasets via library(dataiku)',
    'SQL : exécution de requêtes SQL dans la base cible (in-database)',
    'Scala : pour les workloads Spark avancés',
    'PySpark : Python sur Spark distribué',
    'SparkR : R sur Spark',
    'SparkSQL : SQL sur Spark',
    'Hive : requêtes HiveQL sur cluster Hadoop',
    'Impala : requêtes SQL sur HDFS via Impala',
    'Pig Latin : transformations Hadoop bas niveau',
    'Shell : scripts bash pour des opérations système',
    'Plugin recipes : recettes packagées via le système de plugins',
  ]);
  h2(doc, 'Recette Prepare — détail processeurs clés', C);
  bullet(doc, [
    'Rename / Delete columns : gestion du schéma',
    'Filter rows : filtrage avec conditions (égalité, regex, range, NULL)',
    'Formula : colonnes calculées (DSS formula language, très proche Excel)',
    'Geopoint : extraction lat/lon, géocodage',
    'Date parsing : extraction year, month, day, quarter, diff entre dates',
    'Text processing : split, concat, trim, upper/lower, replace, regex extract',
    'Type casting : conversion de types (string → int, date, etc.)',
    'Unfold / Fold : manipulation de listes/arrays',
    'Lookup : enrichissement par jointure simplifiée',
    'Flag / Category : encodage conditionnel',
    'Statistical functions : z-score, imputation de valeurs manquantes',
  ]);

  // ── 5. MACHINE LEARNING ──────────────────────────────────────────────────
  sectionTitle(doc, '5. Machine Learning & MLOps', C);
  h2(doc, 'Visual ML (AutoML)', C);
  body(doc, 'Interface point-and-click pour créer des modèles de prédiction, classification ou clustering sans écrire de code.');
  bullet(doc, [
    'Supervised : Classification binaire, multiclasse, Régression',
    'Unsupervised : Clustering (K-Means, DBSCAN, Gaussien)',
    'Anomaly detection (Isolation Forest, LOF)',
    'Computer vision, NLP (via deep learning — avec LLM extension)',
    'Sélection automatique d\'algorithmes : RF, XGBoost, LightGBM, Logistic Reg., SVM, Neural Net…',
    'Hyperparameter tuning : grid search, random search, Bayesian optimization',
    'Feature engineering automatique : interactions, encodage catégoriel, gestion des NaN',
  ]);
  h2(doc, 'Évaluation et comparaison de modèles', C);
  bullet(doc, [
    'Métriques classif : AUC-ROC, accuracy, F1, precision, recall, log-loss, calibration',
    'Métriques régression : RMSE, MAE, MAPE, R²',
    'Session de comparaison : benchmark entre plusieurs runs avec hyperparamètres différents',
    'Variables d\'importance (feature importance), SHAP values pour l\'explicabilité',
    'Matrice de confusion, courbe ROC, lift/gain charts',
    'Backtesting time-based pour les modèles temporels',
  ]);
  h2(doc, 'Déploiement et MLOps', C);
  bullet(doc, [
    'Model deployment sur API Node : REST endpoint pour scoring temps réel',
    'Batch scoring : dataset d\'entrée → dataset de sortie via recette de scoring',
    'Model lifecycle : Active, Archived, Champion/Challenger',
    'A/B testing entre deux versions de modèle',
    'Model monitoring : détection de dérive (data drift, concept drift)',
    'Retraining automatique via scénarios',
    'MLflow tracking intégré (métriques, artefacts, modèles)',
    'Export du modèle : pickle, PMML, ONNX',
    'Model documentation : génération automatique de rapport PDF',
  ]);
  h2(doc, 'Feature Store', C);
  bullet(doc, [
    'Partage de features entre projets DSS',
    'Calcul des features en amont, réutilisation downstream',
    'Point-in-time correct retrieval pour éviter le data leakage',
    'Gestion de la fraîcheur et versioning des features',
  ]);

  // ── 6. API DESIGNER & WEBAPPS ────────────────────────────────────────────
  sectionTitle(doc, '6. API Designer & Webapps', C);
  h2(doc, 'API Designer', C);
  bullet(doc, [
    'Création d\'API REST sans code ou via Python custom',
    'Types d\'endpoints : scoring (modèle), lookup (dataset), custom (Python)',
    'Authentification : API keys, JWT',
    'Déploiement sur API Node avec load balancing',
    'Monitoring des appels : latence, volume, erreurs',
    'Rate limiting et quotas configurables',
    'Swagger/OpenAPI documentation auto-générée',
  ]);
  h2(doc, 'Webapps', C);
  bullet(doc, [
    'Bokeh : graphiques Python interactifs dans le navigateur',
    'Dash (Plotly) : dashboards Python réactifs',
    'Shiny : dashboards R interactifs',
    'HTML/JS : pages web full custom intégrées dans DSS',
    'Accès aux datasets DSS depuis les webapps via l\'API Python/JS',
    'Authentification DSS héritée dans les webapps',
    'Déploiement sur Data Science Studio et/ou URL publique',
  ]);

  // ── 7. AUTOMATION (SCÉNARIOS) ────────────────────────────────────────────
  sectionTitle(doc, '7. Automatisation — Scenarios', C);
  h2(doc, 'Scénarios', C);
  body(doc, 'Les scénarios permettent d\'automatiser des workflows complets : rebuild de datasets, retraining de modèles, envoi de notifications, exécution de code personnalisé.');
  h3(doc, 'Déclencheurs (Triggers)');
  bullet(doc, [
    'Temporel : cron-like (ex: tous les jours à 6h, chaque lundi à 8h)',
    'Manuel : déclenchement à la demande via UI ou API',
    'Détection de fichier : dès qu\'un nouveau fichier arrive sur S3, HDFS, etc.',
    'Résultat de scénario : chaînage de scénarios',
    'Signal SQL : quand une requête SQL renvoie un résultat > 0',
    'Dataset modified : quand un dataset upstream a été modifié',
    'Webhook : appel HTTP entrant depuis un système externe',
  ]);
  h3(doc, 'Étapes (Steps)');
  bullet(doc, [
    'Build dataset(s) : recalcul d\'un ou plusieurs datasets',
    'Train model : retraining automatique d\'un modèle',
    'Deploy model : déploiement d\'une nouvelle version',
    'Run scenario : appel d\'un autre scénario',
    'Python script step : code Python arbitraire',
    'Send message : email, Slack, Teams, webhook sortant',
    'Set variables : mise à jour de variables DSS',
    'Export dataset : vers un système externe',
    'If/else : branchement conditionnel',
    'Abort if : arrêt conditionnel du scénario',
    'Compute metrics : calcul de métriques sur un dataset',
    'Checks : assertions sur les métriques (ex: completeness > 95%)',
  ]);
  h2(doc, 'Monitoring & Alertes', C);
  bullet(doc, [
    'Métriques de dataset : completeness, distinctness, stats descriptives',
    'Checks : seuils d\'alerte (green/yellow/red) sur les métriques',
    'Dashboards de monitoring : vue agrégée des checks sur tous les datasets',
    'Alertes email / Slack en cas d\'échec de scénario ou de check',
  ]);

  // ── 8. PLUGINS ───────────────────────────────────────────────────────────
  sectionTitle(doc, '8. Plugins & Extensions', C);
  h2(doc, 'Plugin Hub', C);
  bullet(doc, [
    'Bibliothèque de +100 plugins officiels et communautaires',
    'Exemples : Geocoder, Fuzzy Join, Excel Export, SMTP Sender, Slack, Jira, SAP…',
    'Installation en 1 clic depuis l\'interface DSS Admin',
    'Chaque plugin peut ajouter des recettes, connecteurs, processeurs Prepare, macros',
  ]);
  h2(doc, 'Développement de plugins custom', C);
  bullet(doc, [
    'Structure : plugin.json + dossier de code Python/Java',
    'Types d\'extensions possibles : recipe, connector, processor, webapp, macro, format',
    'Développement en Python (le plus courant) ou Java',
    'Packaging : zip uploadable ou déployable via Git',
    'Tests unitaires avec le framework de test DSS plugin',
    'Paramétrage : formulaires dynamiques définis en JSON',
  ]);
  h2(doc, 'Code Environments (Code Envs)', C);
  bullet(doc, [
    'Environnements Python/R isolés par projet ou partagés',
    'Gestion des dépendances pip/conda indépendante du système',
    'Containérisé : chaque code env peut être un container Docker',
    'Essentiel pour la reproductibilité et la gestion des conflits de versions',
  ]);

  // ── 9. COLLABORATION & GOUVERNANCE ───────────────────────────────────────
  sectionTitle(doc, '9. Collaboration & Gouvernance', C);
  h2(doc, 'Permissions et sécurité', C);
  bullet(doc, [
    'Niveaux de permission : Admin, Reader, Writer, Manager par projet',
    'Groupes d\'utilisateurs : LDAP/AD intégration pour gestion SSO',
    'Row-level security sur les datasets (filtrage par utilisateur)',
    'Column-level masking : masquage de colonnes sensibles',
    'Audit log : traçabilité de toutes les actions utilisateur',
    'Data catalog : inventaire et description des données accessibles',
  ]);
  h2(doc, 'Versioning & Git', C);
  bullet(doc, [
    'Intégration Git native : chaque projet = un dépôt Git',
    'Commit, push, pull, merge depuis l\'interface DSS',
    'Branches : travail parallèle sur une même base de code',
    'Diff visuel des changements sur les recettes et la configuration',
    'Déploiement "infra as code" : tout le projet est versionnable',
  ]);
  h2(doc, 'Collaboration temps réel', C);
  bullet(doc, [
    'Commentaires sur les objets (datasets, recettes, modèles, scénarios)',
    'Tags et labels pour organiser les objets',
    'Activity feed : journal des modifications du projet',
    'Notifications : alertes in-app et email sur les changements',
  ]);

  // ── 10. ADMINISTRATION ───────────────────────────────────────────────────
  sectionTitle(doc, '10. Administration DSS', C);
  h2(doc, 'Connexions (Connections)', C);
  bullet(doc, [
    'SQL : PostgreSQL, MySQL, Oracle, SQL Server, Teradata, Vertica, Greenplum, DB2',
    'Cloud data warehouses : Snowflake, BigQuery, Redshift, Synapse, Databricks',
    'Object storage : S3, Azure Blob (ADLS), GCS, OVH Object Storage',
    'HDFS / Hadoop : Cloudera, Hortonworks, EMR, HDInsight',
    'NoSQL : MongoDB, Cassandra, Elasticsearch, DynamoDB',
    'Messaging : Kafka, Kinesis',
    'SaaS : Salesforce, HubSpot, Google Analytics (via plugins)',
    'JDBC générique : tout driver JDBC',
  ]);
  h2(doc, 'Gestion des clusters', C);
  bullet(doc, [
    'Cluster statique : cluster Spark/Hadoop toujours allumé, défini manuellement',
    'Cluster dynamique (EKS, GKE, AKS, EMR, Dataproc) : créé à la demande, détruit après job',
    'Kubernetes : déploiement de workloads dans des pods isolés',
    'Configuration Spark : memory, cores, shuffle partitions, adaptive query execution',
    'Définition de profils d\'exécution : chaque recette peut utiliser un profil différent',
  ]);
  h2(doc, 'Monitoring serveur', C);
  bullet(doc, [
    'Diagnostics intégrés : santé du serveur, espace disque, RAM, CPU',
    'Logs centralisés : backend.log, frontend.log, et logs par job',
    'Intégration Prometheus / Grafana pour monitoring externalisé',
    'API de status : endpoint REST pour supervision externe',
  ]);

  // ── 11. PERFORMANCE & PARTITIONNEMENT ────────────────────────────────────
  sectionTitle(doc, '11. Performance & Partitionnement', C);
  h2(doc, 'Partitionnement', C);
  body(doc, 'Le partitionnement découpe un dataset en sous-ensembles logiques. C\'est un levier clé pour traiter de gros volumes efficacement.');
  bullet(doc, [
    'Dimensions de partitionnement : date (year/month/day/hour), string discret, integer range',
    'Partitionnement temporel : très courant sur les données transactionnelles',
    'Chaînage : si A est partitionné, la recette A→B peut partitionner B avec la même logique',
    'Rebuild partiel : reconstruire seulement les partitions modifiées',
    'Dépendances entre partitions : ex. "construire le mois M en utilisant M-1"',
    'Propagation automatique dans le flow : DSS propage les schémas de partitionnement',
    'Bénéfices : réduction des temps de calcul, parallélisation, gestion des données fraîches',
  ]);
  h2(doc, 'Optimisation in-database', C);
  bullet(doc, [
    'Préférer les recettes SQL sur des sources JDBC : pas de transfert de données',
    'Push-down computation : DSS génère du SQL natif pour la BDD cible',
    'Éviter de "matérialiser" des datasets intermédiaires inutiles dans DSS',
    'Utiliser les index et partitions de la base cible',
  ]);
  h2(doc, 'Optimisation Spark', C);
  bullet(doc, [
    'Broadcast join pour les petites tables (spark.sql.autoBroadcastJoinThreshold)',
    'Ajuster le nombre de partitions Spark (spark.sql.shuffle.partitions)',
    'Activer l\'Adaptive Query Execution (AQE) — Spark 3.x',
    'Persister les datasets intermédiaires coûteux',
    'Éviter les UDF Python sur Spark (préférer les fonctions natives)',
    'Utiliser Parquet/ORC comme format de stockage intermédiaire',
  ]);

  // ── 12. BONNES PRATIQUES ─────────────────────────────────────────────────
  sectionTitle(doc, '12. Bonnes pratiques', C);
  h2(doc, 'Organisation du flow', C);
  bullet(doc, [
    'Zone Architecture : Discovery → Preparation → Modeling → Serving',
    'Nommer les datasets avec un préfixe de zone : raw_, prep_, feat_, out_',
    'Limiter la profondeur du flow (max 7-8 niveaux) pour la lisibilité',
    'Utiliser les zones DSS pour compartimenter visuellement le flow',
    'Documenter les datasets et recettes avec des descriptions claires',
    'Toujours taguer les datasets "source of truth" vs "temporaires"',
  ]);
  h2(doc, 'Code et reproductibilité', C);
  bullet(doc, [
    'Toujours utiliser des Code Environments — jamais le système Python',
    'Commiter régulièrement dans Git avec des messages de commit clairs',
    'Externaliser les paramètres (variables DSS, secrets vault) — pas de hardcoding',
    'Écrire des tests sur les données (métriques + checks) pour valider la qualité',
    'Préférer les recettes Visual quand elles suffisent (plus maintenables)',
    'Pour le ML : documenter les choix de features, algorithmes et métriques cibles',
  ]);
  h2(doc, 'Production et MLOps', C);
  bullet(doc, [
    'Séparer les nœuds Design / Automation / API en production',
    'Versionner les modèles avant tout déploiement',
    'Mettre en place des checks de données à chaque étape critique',
    'Monitorer la dérive des données et des prédictions en production',
    'Prévoir un processus de rollback en cas de dégradation du modèle',
    'Documenter les modèles avec la génération de rapport DSS',
  ]);

  // ── 13. ERREURS FRÉQUENTES ───────────────────────────────────────────────
  sectionTitle(doc, '13. Erreurs fréquentes', C);
  h2(doc, 'Erreurs de débutants', C);
  bullet(doc, [
    'Ne pas utiliser de Code Environment → conflits de librairies, non-reproductibilité',
    'Oublier de commiter dans Git → perte de travail, impossible de revenir en arrière',
    'Utiliser des chemins absolus dans le code → problème lors du changement de serveur',
    'Hardcoder des credentials dans les recettes Python → faille de sécurité majeure',
    'Matérialiser trop de datasets intermédiaires → consommation de stockage excessive',
    'Ignorer les types de données dans le schéma → erreurs silencieuses downstream',
  ]);
  h2(doc, 'Erreurs de performance', C);
  bullet(doc, [
    'Utiliser le back-end DSS (Pandas) sur des volumes > 100M lignes → OOM',
    'Ne pas partitionner les datasets temporels → rebuild complet à chaque exécution',
    'Trop de shuffle Spark (jointures sur clés non partitionnées) → temps de calcul élevé',
    'Charger tout un dataset Spark en mémoire Python (toPandas()) → crash mémoire',
    'Ne pas configurer la taille des exécuteurs Spark → sous-utilisation ou OOM',
    'Boucles Python sur des datasets Spark au lieu de transformations natives',
  ]);
  h2(doc, 'Erreurs MLOps', C);
  bullet(doc, [
    'Déployer un modèle sans monitoring → dérive non détectée',
    'Data leakage : features calculées avec des données futures → métriques trop optimistes',
    'Ne pas versionner les modèles avant de redéployer → impossible de rollback',
    'Séparer train/test sur des données temporelles sans tenir compte du temps',
    'Oublier de normaliser les features numériques pour les modèles linéaires/SVM',
    'Ne pas gérer les valeurs manquantes → erreurs de scoring en production',
    'Évaluer uniquement sur AUC sans regarder la calibration → mauvais score de probabilité',
  ]);
  h2(doc, 'Erreurs d\'administration', C);
  bullet(doc, [
    'Donner des droits Admin à tous les utilisateurs → risque de sécurité',
    'Ne pas configurer de connexion partagée → chaque user a ses propres credentials',
    'Ignorer l\'espace disque sur le nœud DSS → pannes en production',
    'Ne pas séparer les nœuds Design/Automation → contention de ressources',
    'Oublier de configurer les backups du répertoire de données DSS',
  ]);

  // ── 14. PITCH CLIENT ─────────────────────────────────────────────────────
  sectionTitle(doc, '14. Éléments de pitch client', C);
  h2(doc, 'Problèmes résolus par Dataiku', C);
  bullet(doc, [
    '"Nos data scientists passent 80% de leur temps à préparer les données" → Dataiku accélère la préparation x3 à x10',
    '"Les modèles ML restent dans des notebooks, jamais en production" → MLOps intégré : déploiement en quelques clics',
    '"Les équipes data et métier ne se comprennent pas" → Interface visuelle accessible aux non-développeurs',
    '"Impossible de tracer qui a fait quoi sur nos données" → Audit log, Git, data lineage complet',
    '"Nos pipelines de données sont fragiles et non documentés" → Flow visuel, métriques de qualité, scénarios',
  ]);
  h2(doc, 'ROI et métriques clés', C);
  bullet(doc, [
    'Réduction du time-to-market des modèles ML : de 6-12 mois à 4-6 semaines',
    'Réduction du coût de maintenance des pipelines : moins de code custom à maintenir',
    'Collaboration : un seul outil pour data engineers, data scientists et analystes',
    'Gouvernance : conformité RGPD facilitée (lineage, masquage, audit)',
    'Scalabilité : du poste de travail au cluster Spark distribué, même interface',
  ]);
  h2(doc, 'Objections courantes et réponses', C);
  bullet(doc, [
    '"C\'est trop cher" → Comparer le coût de licences vs coût de développement custom + maintenance',
    '"On peut faire ça avec Python/Jupyter" → Gouvernance, collaboration, MLOps, partage : impossible sans plateforme',
    '"Notre SI est trop complexe" → Connecteurs natifs pour 50+ sources, API REST pour le reste',
    '"On est déjà sur Azure ML / AWS Sagemaker" → Dataiku peut s\'intégrer ET orchestrer ces plateformes',
    '"Comment savoir que les modèles fonctionnent encore ?" → Monitoring et alertes de dérive intégrés',
  ]);

  // ── 15. QUESTIONS D'ENTRETIEN ────────────────────────────────────────────
  sectionTitle(doc, '15. Questions d\'entretien technique', C);
  h2(doc, 'Questions fondamentales', C);
  bullet(doc, [
    'Quelle est la différence entre un dataset managed et un dataset external dans DSS ?',
    'Expliquez le concept de back-end d\'exécution dans Dataiku. Quand utiliser Spark vs in-database ?',
    'Comment fonctionne le partitionnement dans DSS ? Donnez un exemple concret.',
    'Quelle est la différence entre une recette Python et une recette PySpark ?',
    'Comment gérez-vous les dépendances Python dans Dataiku en production ?',
  ]);
  h2(doc, 'Questions MLOps', C);
  bullet(doc, [
    'Comment déployez-vous un modèle ML en production avec Dataiku ?',
    'Expliquez le concept de Champion/Challenger dans DSS. Comment l\'implémentez-vous ?',
    'Comment détectez-vous la dérive d\'un modèle en production ?',
    'Qu\'est-ce que le Feature Store dans Dataiku et pourquoi l\'utiliser ?',
    'Comment évitez-vous le data leakage lors de la création d\'un modèle ML ?',
  ]);
  h2(doc, 'Questions architecture/admin', C);
  bullet(doc, [
    'Quelle est la différence entre un Design Node, un Automation Node et un API Node ?',
    'Comment organisez-vous les permissions dans un projet multi-équipes ?',
    'Comment intégrez-vous Git dans un workflow DSS en production ?',
    'Quels sont les leviers de performance pour traiter 10 milliards de lignes dans DSS ?',
    'Comment configurez-vous un cluster Spark dynamique dans DSS ?',
  ]);
  h2(doc, 'Questions scénarios et automatisation', C);
  bullet(doc, [
    'Comment construiriez-vous un pipeline de retraining automatique quotidien ?',
    'Comment chaînez-vous plusieurs scénarios dans DSS ?',
    'Quels types de triggers utilisez-vous pour déclencher un scénario en production ?',
    'Comment mettez-vous en place des alertes sur la qualité des données ?',
    'Comment orchestrez-vous Dataiku avec un outil externe (Airflow, Azure Data Factory) ?',
  ]);

  pageNumbers(doc);
  doc.end();
  return new Promise(resolve => stream.on('finish', resolve));
}

// ═══════════════════════════════════════════════════════════════════════════
//  FICHE 2 — SAS VIYA
// ═══════════════════════════════════════════════════════════════════════════

function buildSASViya() {
  const doc = newDoc();
  const C = '#003366';
  const stream = fs.createWriteStream(path.join(OUTPUT_DIR, 'Fiche_Expert_SAS_Viya.pdf'));
  doc.pipe(stream);

  // COVER
  coverPage(doc, 'SAS VIYA', 'Guide Expert — Compétences & Fonctionnalités', C);

  // ── 1. VUE D'ENSEMBLE ────────────────────────────────────────────────────
  sectionTitle(doc, '1. Vue d\'ensemble', C);
  body(doc, 'SAS Viya est la plateforme analytique cloud-native de SAS Institute. Elle modernise l\'écosystème SAS traditionnel avec une architecture microservices, un moteur in-memory distribué (CAS), et des interfaces modernes pour l\'analyse, la data science et l\'IA. SAS Viya 4 (version actuelle) est déployable sur Kubernetes (OpenShift, GKE, AKS, EKS).');
  doc.moveDown(0.5);
  h2(doc, 'Positionnement marché', C);
  bullet(doc, [
    'Leader historique en analytique entreprise (secteurs : banque, assurance, gouvernement, santé)',
    'Concurrent direct : Dataiku, Azure ML, Databricks, AWS Sagemaker, Palantir',
    'Force principale : SAS language mûr, conformité réglementaire, richesse statistique',
    'Transition SAS 9.4 → Viya : migration des bases installées vers le cloud',
    'Modèle de licence : SAS Cloud (SaaS), on-premise Kubernetes, partenariat AWS/Azure/GCP',
  ]);
  h2(doc, 'Cas d\'usage principaux', C);
  bullet(doc, [
    'Reporting réglementaire (IFRS 9, BCBS 239, ESG/Taxonomie, Pilier 3)',
    'Scoring de risque crédit, assurance, fraude',
    'Prévision et optimisation (time series, supply chain)',
    'Segmentation client et analyse comportementale',
    'Gouvernance des modèles ML en production (Model Manager)',
    'Décisionnel automatisé (Intelligent Decisioning)',
    'Qualité et gestion des données maîtres (MDM)',
  ]);

  // ── 2. ARCHITECTURE ───────────────────────────────────────────────────────
  sectionTitle(doc, '2. Architecture technique SAS Viya 4', C);
  h2(doc, 'Vue d\'ensemble de l\'architecture', C);
  body(doc, 'SAS Viya 4 repose sur une architecture microservices déployée sur Kubernetes. Chaque composant est un service indépendant qui communique via API REST. Le moteur de calcul central est CAS (Cloud Analytic Services).');
  h3(doc, 'Couches principales');
  bullet(doc, [
    'Interface utilisateur : SAS Studio, SAS Drive, SAS Visual Analytics, SAS Model Manager',
    'API Layer : SAS Viya REST APIs (OpenAPI 3.0) — orchestration de tous les services',
    'Compute Layer : SAS Compute Server (sessions SAS classiques) + CAS (in-memory distribué)',
    'Data Layer : connexions aux sources (JDBC, ODBC, Cloud, HDFS, REST APIs)',
    'Infrastructure : Kubernetes (pods, services, ingress) + stockage persistant',
  ]);
  h2(doc, 'CAS — Cloud Analytic Services', C);
  body(doc, 'CAS est le moteur de calcul in-memory distribué de SAS Viya. C\'est son composant le plus stratégique.');
  h3(doc, 'Architecture CAS');
  bullet(doc, [
    'Architecture SMP (Symmetric MultiProcessing) ou MPP (Massively Parallel Processing)',
    'CAS Controller : nœud maître qui orchestre les workers',
    'CAS Workers : nœuds de calcul qui stockent et traitent les données en mémoire',
    'Tables CAS : données chargées en RAM, distribuées sur les workers (partitionnées par blocs)',
    'Sessions CAS : contexte de connexion pour chaque utilisateur ou application',
  ]);
  h3(doc, 'Caractéristiques CAS');
  bullet(doc, [
    'In-memory : toutes les tables actives sont en RAM → latence très faible',
    'Distribué : les tables sont découpées en blocks répartis sur les workers',
    'Columnaire : stockage orienté colonnes pour une compression et une lecture efficace',
    'ACID partiel : transactions sur les tables CAS (append, update, delete)',
    'Persistence : tables en mémoire (volatiles) vs tables sauvegardées sur CASLIB',
    'Promotion : tables promues partagées entre toutes les sessions',
  ]);
  h2(doc, 'SAS Compute Server', C);
  bullet(doc, [
    'Moteur SAS traditionnel (SAS 9 compatible) pour les programmes DATA step et PROC',
    'Exécution dans des sessions isolées (pods Kubernetes éphémères)',
    'Accès aux CASLIBS et aux librairies SAS classiques',
    'Connexion native à CAS : PROC CAS, libname CAS',
    'Interopérabilité avec le code SAS existant (SAS 9.4 → Viya sans réécriture)',
  ]);

  // ── 3. SAS STUDIO ────────────────────────────────────────────────────────
  sectionTitle(doc, '3. SAS Studio', C);
  h2(doc, 'Interface de développement', C);
  body(doc, 'SAS Studio est l\'IDE web de SAS Viya. Il remplace SAS Enterprise Guide pour le développement code et propose également une interface visuelle (Flows).');
  h3(doc, 'Fonctionnalités principales');
  bullet(doc, [
    'Éditeur de code SAS avec autocomplétion, coloration syntaxique, formatage',
    'Explorer : navigation dans les librairies, tables, fichiers',
    'Results pane : visualisation des résultats log + output',
    'Tasks : assistants point-and-click pour les procédures statistiques courantes',
    'Snippets : bibliothèque de bouts de code réutilisables',
    'Shared content : dossiers partagés entre utilisateurs',
    'Git integration : versioning du code SAS depuis l\'interface',
  ]);
  h2(doc, 'Flows (Flux de données visuels)', C);
  bullet(doc, [
    'Interface drag-and-drop similaire au Flow de Dataiku',
    'Nœuds disponibles : Input data, Transformation, Output data, ML, Query',
    'Transformation visuelle sans code (équivalent Prepare de Dataiku)',
    'Connexion à des actions CAS pour les traitements distribués',
    'Scheduling via SAS Job Execution Service',
    'Export en code SAS généré automatiquement',
  ]);
  h2(doc, 'Langage SAS — Fondamentaux', C);
  h3(doc, 'DATA Step');
  bullet(doc, [
    'Lecture/écriture de datasets SAS, transformations ligne par ligne',
    'Opérations : INPUT, OUTPUT, SET, MERGE, UPDATE, MODIFY',
    'Fonctions : caractère (substr, index, upcase), numérique (round, int, abs), date (datepart, intnx)',
    'Arrays : traitement de groupes de variables',
    'Boucles DO/END, conditions IF/THEN/ELSE, SELECT/WHEN',
    'Hash objects : jointures ultra-rapides en mémoire',
    'BY processing : traitement par groupe après tri',
  ]);
  h3(doc, 'PROC SQL');
  bullet(doc, [
    'SQL complet avec extensions SAS (PROC SQL)',
    'Macro variables dans SQL : %let var = ...; SELECT &var. FROM...',
    'Création de tables : CREATE TABLE AS SELECT',
    'Jointures, sous-requêtes, fonctions fenêtre (PROC SQL 9.4+)',
    'CONNECT TO : SQL pass-through vers les bases externes',
    'REFLECT : récupération du schéma d\'une table externe',
  ]);
  h3(doc, 'Macro Language');
  bullet(doc, [
    'Génération dynamique de code SAS : %macro / %mend',
    'Variables macro : %let, &var., &var',
    'Conditions macro : %if %then %do / %else %do',
    'Boucles macro : %do i = 1 %to N',
    'Appel de macro : %nom_macro(param1, param2)',
    'Macros autocall : bibliothèques de macros partagées',
    'Fonctions %sysfunc, %scan, %substr, %upcase, %eval',
    '%include : inclusion de fichiers SAS externes',
  ]);

  // ── 4. SAS VISUAL ANALYTICS ───────────────────────────────────────────────
  sectionTitle(doc, '4. SAS Visual Analytics', C);
  h2(doc, 'Présentation', C);
  body(doc, 'SAS Visual Analytics (VA) est l\'outil de reporting et d\'exploration de données de SAS Viya. Il permet de créer des rapports interactifs, des tableaux de bord et des visualisations avancées sans code.');
  h2(doc, 'Fonctionnalités clés', C);
  bullet(doc, [
    'Exploration auto : analyse descriptive automatique d\'une table CAS',
    'Rapports interactifs : drag-and-drop d\'objets visuels sur un canevas',
    'Objets visuels : graphiques (bar, line, scatter, heatmap, treemap, geo, boxplot, waterfall…)',
    'Filtres dynamiques : contrôles (slider, listbox, text input) liés aux visuels',
    'Actions : drill-down, filter, link between reports, go to URL',
    'Données calculées : mesures agrégées, colonnes calculées, hierarchies',
    'Paramètres : variables dynamiques pilotant les requêtes',
    'Mobile : rapports responsives pour smartphones/tablettes',
    'Export : PDF, PowerPoint, Excel, PNG',
    'Scheduling : envoi automatique par email à intervalle régulier',
    'Commenting & Annotations : collaboration sur les rapports',
  ]);
  h2(doc, 'Sources de données', C);
  bullet(doc, [
    'Tables CAS (principal) : données in-memory haute performance',
    'SAS datasets sur CASLIB : chargement automatique dans CAS',
    'Sources JDBC/ODBC : connexion directe sans chargement CAS',
    'Google Analytics, Salesforce, etc. via connecteurs',
    'Données géospatiales : shapefiles, lat/lon, geo-encoding',
  ]);
  h2(doc, 'Bonnes pratiques VA', C);
  bullet(doc, [
    'Pré-agréger les données dans CAS avant de les exposer dans VA pour les gros volumes',
    'Utiliser les mesures plutôt que les colonnes calculées pour les perfs',
    'Limiter le nombre d\'objets par page (max 8-10) pour la lisibilité',
    'Tester les rapports sur mobile si la cible inclut des utilisateurs mobiles',
    'Nommer clairement les mesures et dimensions (noms métier, pas techniques)',
  ]);

  // ── 5. MACHINE LEARNING — SAS MODEL STUDIO ────────────────────────────────
  sectionTitle(doc, '5. Machine Learning — SAS Model Studio', C);
  h2(doc, 'SAS Model Studio (Visual Data Mining & ML)', C);
  body(doc, 'SAS Model Studio est l\'interface visuelle pour construire des pipelines ML complets dans SAS Viya. Il orchestre les traitements CAS pour l\'apprentissage automatique.');
  h2(doc, 'Types de projets', C);
  bullet(doc, [
    'Régression : prédiction de valeurs continues (ex: scoring de risque crédit)',
    'Classification binaire : oui/non (ex: défaut, fraude, churn)',
    'Classification multiclasse',
    'Clustering : segmentation non supervisée (K-Means, SOM…)',
    'Prévision de séries temporelles (ARIMA, Prophet, ESM, UCM…)',
    'Survival analysis : modélisation de la durée jusqu\'à un événement',
    'Text mining : extraction de topics, sentiment, classification de texte',
  ]);
  h2(doc, 'Pipeline AutoML', C);
  bullet(doc, [
    'Data exploration automatique : statistiques descriptives, distribution, corrélations',
    'Imputation des valeurs manquantes : mean, median, mode, model-based',
    'Encodage des variables catégorielles : one-hot, target encoding, WoE',
    'Réduction de dimension : PCA, feature selection (Gini, IV, corrélation)',
    'Entraînement simultané de multiples algorithmes',
    'Comparaison de modèles sur des métriques standardisées',
    'Champion selection automatique selon le critère choisi',
    'Génération de score code SAS/Python pour le déploiement',
  ]);
  h2(doc, 'Algorithmes disponibles', C);
  bullet(doc, [
    'Arbres : Decision Tree, Random Forest, Gradient Boosting (SAS GBDT)',
    'Linéaires : Logistic Regression, Linear Regression, LASSO, Ridge, ElasticNet',
    'SVM : Support Vector Machine (classification et régression)',
    'Neural Networks : MLP, RNN, LSTM, CNN (via SAS DLPy)',
    'Clustering : K-Means, SOM (Self-Organizing Maps), DBSCAN',
    'Bayésien : Naive Bayes',
    'Ensemble : Stacking, Blending',
    'NLP : Topics (LDA), Text classification, Sentiment',
    'Computer Vision : ResNet, VGG, InceptionV3 (via DLPy)',
  ]);

  // ── 6. SAS MODEL MANAGER ─────────────────────────────────────────────────
  sectionTitle(doc, '6. SAS Model Manager', C);
  h2(doc, 'Rôle et positionnement', C);
  body(doc, 'SAS Model Manager est le centre de gouvernance des modèles ML de SAS Viya. Il gère le cycle de vie complet des modèles : enregistrement, validation, déploiement, monitoring et retrait.');
  h2(doc, 'Cycle de vie d\'un modèle', C);
  bullet(doc, [
    '1. Développement : création du modèle dans SAS Model Studio, Python, R, ou autre',
    '2. Enregistrement : import du modèle dans Model Manager (SAS, Python, R, PMML, ONNX)',
    '3. Validation : tests de performance, comparaison avec le champion actuel',
    '4. Approbation (workflow) : circuit de validation métier / risque avant production',
    '5. Déploiement : publication vers CAS (scoring batch) ou API REST (scoring temps réel)',
    '6. Monitoring : suivi des performances en production (dérive, PSI, KS, Gini)',
    '7. Retraining ou retrait : décision basée sur les indicateurs de monitoring',
  ]);
  h2(doc, 'Fonctionnalités clés', C);
  bullet(doc, [
    'Model repository : inventaire centralisé de tous les modèles',
    'Versioning : historique de toutes les versions d\'un même modèle',
    'Metadata : description, propriétaire, périmètre, date, performances attendues',
    'Champion/Challenger : comparaison live entre deux modèles en production',
    'Score code : génération et publication du code de scoring (SAS, Python, DS2)',
    'Scoring destinations : CAS table, MAS (Micro Analytic Service), SAS Decisioning',
    'Performance monitoring : métriques de dérive sur données de production',
    'Alertes : notifications quand les indicateurs passent des seuils',
    'Audit trail : qui a fait quoi sur quel modèle, quand',
    'Integration API : pipeline CI/CD via REST APIs',
  ]);
  h2(doc, 'MAS — Micro Analytic Service', C);
  bullet(doc, [
    'Service de scoring temps réel (latence < 10ms) pour les décisions en ligne',
    'Exécution du score code SAS DS2 ou Python dans un microservice dédié',
    'Utilisé pour : scoring fraude temps réel, éligibilité crédit en ligne, recommandation',
    'Scalable horizontalement via Kubernetes',
    'Intégré avec SAS Intelligent Decisioning',
  ]);

  // ── 7. SAS INTELLIGENT DECISIONING ──────────────────────────────────────
  sectionTitle(doc, '7. SAS Intelligent Decisioning', C);
  h2(doc, 'Présentation', C);
  body(doc, 'SAS Intelligent Decisioning (ID) permet d\'automatiser des décisions métier complexes en combinant règles métier, modèles ML, et traitements analytiques dans un flux décisionnel orchestré.');
  h2(doc, 'Composants d\'une décision', C);
  bullet(doc, [
    'Business rules : règles IF/THEN codées dans un éditeur visuel ou tableur',
    'Model objects : intégration de modèles ML depuis Model Manager',
    'Condition nodes : branchements conditionnels dans le flux',
    'DS2 code nodes : traitement personnalisé en code SAS DS2',
    'Custom objects : appels à des services externes (REST)',
    'Treatments : actions déclenchées (offre, décision, message)',
  ]);
  h2(doc, 'Cas d\'usage typiques', C);
  bullet(doc, [
    'Attribution de crédit : combiner score ML + règles métier + règles réglementaires',
    'Détection de fraude temps réel : score fraude + règles de blocage',
    'Campagne marketing : éligibilité + ciblage + offre personnalisée',
    'Tarification dynamique : score risque + règles tarifaires',
    'Compliance : vérifications KYC/AML automatisées',
  ]);

  // ── 8. GESTION DES DONNÉES / CASLIBS ────────────────────────────────────
  sectionTitle(doc, '8. Gestion des données & CASLIBs', C);
  h2(doc, 'CASLIBs', C);
  body(doc, 'Un CASLIB est une connexion entre CAS et une source de données (filesystem, base de données, cloud). Il définit où CAS peut lire et écrire des tables.');
  bullet(doc, [
    'Types : Path (filesystem SAS), DNFS (NFS distribué), HDFS, S3, ADLS, GCS',
    'Types bases : JDBC (Oracle, PostgreSQL, MySQL…), Teradata, Snowflake, Redshift',
    'Scope : session (visible que par l\'utilisateur) ou global (partagé)',
    'Tables en mémoire vs on-disk : SAVE vs PROMOTE pour persister',
    'Permissions : accès lecture/écriture configurable par groupe',
  ]);
  h2(doc, 'Chargement de données dans CAS', C);
  bullet(doc, [
    'PROC CASUTIL : chargement de fichiers SAS7BDAT, CSV, Parquet, ORC dans CAS',
    'Libname CAS statement : connexion CASLIB depuis une session SAS',
    'DATA step avec output CAS : PROC CAS ou SET/OUTPUT sur une librairie CAS',
    'REST API : chargement via API pour les pipelines automatisés',
    'SAS Studio Flows : interface visuelle pour le chargement',
    'SAS Visual Analytics : import direct depuis l\'interface',
  ]);
  h2(doc, 'Data Management & Qualité', C);
  bullet(doc, [
    'SAS Data Quality (DQ) : standardisation, dédoublonnage, validation',
    'SAS Data Preparation : interface visuelle de préparation similaire à un ETL',
    'Lineage des données : traçabilité de la transformation de bout en bout',
    'PROC FREQ / PROC MEANS / PROC UNIVARIATE : statistiques descriptives standard',
    'Détection d\'outliers : PROC BOXPLOT, PROC ROBUSTREG',
    'Gestion des formats SAS : formats personnalisés pour l\'encodage des valeurs',
  ]);

  // ── 9. PROGRAMMATION SAS AVANCÉE ─────────────────────────────────────────
  sectionTitle(doc, '9. Programmation SAS avancée', C);
  h2(doc, 'CASL — CAS Action Language', C);
  body(doc, 'CASL est le langage natif pour piloter CAS. Il permet d\'exécuter des actions CAS et de manipuler les résultats en code.');
  bullet(doc, [
    'Syntaxe : proc cas; action.nom / parametre=valeur; run;',
    'Ou depuis Python/R : import swat; conn.action(\'nom.action\', param=valeur)',
    'Action sets : groupes d\'actions thématiques (table, regression, forest, textMining…)',
    'Résultats : retournés sous forme de dictionnaire (Python) ou de tableau SAS',
    'CASL depuis SAS : PROC CAS est l\'interface standard pour appeler des actions CAS',
  ]);
  h2(doc, 'Procédures statistiques clés', C);
  bullet(doc, [
    'PROC REG : régression linéaire classique',
    'PROC LOGISTIC : régression logistique, odds ratios, courbe ROC',
    'PROC GLM : modèles linéaires généraux',
    'PROC MIXED : modèles linéaires mixtes (effets aléatoires)',
    'PROC PHREG : modèle de Cox (survie)',
    'PROC ARIMA / PROC ESM / PROC UCM : prévision de séries temporelles',
    'PROC CLUSTER / PROC FASTCLUS : clustering hiérarchique et K-Means',
    'PROC PRINCOMP / PROC FACTOR : ACP et analyse factorielle',
    'PROC FREQ : tableaux de fréquences et tests du chi-deux',
    'PROC MEANS / PROC SUMMARY : statistiques descriptives',
    'PROC UNIVARIATE : distributions, tests de normalité',
    'PROC REPORT / PROC TABULATE : reporting formaté',
  ]);
  h2(doc, 'SAS Viya Python (SWAT)', C);
  bullet(doc, [
    'SWAT (SAS Wrapper for Analytics Transfer) : librairie Python pour piloter CAS',
    'import swat; conn = swat.CAS(host, port, user, password)',
    'Exécution d\'actions CAS depuis Python : conn.loadtable(), conn.summary(), etc.',
    'Résultats retournés comme DataFrames Pandas',
    'Compatible avec scikit-learn, matplotlib, seaborn pour les workflows hybrides',
    'Utilisation dans SAS Studio (Python kernel) ou Jupyter Notebook externe',
  ]);

  // ── 10. ADMINISTRATION ───────────────────────────────────────────────────
  sectionTitle(doc, '10. Administration SAS Viya', C);
  h2(doc, 'SAS Environment Manager', C);
  bullet(doc, [
    'Interface web d\'administration centralisée pour Viya',
    'Gestion des utilisateurs, groupes, rôles, permissions',
    'Monitoring des services : statut des microservices, logs, alertes',
    'Gestion des CASLIBs et connexions de données',
    'Quotas et gouvernance des ressources CAS',
    'Configuration des servers CAS (mémoire, workers, sessions max)',
  ]);
  h2(doc, 'Gestion des identités', C);
  bullet(doc, [
    'Authentification : LDAP, Active Directory, OAuth 2.0, SAML 2.0',
    'Groupes SAS : mappage depuis les groupes AD/LDAP',
    'Rôles : droits fonctionnels par application (VA, Model Manager, Studio…)',
    'Capabilities : permissions granulaires sur les fonctions de chaque produit',
    'Row-level security : filtres sur les données selon l\'identité de l\'utilisateur',
    'Column masking : masquage de colonnes sensibles selon le groupe',
  ]);
  h2(doc, 'Infrastructure Kubernetes', C);
  bullet(doc, [
    'Déploiement via Helm charts officiels SAS',
    'Namespaces Kubernetes : isolation des environnements (dev/test/prod)',
    'Persistent Volume Claims : stockage persistant pour CAS et les logs',
    'Resource quotas : CPU/RAM par namespace',
    'Ingress Controller : exposition des services web (NGINX, HAProxy)',
    'Secrets Kubernetes : gestion des credentials SAS Vault',
    'Monitoring : intégration Prometheus/Grafana pour les métriques K8s et CAS',
  ]);

  // ── 11. BONNES PRATIQUES ─────────────────────────────────────────────────
  sectionTitle(doc, '11. Bonnes pratiques', C);
  h2(doc, 'Performance et CAS', C);
  bullet(doc, [
    'Toujours charger les données dans CAS avant de les analyser — éviter les lectures disque répétées',
    'Utiliser PROC CASUTIL avec PROMOTE pour partager les tables entre sessions',
    'Préférer les actions CAS natives aux procédures SAS classiques sur de gros volumes',
    'Utiliser le partitionnement CAS pour les grandes tables (partition par date, région)',
    'Libérer les tables CAS après usage (DROPTABLE) pour libérer la mémoire',
    'Surveiller la mémoire CAS via SAS Environment Manager',
  ]);
  h2(doc, 'Code SAS', C);
  bullet(doc, [
    'Toujours utiliser des formats pour les variables catégorielles à cardinalité fixe',
    'Utiliser les macros pour factoriser le code répétitif',
    'Éviter les boucles DATA step sur des millions de lignes — préférer les traitements BY ou SQL',
    'Utiliser PROC SQL avec INOBS= pour tester sur un échantillon avant de lancer en prod',
    'Documenter les macros avec des commentaires en-tête (input, output, auteur, date)',
    'Stocker les macros réutilisables dans une bibliothèque AUTOCALL partagée',
  ]);
  h2(doc, 'MLOps et gouvernance des modèles', C);
  bullet(doc, [
    'Enregistrer tous les modèles dans Model Manager — même les modèles en développement',
    'Documenter chaque modèle : périmètre, données, métriques attendues, règles de retrait',
    'Mettre en place un workflow d\'approbation pour les modèles réglementés',
    'Monitorer systématiquement les modèles en production : PSI mensuel au minimum',
    'Conserver le code source et les données d\'entraînement pour l\'audit réglementaire',
    'Versionner le score code pour pouvoir rejouer un scoring historique',
  ]);

  // ── 12. ERREURS FRÉQUENTES ───────────────────────────────────────────────
  sectionTitle(doc, '12. Erreurs fréquentes', C);
  h2(doc, 'Erreurs de programmation SAS', C);
  bullet(doc, [
    'Oublier le point-virgule à la fin d\'une instruction → SAS attend la suite, pas d\'exécution',
    'PROC SORT sans OUT= → SAS trie la table en place, destruction des données originales',
    'Merge sans BY → jointure cartésienne silencieuse, explosion du volume',
    'Merge avec BY sans tri préalable → résultats incorrects (ou erreur si SORTEDBY= absent)',
    'Variable créée dans un IF sans ELSE → valeur manquante (.  ou " ") dans les autres cas',
    'Confondre =  (comparaison) et = (affectation) en DATA step — pas d\'erreur, comportement inattendu',
    'Format manquant sur une variable numérique catégorielle → mauvaise interprétation',
    'Dépasser la longueur d\'une variable caractère sans ATTRIB/LENGTH → troncature silencieuse',
  ]);
  h2(doc, 'Erreurs CAS', C);
  bullet(doc, [
    'Utiliser une librairie de session dans un job de scheduling → table invisible hors session',
    'Ne pas promouvoir une table nécessaire par d\'autres utilisateurs → "table not found"',
    'Charger en CAS une table de plusieurs dizaines de Go sans quota → crash OOM du cluster',
    'Modifier une table CAS promue en cours d\'utilisation → résultats incohérents pour les autres',
    'Oublier de libérer les sessions longues → saturation du nombre de sessions max',
    'Ne pas sauvegarder une table CAS avant un redémarrage → perte des données in-memory',
  ]);
  h2(doc, 'Erreurs Model Manager', C);
  bullet(doc, [
    'Enregistrer un modèle sans score code → impossible à déployer pour le scoring',
    'Oublier de renseigner les variables d\'entrée/sortie du modèle → erreur au déploiement',
    'Tester le champion/challenger sur les mêmes données d\'entraînement → overfitting non détecté',
    'Ne pas configurer le monitoring → dérive non détectée en production',
    'Déployer un nouveau modèle sans archiver l\'ancien → impossible de rollback',
    'Ignorer les alertes PSI → modèle dégradé utilisé en production des semaines sans action',
  ]);
  h2(doc, 'Erreurs d\'administration', C);
  bullet(doc, [
    'CASLIB global accessible à tous par défaut → exposition de données sensibles',
    'Négliger les Persistent Volumes → perte des données CAS lors d\'un redémarrage K8s',
    'Sous-dimensionner la mémoire CAS → jobs qui tombent par OOM en production',
    'Ne pas configurer le backup de l\'environnement SAS Viya → risque catastrophique',
    'Ignorer les logs d\'audit → impossible de retracer une modification réglementaire',
  ]);

  // ── 13. PITCH CLIENT ─────────────────────────────────────────────────────
  sectionTitle(doc, '13. Éléments de pitch client', C);
  h2(doc, 'Arguments différenciants SAS Viya', C);
  bullet(doc, [
    'Crédibilité réglementaire : SAS est la référence dans les banques, assurances et gouvernements',
    'Richesse statistique : 30+ ans de procédures validées scientifiquement',
    'Conformité et audit : traçabilité de bout en bout des modèles (exigences BCBS 239, SR 11-7)',
    'Performance CAS : in-memory distribué, facteur x10 à x100 vs SAS 9 traditionnel',
    'Migration SAS 9 → Viya : continuité du code existant, pas de réécriture totale',
    'Sécurité enterprise : row-level, column masking, SSO, audit trail natifs',
    'SAS Cloud Analytic Services : gestion de la mémoire plus fiable que Spark sur des jobs longs',
  ]);
  h2(doc, 'Scénarios de transformation client', C);
  bullet(doc, [
    '"Nous avons 15 ans de code SAS 9 impossible à migrer" → Viya exécute le code SAS 9 natif + ajout de nouvelles capacités',
    '"Notre équipe MLOps est inexistante" → Model Manager = gouvernance clés en main, approuvée par les régulateurs',
    '"Les décisions métier sont codées en dur dans du Java legacy" → Intelligent Decisioning = règles et modèles séparés, maintenables par les métiers',
    '"Nos reportings réglementaires prennent des semaines" → CAS in-memory réduit les temps de calcul de 90%',
    '"Nos data scientists utilisent Python mais nos modèles doivent être auditables" → SAS Viya supporte Python natif ET garantit la gouvernance SAS',
  ]);

  // ── 14. QUESTIONS D'ENTRETIEN ────────────────────────────────────────────
  sectionTitle(doc, '14. Questions d\'entretien technique', C);
  h2(doc, 'Questions fondamentales', C);
  bullet(doc, [
    'Quelle est la différence entre une table SAS classique (SAS7BDAT) et une table CAS ?',
    'Expliquez le fonctionnement du CAS : architecture, sessions, tables promues vs non promues.',
    'Quelle est la différence entre un CASLIB de session et un CASLIB global ?',
    'Comment chargez-vous un fichier CSV de 50 Go dans CAS efficacement ?',
    'Expliquez la différence entre PROC CAS et PROC SQL dans SAS Viya.',
  ]);
  h2(doc, 'Questions programmation SAS', C);
  bullet(doc, [
    'Quelle est la différence entre MERGE et SET dans un DATA step ? Quand utiliser l\'un ou l\'autre ?',
    'Comment utilisez-vous les hash objects pour optimiser une jointure dans un DATA step ?',
    'Expliquez le concept de formats SAS et leur utilité dans un projet de scoring.',
    'Comment créez-vous et appelez-vous une macro paramétrique en SAS ?',
    'Quelle est la différence entre %LET et CALL SYMPUT ?',
  ]);
  h2(doc, 'Questions MLOps et Model Manager', C);
  bullet(doc, [
    'Comment enregistrez-vous un modèle Python dans SAS Model Manager ?',
    'Expliquez le cycle de vie d\'un modèle dans SAS Model Manager.',
    'Qu\'est-ce que le PSI (Population Stability Index) et à partir de quel seuil agissez-vous ?',
    'Comment déployez-vous un modèle pour le scoring temps réel avec MAS ?',
    'Comment implémentez-vous un workflow Champion/Challenger dans SAS Viya ?',
  ]);
  h2(doc, 'Questions architecture et performance', C);
  bullet(doc, [
    'Quels sont les avantages du calcul in-memory CAS vs le traitement disque SAS 9 ?',
    'Comment optimisez-vous la performance d\'un chargement de table de 100 Go dans CAS ?',
    'Quelle est la différence entre SAS Compute Server et CAS ? Quand utiliser l\'un ou l\'autre ?',
    'Comment configurez-vous les partitions CAS pour optimiser les jointures ?',
    'Comment intégrez-vous SAS Viya avec Azure Data Factory ou Airflow ?',
  ]);
  h2(doc, 'Questions contexte réglementaire (ESG/banque)', C);
  bullet(doc, [
    'Comment SAS Viya répond-il aux exigences de traçabilité du BCBS 239 ?',
    'Comment garantissez-vous la reproductibilité d\'un calcul réglementaire dans SAS Viya ?',
    'Quelles fonctionnalités de SAS Model Manager sont pertinentes pour SR 11-7 / TRIM ?',
    'Comment implémentez-vous le contrôle d\'accès aux données sensibles ESG dans CAS ?',
    'Comment gérez-vous les versions de code SAS pour les reportings réglementaires annuels ?',
  ]);

  pageNumbers(doc);
  doc.end();
  return new Promise(resolve => stream.on('finish', resolve));
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Génération Fiche_Expert_Dataiku.pdf...');
  await buildDataiku();
  console.log('  → Fiche_Expert_Dataiku.pdf créé.');

  console.log('Génération Fiche_Expert_SAS_Viya.pdf...');
  await buildSASViya();
  console.log('  → Fiche_Expert_SAS_Viya.pdf créé.');

  console.log('Terminé.');
})();
