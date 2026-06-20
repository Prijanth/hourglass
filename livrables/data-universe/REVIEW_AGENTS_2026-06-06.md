# Rapport de review Data Universe — 7 agents — 6 juin 2026

> Synthèse consolidée et classée par priorité.
> Agents : Vérification factuelle · UX/Accessibilité · Contenu data · SEO · Product Manager · Frontend/Performance · Expert Design Web (25+ ans)

---

## PRIORITÉ 0 — CORRECTIONS BLOQUANTES (à faire avant toute publication)

Ces problèmes cassent le site en production ou induisent gravement en erreur les utilisateurs.

---

### [P0-01] `concepts/[slug]` : 60+ pages cassées en production
**Agents : Frontend, SEO**
- Fichier : `app/concepts/[slug]/page.tsx`
- Le fichier est déclaré `"use client"` alors qu'il consomme du JSON statique
- Conséquence : `generateStaticParams` impossible → pages non générées → 404 en production
- Conséquence : `generateMetadata` impossible → 60+ pages sans title/description SEO
- **Correction** : Supprimer `"use client"`, ajouter `generateStaticParams` + `generateMetadata`, utiliser les params server-side

---

### [P0-02] Mobile complètement cassé — 4 grilles sans responsive
**Agent : UX/Accessibilité**
- `app/page.tsx` ligne 50 : `gridTemplateColumns: "1fr 420px"` → colonne 420px force un overflow sur tout écran < 500px
- `app/page.tsx` ligne 150 : `gridTemplateColumns: "1fr 1fr"` → CTAs débutant/recruteur illisibles sur mobile
- `app/page.tsx` ligne 232 : `gridTemplateColumns: "repeat(4, 1fr)"` → 10 cartes à ~80px chacune
- `components/footer.tsx` ligne 30 : `gridTemplateColumns: "2fr 1fr 1fr 1.3fr"` → formulaire newsletter inutilisable sur mobile
- **Correction** : Remplacer par `repeat(auto-fit, minmax(Xpx, 1fr))` ou media queries. Hero : passer en 1 colonne sous 900px.

---

### [P0-03] La Communauté est une coquille vide exposée comme feature réelle
**Agent : Product Manager**
- Page `/communaute` : 5 questions statiques hardcodées, compteurs affichent "Bientôt", Discord pointe vers `#` (lien mort)
- La soumission de question simule une réponse via `setTimeout(800ms)` sans aucun appel API réel
- **Impact** : la confiance dans le site entier s'effondre pour tout visiteur qui clique sur "Communauté"
- La nav l'affiche comme CTA primaire au même niveau que "Newsletter"
- **Correction** : Retirer "Communauté" du header, ou remplacer par une page de waitlist honnête

---

### [P0-04] Databricks `free_tier: true` — Community Edition supprimée depuis mi-2023
**Agents : Factuel, Contenu**
- Fichier : `content/outils.json`, slug `databricks`
- La Community Edition n'existe plus. Seul un trial de 14 jours sur cloud public reste disponible
- **Correction** : `free_tier: false`, `pricing: "Pay-per-use (DBUs) — Trial 14 jours"`

---

### [P0-05] dbt Cloud pricing — "à partir de 100$/mois" alors que le Developer plan est gratuit
**Agents : Factuel, Contenu**
- Fichier : `content/outils.json`, slug `dbt`
- Depuis 2024 : Developer plan gratuit (1 siège), Team ~100$/mois (8 sièges)
- Le comparatif `dbt-core-vs-dbt-cloud` dit déjà "plan Developer gratuit" → incohérence interne
- **Correction** : `pricing: "Open source gratuit / Cloud — Developer plan gratuit (1 siège), Team ~100$/mois (8 sièges)"`

---

### [P0-06] `scikit-learn` — MLflow listé comme alternative (erreur conceptuelle grave)
**Agent : Contenu**
- Fichier : `content/outils.json`, slug `scikit-learn`, champ `alternatives`
- MLflow est un outil de tracking MLOps, pas un framework ML. C'est comme mettre Git en alternative à Python.
- **Correction** : Remplacer `["pytorch", "hugging-face", "mlflow"]` par `["pytorch", "xgboost", "lightgbm"]`

---

