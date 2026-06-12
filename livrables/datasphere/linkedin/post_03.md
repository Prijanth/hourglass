# SQL vs dbt : quelle différence ?
**Format :** Post texte éducatif
**Objectif :** Éduquer
**Hashtags :** #SQL #dbt #Data #Analytics #DataSphère

---

On me pose souvent cette question :
"J'apprends SQL. Pourquoi aurais-je besoin de dbt en plus ?"

Bonne question. Voici la réponse.

---

**SQL, c'est le langage.**

Tu écris une requête, tu obtiens un résultat.
C'est puissant, c'est universel, c'est indispensable.

Mais quand ton projet grandit, les problèmes arrivent :
- Des dizaines de requêtes SQL non organisées
- Impossible de savoir quelle requête dépend de quelle autre
- Aucun test automatique pour vérifier la qualité des données
- Chaque analyste a sa propre version de la "vérité"

---

**dbt, c'est un framework qui s'appuie sur SQL.**

Tu continues d'écrire du SQL.
Mais dbt ajoute tout ce qui manque :

- Une structure de projet claire (modèles, sources, tests)
- La gestion des dépendances entre tes transformations
- Des tests de qualité automatisés
- Une documentation générée automatiquement
- Le versioning de ta logique métier via Git

---

Autrement dit : SQL te permet d'interroger des données. dbt te permet de construire un data warehouse fiable, documenté et maintenable.

Ce n'est pas l'un ou l'autre.
C'est l'un, puis l'autre.

---

Tu travailles déjà en SQL ?
dbt est la prochaine compétence à ajouter.

---
**CTA :** Découvre le guide complet sur dbt et comment démarrer sur DataSphère.
**Lien :** https://datasphere.fr/outils/dbt
