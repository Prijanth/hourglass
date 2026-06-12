# C'est quoi dbt ? Expliqué en 4 minutes
**Durée cible :** 4 min
**Description YouTube :** dbt (data build tool) est l'outil qui a révolutionné la façon de travailler avec SQL en data engineering. Dans cette vidéo, on explique en 4 minutes ce que c'est, pourquoi ça change tout pour les data analysts et engineers, et comment ça résout le problème du "SQL spaghetti" que tout le monde a vécu. On voit la différence entre avant et après dbt, avec un exemple concret. Si tu bosses avec des données et que tu n'as pas encore entendu parler de dbt, c'est le moment. Pour aller plus loin : datasphere.fr/outils/dbt-core
**Tags :** dbt, data build tool, sql, data engineering, data analyst, transformation de données, modern data stack, analytics engineering, tutorial français, datasphere

---
## SCRIPT

[00:00] INTRO (15s)
T'as déjà ouvert un projet SQL hérité et vu 47 fichiers nommés "final_v2_VRAI_final.sql" ? Personne sait ce que ça fait, personne ose y toucher. C'est le SQL spaghetti. Et dbt est la solution. Reste là, j'explique tout en 4 minutes.

[00:15] PARTIE 1 — Le problème : le SQL sans structure
Pendant longtemps, les data analysts écrivaient du SQL dans des outils comme DBeaver, Tableau, ou directement dans l'entrepôt. Le résultat : des requêtes copiées-collées partout, zéro documentation, impossible de tester si les chiffres sont corrects. Et quand quelqu'un quitte l'équipe, bonne chance pour reprendre son travail. Le vrai problème, c'est que le SQL était traité comme un outil jetable. Alors que c'est du code. Et le code, ça se versionne, ça se teste, ça se documente.

[01:00] PARTIE 2 — Ce que dbt change
dbt, c'est data build tool. C'est un framework open source qui te permet d'écrire tes transformations SQL comme si c'était du vrai code de développeur. Concrètement, tu écris des fichiers .sql dans un projet structuré. dbt gère les dépendances entre tes modèles automatiquement. Tu peux ajouter des tests en 3 lignes : est-ce que cette colonne est unique ? Est-ce qu'elle ne contient jamais de valeur nulle ? Et toute la documentation de tes tables se génère automatiquement. Le tout est versionné avec Git, comme n'importe quel projet de développement.

[01:50] PARTIE 3 — Exemple concret : avant / après
Avant dbt. Tu as une table de commandes brutes dans ton entrepôt. Pour calculer le chiffre d'affaires mensuel, tu copies une requête SQL de 80 lignes dans ton outil de BI. Si quelqu'un d'autre en a besoin, il copie la même requête. Deux versions du même calcul commencent à diverger. Personne ne sait laquelle est la bonne. Après dbt. Tu crées un modèle `orders_monthly.sql`. Il référence les bonnes tables avec `ref('orders')`. Tu ajoutes un test pour vérifier qu'il n'y a pas de doublons. Tout le monde utilise ce modèle unique. Quand tu le modifies, les changements se propagent partout. Et dans six mois, n'importe qui dans l'équipe peut lire le projet et comprendre comment les données sont construites.

[02:45] PARTIE 4 — Pour qui c'est utile ?
Si tu es data analyst, dbt te permet de devenir plus autonome. Tu n'as plus besoin d'un ingénieur pour chaque transformation. Si tu es data engineer, dbt standardise les pipelines et réduit la dette technique. Et si tu es dans une équipe qui utilise Snowflake, BigQuery, Redshift ou DuckDB, sache que dbt s'intègre nativement avec tous ces entrepôts. C'est devenu un standard de l'industrie. Sur les offres d'emploi en data, la mention "dbt" est passée de rare à quasi systématique en deux ans.

[03:30] PARTIE 5 — Comment démarrer ?
Il existe deux versions. dbt Core, la version open source, gratuite, que tu installes en local. Et dbt Cloud, la version SaaS avec interface web, parfaite si tu veux éviter la configuration. Pour débuter, installe dbt Core avec pip, connecte-le à ta base de données, et lance `dbt init` pour créer ton premier projet. La courbe d'apprentissage est courte si tu connais déjà SQL.

[03:50] OUTRO (15s)
On a un guide complet sur dbt Core sur datasphere.fr, avec les commandes essentielles et un exemple de projet de bout en bout. Le lien est dans la description. Si cette vidéo t'a été utile, like et abonne-toi, on sort du contenu data et IA en français chaque semaine.

---
## ÉLÉMENTS VISUELS SUGGÉRÉS

[00:00-00:15]
- Capture d'écran d'un dossier plein de fichiers SQL mal nommés (simulée)
- Texte animé : "final_v2_VRAI_final_BIS.sql"

[00:15-01:00]
- Schéma : plusieurs requêtes SQL disparates qui pointent vers différents outils (Tableau, Excel, Power BI) sans lien entre elles
- Icône "chaos" ou "spaghetti"

[01:00-01:50]
- Logo dbt
- Arborescence d'un projet dbt : dossiers models/, tests/, docs/
- Code SQL simple avec `ref()` mis en évidence
- Schéma : Git comme colonne vertébrale du projet

[01:50-02:45]
- Split screen : "Avant" à gauche (copier-coller SQL), "Après" à droite (modèle dbt propre)
- Animation montrant la propagation d'un changement dans les modèles dépendants

[02:45-03:30]
- Logos des entrepôts compatibles : Snowflake, BigQuery, Redshift, DuckDB
- Graphique montrant la montée en fréquence de "dbt" dans les offres d'emploi data

[03:30-03:50]
- Terminal avec `pip install dbt-core` et `dbt init`
- Écran de documentation auto-générée par dbt

[03:50-04:05]
- Écran datasphere.fr/outils/dbt-core avec le guide
- Bouton like / abonnement mis en avant