### [P0-07] `pytorch` — MLflow et HuggingFace listés comme alternatives
**Agent : Contenu**
- Fichier : `content/outils.json`, slug `pytorch`
- HuggingFace utilise PyTorch — les mettre en "alternative" est structurellement incorrect
- **Correction** : Remplacer par `["tensorflow", "jax", "scikit-learn"]`

---

### [P0-08] Parcours débutant — Mode Analytics n'existe plus (ressource morte depuis 2022)
**Agent : Contenu**
- Fichier : `app/debuter/page.tsx`, étape SQL
- Mode Analytics a fermé son espace d'apprentissage SQL après rachat par ThoughtSpot
- **Correction** : Remplacer par "SQLBolt" (gratuit, actif) ou "LearnSQL.com"

---

### [P0-09] Polars catégorisé "Machine Learning" dans le glossaire
**Agent : Contenu**
- Fichier : `content/glossaire.json`, terme `Polars`
- Polars est une bibliothèque de manipulation de données, pas un outil ML
- **Correction** : Changer `"category": "Machine Learning"` en `"category": "Data Engineering"`

---

### [P0-10] Métadonnées SEO manquantes sur les pages outils et articles
**Agents : SEO, Frontend**
- `app/outils/[slug]/page.tsx` : aucun `generateMetadata` → toutes les fiches outils héritent du title générique
- `app/actualites/[slug]/page.tsx` : idem
- **Correction** : Ajouter `generateMetadata` dynamique dans ces deux fichiers (title = `{nom} — Avis, prix, alternatives | Data Universe`)

---

### [P0-11] Sitemap incomplet — fiches métiers et concepts absentes
**Agent : SEO**
- Fichier : `app/sitemap.ts`
- Les pages `/metiers/[slug]` (12 fiches) et `/concepts/[slug]` (60+ fiches) ne sont pas dans le sitemap
- `/debuter` et `/a-propos` absents de `STATIC_ROUTES`
- **Correction** : Ajouter les deux familles dynamiques + les 2 pages statiques

---

### [P0-12] Footer — gestion d'erreur absente sur l'abonnement newsletter
**Agent : Frontend**
- Fichier : `components/footer.tsx`, `handleSubscribe`
- Le bloc `try/finally` n'a aucun `catch`. Un échec réseau est silencieux
- **Correction** : Ajouter `catch(err) { setError("Erreur lors de l'abonnement. Réessaie.") }` et afficher le message

---

## PRIORITÉ 1 — CORRECTIONS URGENTES

---

### [P1-01] OpenAI API `free_tier: true` — faux (5$ de crédit non renouvelable)
**Agents : Factuel, Contenu**
- Le crédit d'essai expire et n't est pas renouvelable. Ce n'est pas un free tier
- **Correction** : `free_tier: false`, `pricing: "Pay-per-token (5$ de crédit non renouvelable à l'ouverture)"`

---

### [P1-02] Anomaly Detection — Prophet et ARIMA sont des outils de forecasting, pas de détection
**Agent : Contenu**
- Fichier : `content/glossaire.json`, terme `Anomaly Detection`
- **Correction** : Retirer Prophet et ARIMA. Mettre Isolation Forest, Autoencoder, PyOD comme exemples réels

---

### [P1-03] Score Polars > Pandas (75 vs 72) oriente les débutants vers le mauvais outil
**Agent : Contenu**
- Fichier : `content/comparatifs.json`, slug `pandas-vs-polars`
- 95% des offres junior demandent Pandas. Polars n'est pas demandé en entry level
- **Correction** : Option 1 : inverser les scores (Pandas 76, Polars 73). Option 2 : ajouter un bandeau d'avertissement explicite "Pour les débutants, apprenez Pandas en priorité"

---

### [P1-04] `langchain` — HuggingFace et OpenAI API listés en alternatives (incorrect)
**Agent : Contenu**
- Ces deux éléments sont des dépendances de LangChain, pas des concurrents
- **Correction** : Remplacer par `["llamaindex", "haystack", "dspy"]`

---

### [P1-05] Contrastes couleur insuffisants — accessibilité WCAG AA non respectée
**Agents : UX, Design**
- `app/page.tsx` ligne 113 : `color: "#CBD5E1"` sur fond blanc → ratio 1.6:1 (texte quasiment invisible)
- `color: "#94A3B8"` sur blanc → ratio ~2.8:1 (insuffisant pour texte courant, minimum 4.5:1)
- `components/footer.tsx` : `rgba(255,255,255,0.3)` sur `#0B0F29` → ~2.1:1 (liens légaux illisibles)
- `components/footer.tsx` ligne 44 : `rgba(255,255,255,0.42)` → ~3.2:1
- **Correction** : `#CBD5E1` → minimum `#94A3B8`; footer links → `rgba(255,255,255,0.65)` minimum

---

### [P1-06] Navigation hover-only — clavier impossible (WCAG 2.1 — SC 2.1.1)
**Agents : UX, Design**
- `components/nav.tsx` lignes 125-127 : dropdowns déclenchés uniquement par `onMouseEnter/onMouseLeave`
- Les utilisateurs clavier (Tab, Enter) ne peuvent accéder à aucune section Apprendre/Carrière/Outils/Jobs
- Boutons sans `aria-expanded` ni `aria-haspopup`
- **Correction** : Ajouter `onFocus/onBlur`, `onKeyDown(Enter)`, `aria-expanded={isOpen}`, `aria-haspopup="true"`

---

### [P1-07] Double `<main>` imbriqué — HTML5 invalide
**Agents : UX, Frontend**
- `app/layout.tsx` ligne 29 : `<main style={{ flex: 1 }}>{children}</main>`
- `app/debuter/page.tsx`, `app/a-propos/page.tsx` retournent aussi un `<main>`
- Résultat : `<main>` imbriqué dans un `<main>` — invalide HTML5, comportement imprévisible pour les lecteurs d'écran
- **Correction** : Supprimer le `<main>` du layout (garder seulement dans chaque page)

---

### [P1-08] Liens certifications dans les fiches métiers brisent le maillage SEO
**Agent : SEO**
- `app/metiers/[slug]/page.tsx` ligne 201 : liens vers `/certifications?q=...` au lieu de `/certifications/[slug]`
- Google ne transfère pas le PageRank vers les URLs de filtre
- **Correction** : Lier directement vers `/certifications/[slug-cert]` pour chaque certification recommandée

---

### [P1-09] Cards de salaires homepage → `/metiers` au lieu de `/metiers/[slug]`
**Agents : SEO, PM**
- `app/page.tsx` ligne 322 : toutes les cartes salaires pointent vers `/metiers` (la liste)
- Perd le maillage interne sur 6 fiches visibles dès la homepage
- **Correction** : Changer `href="/metiers"` en `href={/metiers/${m.slug}}`

---

### [P1-10] FAQPage Schema.org absent sur `/debuter`
**Agent : SEO**
- La page a 4 questions/réponses parfaites pour un rich snippet Google
- Elle a aussi une structure HowTo (5 étapes) non balisée
- **Correction** : Implémenter `FAQPage` + `HowTo` Schema.org

---

### [P1-11] `recharts` dans le bundle initial de la homepage
**Agent : Frontend**
- `TrendsChart` et `SkillsChart` chargent recharts (~100ko) dans le bundle critique
- **Correction** : Charger avec `next/dynamic({ ssr: false, loading: () => <Skeleton /> })`

---

### [P1-12] Marquee sans `prefers-reduced-motion` (WCAG 2.1 — SC 2.2.2)
**Agent : UX**
- `app/page.tsx` lignes 133-146 + `app/globals.css` ligne 432 : animation infinie sans media query
- Peut affecter les utilisateurs avec troubles vestibulaires
- **Correction** : `@media (prefers-reduced-motion: reduce) { .marquee-track { animation: none; } }` + `aria-hidden="true"` sur le ticker

---

### [P1-13] Snowflake gouvernance absente de la fiche outil (trompeur pour profils enterprise)
**Agent : Contenu**
- Fichier : `content/outils.json`, slug `snowflake`
- Horizon Catalog, Dynamic Data Masking, Row Access Policies non mentionnés
- Critiques pour les lecteurs banque/assurance qui sont le cœur de clientèle Snowflake en France
- **Correction** : Ajouter dans `features` et `pros`

---

### [P1-14] 9 pages sans metadata exportée
**Agent : Frontend**
- `/glossaire`, `/concepts`, `/ia`, `/cas-usage`, `/communaute`, `/certifications`, `/newsletter`, `/toolbox`, `/comparatifs`
- Héritent toutes du title générique du layout
- **Correction** : Ajouter `export const metadata: Metadata = { title: "...", description: "..." }` dans chacune

---

### [P1-15] Formulaire newsletter footer sans `<label>` ni `<form>`
**Agents : UX, Frontend**
- `components/footer.tsx` : `<input>` sans `<label>` associé, pas de balise `<form>`
- Le submit par Enter ne fonctionne pas, lecteur d'écran aveugle sur le champ
- **Correction** : Envelopper dans `<form onSubmit={...}>`, ajouter `<label htmlFor="email-footer">` + `id`

---

### [P1-16] Fragment sans `key` dans les trajectoires de carrière
**Agent : Frontend**
- `app/metiers/[slug]/page.tsx` ligne 230 : `<>` sans key prop dans un `.map()`
- Warning React en console, rendu de liste potentiellement instable
- **Correction** : Utiliser `<React.Fragment key={i}>` ou restructurer avec un seul `<div>`

---

### [P1-17] Microsoft Fabric absent du glossaire
**Agent : Contenu**
- Plateforme data unifiée Microsoft (OneLake, Synapse, Power BI) dominante dans les entreprises françaises
- Absence dans un glossaire data francophone en 2025 est une lacune notable
- **Correction** : Ajouter l'entrée dans `content/glossaire.json`, catégorie "Infrastructure"

---

### [P1-18] LLM/RAG score sous-estimé à 68% dans le skills chart
**Agent : Factuel**
- `components/charts/skills-chart.tsx` ligne 16
- En juin 2026, ce score est probablement à 80-85% dans les offres data
- **Correction** : Relever à 80-85%

---

### [P1-19] Salaire Data Analyst senior plafonné à 72k€ (trop bas)
**Agent : Contenu**
- `content/metiers.json`, slug `data-analyst`
- APEC/Indeed 2025 : senior 5+ ans à Paris atteint 55-80k€
- **Correction** : `salaryParisSenior: "55-80k€"`, `salaryMax: 75`

---

### [P1-20] Prompt Engineer — positionnement métier daté et demande surestimée
**Agent : Contenu**
- Le Prompt Engineer pur est en déclin depuis 2024, absorbé par les postes d'AI Engineer
- **Correction** : Reformuler en "AI Engineer / Prompt Engineer", baisser la demande à "Modérée", ajouter une note d'orientation vers Python/RAG

---

## PRIORITÉ 2 — AMÉLIORATIONS IMPORTANTES

---

### [P2-01] o3-mini remplacé par o4-mini depuis avril 2025
**Agent : Factuel**
- `content/ia.json` : o3-mini listé comme modèle actif → remplacé par o4-mini dans l'API OpenAI

---

### [P2-02] Snowflake `free_tier: true` discutable (trial 30 jours, pas permanent)
**Agent : Factuel**
- Similaire à Databricks mais trial plus généreux. Reformuler dans pricing

---

### [P2-03] Apache Flink — Databricks listé comme alternative directe (incorrect)
**Agent : Contenu**
- Databricks est une plateforme qui embarque Spark, pas un moteur de streaming
- **Correction** : `["spark", "dataflow", "confluent-ksql"]`

---

### [P2-04] Great Expectations — Databricks listé comme alternative (incorrect)
**Agent : Contenu**
- Databricks est une plateforme, pas un outil de qualité de données
- **Correction** : `["dbt", "soda-core"]`

---

### [P2-05] Parcours débutant — lien "Polars (alternative rapide)" dans l'étape Pandas
**Agent : Contenu**
- `app/debuter/page.tsx`, étape 03 : pointer vers Polars dans une étape d'apprentissage Pandas crée une confusion
- **Correction** : Supprimer ce lien, remplacer par fiche `Pandas` ou ressource Matplotlib

---

### [P2-06] `/debuter` ne capture pas les profils en reconversion
**Agent : PM**
- La page adresse uniquement le "débutant absolu" alors que le cas majoritaire est la reconversion depuis marketing/finance/RH
- **Correction** : Ajouter un bloc de bifurcation dès le début : "Je pars de zéro" vs "J'ai un profil existant"

---

### [P2-07] Cartes métiers dans `/metiers` (liste) non linkées vers les slugs individuels
**Agent : PM**
- `app/metiers/page.tsx` : les cartes sont des `<div>` non cliquables, pas des `<Link>`
- Coupe le funnel débutant → liste → fiche → formations → newsletter
- **Correction** : Passer en `<Link href={/metiers/${m.slug}}>` pour chaque carte

---

### [P2-08] `onMouseEnter/onMouseLeave` pour simuler des hovers CSS — 22 occurrences
**Agents : Design, Frontend**
- Ces manipulations DOM directes (`e.currentTarget.style`) forcent des composants en `"use client"` inutilement
- **Correction** : Remplacer par classes CSS et `:hover` natif

---

### [P2-09] Heading H1/H2 : trop de H2 sur la homepage sans hiérarchie logique
**Agent : SEO**
- Les CTAs débutant/recruteur sont balisés H2 au même niveau que les sections éditoriales
- **Correction** : Rétrograder les CTAs en texte stylé, réserver H2 aux sections thématiques

---

### [P2-10] Sections outils et concepts sans H2 sémantiques dans le corps
**Agent : SEO**
- Les sections "Présentation", "Fonctionnalités", "Avantages" sont des spans/paragraphes stylés, pas des `<h2>`
- Google ne voit aucune structure dans ces 60+ pages

---

### [P2-11] Formations dbt non différenciées Core vs Cloud dans les fiches métiers
**Agent : PM**
- `app/metiers/[slug]/page.tsx` : `udemy-dbt-bootcamp` et `dbt-analytics-engineering` sans distinction
- Un débutant ne sait pas si le cours enseigne l'outil gratuit (Core) ou payant (Cloud)

---

### [P2-12] Page À propos — identité auteur sous-exploitée
**Agents : PM, Design**
- "Créée par Prijanth S." sans photo, sans LinkedIn, sans contexte de légitimité
- Pour une audience data professionnelle sceptique, insuffisant
- **Correction** : Bloc auteur avec photo, mission en 3 lignes, lien professionnel

---

### [P2-13] 18 variantes de badges — sur-engineering sans convention d'usage
**Agent : Design**
- `app/globals.css` : `badge-blue`, `badge-indigo` visuellement identiques, `badge-teal` vs `badge-emerald` indistinguables
- **Correction** : Conserver 5 variantes maximum (indigo, teal, amber, danger, neutral)

---

### [P2-14] Tailles de texte fractionnaires sans échelle typographique
**Agent : Design**
- 11px, 11.5px, 12px, 12.5px, 13px, 13.5px, 14px, 14.5px, 15px, 15.5px, 16px, 17px dans la même homepage
- **Correction** : Définir une scale à 5 paliers (12, 14, 16, 18, 21px) et s'y tenir

---

### [P2-15] Classes CSS non utilisées systématiquement (styles inline dupliqués)
**Agents : Design, Frontend**
- `.btn-primary`, `.section-label`, `.card` existent mais sont réimplémentés en inline dans chaque page
- Centaines d'occurrences de styles identiques dupliqués

---

### [P2-16] AutoGPT cité comme exemple d'Agent IA (obsolète depuis 2023)
**Agent : Contenu**
- `content/glossaire.json`, terme `Agent IA`
- **Correction** : Remplacer par "CrewAI" ou "LangGraph"

---

### [P2-17] Snowflake vs Databricks — gouvernance : Databricks 90 vs Snowflake 82 contestable
**Agent : Contenu**
- Snowflake est objectivement supérieur sur la gouvernance SQL fine (Dynamic Masking, Row Access Policies)
- **Correction** : Rééquilibrer à Snowflake 88 / Databricks 85

---

### [P2-18] Tableau pricing — 70€/mois potentiellement obsolète (Salesforce a remonté les prix)
**Agent : Factuel**
- Creator est désormais ~115$/mois selon la grille Salesforce 2025

---

## PRIORITÉ 3 — MINEURS ET POLISH

- **[P3-01]** "2025" partout (homepage, certifications) alors qu'on est en 2026
- **[P3-02]** Snowflake description : "entre 2018 et 2024" suggère que le standard est révolu — reformuler en "depuis 2018"
- **[P3-03]** `/a-propos` et `/debuter` : année "2025" dans les titres et meta descriptions
- **[P3-04]** Logo : deux cercles concentriques génériques, mémorable à améliorer (`components/nav.tsx` ligne 88)
- **[P3-05]** `letter-spacing: -0.04em` trop agressif sur les h1 (`app/globals.css` ligne 476) — monter à -0.025em
- **[P3-06]** `line-height: 1.05` trop serré sur `.display-xl` — monter à 1.15
- **[P3-07]** Dropdowns nav sans animation d'entrée (opacity + translateY 4px)
- **[P3-08]** `aria-hidden="true"` manquant sur les SVG décoratifs (logo, orbs, ticker)
- **[P3-09]** Emoji 🛠️ en double — Outils et Toolbox ont le même emoji (`app/page.tsx` lignes 21/23)
- **[P3-10]** `scroll-margin-top` absent sur les ancres de `/debuter` (masquées par la navbar sticky 60px)
- **[P3-11]** CTA "Communauté" placé avant "Newsletter" dans le header — inverser l'ordre
- **[P3-12]** Dagster `launched: 2019` → version 0.1 sortie décembre 2018
- **[P3-13]** Kappa Architecture — exemple "Kinesis + Lambda" incorrect → "Kinesis + Kinesis Data Analytics (Flink)"
- **[P3-14]** Lambda Architecture — "Spark + Storm (legacy)" → "Spark Batch + Kafka Streams"
- **[P3-15]** Google Analytics Certificate : "6 mois" → reformuler en "3 à 6 mois selon ton rythme"
- **[P3-16]** "Fait avec passion en France" dans le footer bottom — remplacer par la date de dernière mise à jour
- **[P3-17]** ML Engineer salaire max 110k€ conservateur → 120k€
- **[P3-18]** Staff DE salaire max 140k€ → 160k€
- **[P3-19]** FAQ /debuter : "6 à 18 mois" optimiste → reformuler en "9 à 18 mois" compte tenu du marché 2025
- **[P3-20]** `OverallScore` dans `outils/[slug]/page.tsx` — nommage PascalCase trompeur → `calcOverallScore`
- **[P3-21]** Validation email silencieuse dans le footer (pas de message d'erreur visible)
- **[P3-22]** Dark mode absent — les variables CSS sont déjà structurées pour l'implémenter facilement

---

## TABLEAU DE BORD DES CORRECTIONS

| # | Priorité | Agent | Effort | Impact |
|---|----------|-------|--------|--------|
| P0-01 | BLOQUANT | Frontend/SEO | 30 min | 60+ pages accessibles |
| P0-02 | BLOQUANT | UX | 45 min | Mobile fonctionnel |
| P0-03 | BLOQUANT | PM | 15 min | Confiance restaurée |
| P0-04 | BLOQUANT | Factuel | 5 min | Débutants non trompés |
| P0-05 | BLOQUANT | Factuel | 5 min | Cohérence interne |
| P0-06 | BLOQUANT | Contenu | 5 min | Débutants ML non perdus |
| P0-07 | BLOQUANT | Contenu | 5 min | Idem |
| P0-08 | BLOQUANT | Contenu | 5 min | Lien mort supprimé |
| P0-09 | BLOQUANT | Contenu | 2 min | Filtres glossaire corrects |
| P0-10 | BLOQUANT | SEO | 30 min | Visibilité Google |
| P0-11 | BLOQUANT | SEO | 20 min | 70+ pages dans le sitemap |
| P0-12 | BLOQUANT | Frontend | 10 min | UX newsletter corrigée |

**Corrections P0 estimées : ~3h de développement**

---

## NOUVELLES OPPORTUNITÉS IDENTIFIÉES

1. **Pages `/glossaire/[slug]`** — 137 termes individualisés (long tail SEO massif)
2. **Pages `/certifications/[provider]`** — agrégation par AWS/Azure/GCP
3. **Page `/salaires-data-france`** — consolide les fourchettes pour les featured snippets
4. **Dark mode** — les variables CSS sont prêtes, ~2h de travail
5. **FAQPage + HowTo Schema.org** sur `/debuter` — rich snippets gratuits
6. **Tags cliquables** sur pages outils/concepts → maillage interne renforcé
7. **Encart newsletter** dans le parcours débutant (entre étapes 4 et 5) — conversion haute intention

---

*Rapport généré le 6 juin 2026 — 7 agents d'analyse parallèles*
