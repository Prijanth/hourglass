"use client";
import { useState } from "react";

/* ─── DONNÉES ─────────────────────────────────────────── */

const SNIPPETS = [
  /* ── SQL ─────────────────────────────────────────────── */
  {
    id: "sql-deduplicate", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Déduplication",
    titre: "Déduplication avec ROW_NUMBER()",
    desc: "Cas classique : votre table clients contient plusieurs lignes par client car le CRM envoie une mise à jour à chaque modification. ROW_NUMBER() numérote les lignes à l'intérieur de chaque groupe (PARTITION BY), et on ne garde que la ligne numéro 1 — ici la plus récente (ORDER BY updated_at DESC). Compatible BigQuery, Snowflake, PostgreSQL.",
    code: `-- OBJECTIF : garder une seule ligne par client, la plus récente

WITH ranked AS (
  SELECT
    *,
    -- ROW_NUMBER() attribue un numéro à chaque ligne DANS chaque groupe client_id
    -- La ligne la plus récente (updated_at DESC) reçoit le numéro 1
    -- Si deux lignes ont le même updated_at, l'ordre est arbitraire mais déterministe
    ROW_NUMBER() OVER (
      PARTITION BY client_id   -- grouper par identifiant client
      ORDER BY updated_at DESC -- la plus récente en premier
    ) AS rn
  FROM clients
)
SELECT * EXCEPT(rn)  -- on retire la colonne rn du résultat final
FROM ranked
WHERE rn = 1;        -- ne garder que la première ligne de chaque groupe (la plus récente)

-- VARIANTE : si vous voulez garder la plus ancienne, utilisez ORDER BY updated_at ASC
-- VARIANTE : DENSE_RANK() au lieu de ROW_NUMBER() si vous voulez gérer les ex-aequo différemment`,
  },
  {
    id: "sql-window", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Fenêtres",
    titre: "Window functions — cumul et classement",
    desc: "Votre direction veut un rapport affichant, pour chaque vente : le total cumulé depuis le début pour ce produit, ET le classement de ce produit parmi tous ce jour-là. Sans les window functions, il faudrait 2 sous-requêtes complexes et lentes. Avec OVER(), tout se fait en une seule passe sur les données.",
    code: `-- OBJECTIF : enrichir chaque ligne avec des calculs qui nécessitent de regarder
-- d'autres lignes (ce qu'un GROUP BY seul ne peut pas faire)

SELECT
  date,
  produit,
  ventes,

  -- SUM cumulatif : total depuis la première date jusqu'à la date courante,
  -- PAR produit (PARTITION BY produit = calcul séparé pour chaque produit)
  -- ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW = "depuis le début jusqu'ici"
  SUM(ventes) OVER (
    PARTITION BY produit
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumul_ventes,

  -- RANK : classement du produit parmi tous les produits CE JOUR-LÀ
  -- PARTITION BY date = on repart de 1 pour chaque date
  -- ORDER BY ventes DESC = le plus vendu est classé 1
  -- Note : RANK() crée des trous si ex-aequo (1,1,3...), DENSE_RANK() non (1,1,2...)
  RANK() OVER (PARTITION BY date ORDER BY ventes DESC) AS rang_jour

FROM ventes_quotidiennes
ORDER BY produit, date;`,
  },
  {
    id: "sql-lag", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Fenêtres",
    titre: "LAG / LEAD — variation par rapport à la période précédente",
    desc: "Votre direction demande 'quelle est l'évolution du CA vs le mois précédent ?'. LAG() accède à la valeur de la ligne précédente dans un ensemble ordonné — sans auto-jointure. Ce snippet calcule la variation absolue (€) et en pourcentage pour chaque période. Cas d'usage : suivi mensuel du CA, nombre de commandes, KPIs de performance.",
    code: `-- OBJECTIF : comparer chaque valeur avec la valeur de la période précédente

SELECT
  date,
  ca,

  -- LAG(ca, 1) : lire le CA de la ligne précédente (1 = décalage de 1 ligne)
  -- Le résultat est NULL pour la première ligne (pas de ligne précédente)
  LAG(ca, 1) OVER (ORDER BY date) AS ca_periode_precedente,

  -- Variation absolue = CA actuel - CA précédent
  ca - LAG(ca, 1) OVER (ORDER BY date) AS variation_absolue_euros,

  -- Variation en % = (actuel - précédent) / précédent × 100
  -- NULLIF(x, 0) protège contre la division par zéro
  -- Si le CA précédent est 0, retourne NULL au lieu d'une erreur
  ROUND(
    100.0 * (ca - LAG(ca, 1) OVER (ORDER BY date))
    / NULLIF(LAG(ca, 1) OVER (ORDER BY date), 0),
    1
  ) AS variation_pct,

  -- LEAD = inverse de LAG : regarde la ligne SUIVANTE
  -- Utile pour calculer combien de temps avant le prochain événement
  LEAD(ca, 1) OVER (ORDER BY date) AS ca_periode_suivante

FROM chiffre_affaires_mensuel
ORDER BY date;`,
  },
  {
    id: "sql-pivot", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Transformation",
    titre: "Pivot conditionnel avec CASE WHEN",
    desc: "Votre table stocke les ventes en format 'long' : une ligne par vente avec une colonne 'region'. Mais votre rapport PowerPoint veut les régions en colonnes. Ce snippet pivote les données sans PIVOT natif (qui n'existe pas dans BigQuery ou PostgreSQL) en utilisant des CASE WHEN imbriqués dans des SUM. Résultat : 1 ligne par mois, 4 colonnes de régions.",
    code: `-- OBJECTIF : transformer un format "long" (une ligne par région/mois)
-- en format "large" (une ligne par mois, une colonne par région)

-- FORMAT INITIAL (avant pivot) :
-- mois      | region | ventes
-- 2026-01   | Nord   | 1200
-- 2026-01   | Sud    | 800
-- 2026-01   | Est    | 650

-- RÉSULTAT OBTENU (après pivot) :
-- mois      | nord  | sud  | est  | ouest
-- 2026-01   | 1200  | 800  | 650  | ...

SELECT
  mois,

  -- Pour chaque colonne de région : si la ligne correspond à cette région,
  -- prendre la valeur ; sinon mettre 0, puis additionner par mois
  -- C'est exactement ce que fait un tableau croisé dynamique Excel
  SUM(CASE WHEN region = 'Nord'  THEN ventes ELSE 0 END) AS nord,
  SUM(CASE WHEN region = 'Sud'   THEN ventes ELSE 0 END) AS sud,
  SUM(CASE WHEN region = 'Est'   THEN ventes ELSE 0 END) AS est,
  SUM(CASE WHEN region = 'Ouest' THEN ventes ELSE 0 END) AS ouest,

  -- Bonus : total de toutes les régions pour vérification
  SUM(ventes) AS total_toutes_regions

FROM ventes
GROUP BY mois   -- une ligne de résultat par mois
ORDER BY mois;`,
  },
  {
    id: "sql-calendar", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Temporel",
    titre: "Date spine — calendrier sans trous pour les graphiques",
    desc: "Problème classique : votre table de ventes n'a pas de ligne les jours sans vente (week-ends, jours fériés). Quand vous faites un graphique linéaire, les jours manquants créent des sauts. Ce snippet génère un calendrier complet de toutes les dates, puis vous faites un LEFT JOIN avec vos données réelles pour obtenir des zéros aux jours sans vente — et un graphique lisse.",
    code: `-- OBJECTIF : générer toutes les dates d'une période pour ne pas avoir de trous
-- dans les graphiques ou les analyses temporelles

-- ── Méthode 1 : BigQuery natif (la plus simple) ───────────────
-- GENERATE_DATE_ARRAY crée directement un tableau de dates
SELECT d AS date_jour
FROM UNNEST(
  GENERATE_DATE_ARRAY('2026-01-01', '2026-12-31', INTERVAL 1 DAY)
) AS d;

-- ── Méthode 2 : CTE récursive (Snowflake, PostgreSQL, SQL Server) ──
-- La CTE s'appelle elle-même en ajoutant 1 jour à chaque itération
-- jusqu'à atteindre la date de fin
WITH RECURSIVE dates AS (
  SELECT DATE('2026-01-01') AS d         -- date de départ
  UNION ALL
  SELECT DATEADD(day, 1, d)              -- +1 jour à chaque récursion
  FROM dates
  WHERE d < DATE('2026-12-31')           -- condition d'arrêt
)
SELECT d AS date_jour FROM dates;

-- ── Utilisation type : LEFT JOIN pour remplir les zéros ──────────
-- Le calendrier devient la "table maître" et les ventes se joignent dessus
WITH calendrier AS (
  SELECT d AS date_jour FROM UNNEST(GENERATE_DATE_ARRAY('2026-01-01', '2026-12-31', INTERVAL 1 DAY)) d
)
SELECT
  c.date_jour,
  COALESCE(v.total_ventes, 0) AS ventes  -- 0 si pas de vente ce jour
FROM calendrier c
LEFT JOIN (
  SELECT DATE(created_at) AS date, SUM(montant) AS total_ventes FROM commandes GROUP BY 1
) v ON c.date_jour = v.date
ORDER BY c.date_jour;`,
  },
  {
    id: "sql-joins", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Jointures",
    titre: "Types de JOIN — référence complète",
    desc: "Choisir le mauvais type de JOIN est l'erreur la plus fréquente en SQL. INNER JOIN perd des lignes, LEFT JOIN les conserve toutes, FULL OUTER voit les deux côtés. Ce snippet montre les 4 types avec leurs cas d'usage réels : trouver des clients sans commande, réconcilier deux sources de données, générer toutes les combinaisons possibles pour un test.",
    code: `-- ── INNER JOIN : ne garder QUE les lignes présentes des deux côtés ──
-- Cas d'usage : obtenir les clients qui ont au moins une commande
-- ⚠️ Les clients SANS commande sont perdus silencieusement
SELECT c.nom, c.email, o.montant, o.date_commande
FROM clients c
INNER JOIN commandes o ON c.id = o.client_id;

-- ── LEFT JOIN : garder TOUTES les lignes de gauche ──────────────
-- Cas d'usage : lister tous les clients, avec ou sans commande
-- Les clients sans commande auront des NULL dans les colonnes de "commandes"
SELECT c.nom, c.email,
       o.montant,         -- sera NULL si ce client n'a pas commandé
       o.date_commande    -- idem
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id;

-- Astuce : filtrer sur IS NULL pour trouver les clients sans commande
SELECT c.nom
FROM clients c
LEFT JOIN commandes o ON c.id = o.client_id
WHERE o.client_id IS NULL;  -- seulement les clients qui n'ont jamais commandé

-- ── FULL OUTER JOIN : garder TOUTES les lignes des deux tables ───
-- Cas d'usage : réconcilier deux sources (ex: CRM vs ERP) et voir les écarts
SELECT
  COALESCE(crm.client_id, erp.client_id) AS client_id,
  crm.nom  AS nom_crm,
  erp.nom  AS nom_erp,
  CASE WHEN crm.client_id IS NULL THEN 'Absent du CRM'
       WHEN erp.client_id IS NULL THEN 'Absent de l ERP'
       ELSE 'Présent des deux côtés' END AS statut
FROM clients_crm crm
FULL OUTER JOIN clients_erp erp ON crm.client_id = erp.client_id;

-- ── CROSS JOIN : toutes les combinaisons possibles ───────────────
-- Cas d'usage : générer toutes les combinaisons produit × période pour un rapport
-- ⚠️ Attention : 100 produits × 365 jours = 36 500 lignes
SELECT p.produit, c.date_jour
FROM produits p
CROSS JOIN calendrier c
WHERE c.date_jour BETWEEN '2026-01-01' AND '2026-12-31';`,
  },
  {
    id: "sql-cte-chain", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "CTE",
    titre: "CTEs chaînées — analyses complexes étape par étape",
    desc: "Les sous-requêtes imbriquées dans les sous-requêtes sont illisibles et impossibles à déboguer. Les CTEs (WITH) permettent de découper une analyse complexe en étapes nommées, comme un algorithme. Ici : ventes par mois → moyenne mobile → filtre sur les clients actifs. Chaque étape peut être testée indépendamment en ajoutant un SELECT * temporaire.",
    code: `-- OBJECTIF : analyse en plusieurs étapes impossible à écrire lisiblement
-- en une seule requête. Les CTEs sont des "tables temporaires nommées".
-- Avantage majeur : on peut debugger chaque étape isolément.

WITH
-- ── Étape 1 : agréger les ventes par client et mois ─────────────
-- POURQUOI : réduire le volume de données dès la première étape
ventes_mensuelles AS (
  SELECT
    client_id,
    DATE_TRUNC('month', date_commande) AS mois,  -- arrondi au 1er du mois
    SUM(montant) AS ca_mois                       -- total CA par client/mois
  FROM commandes
  WHERE statut = 'validee'   -- exclure les commandes annulées ou en attente
  GROUP BY 1, 2              -- GROUP BY numéro de colonne = plus concis
),

-- ── Étape 2 : calculer la moyenne mobile sur 3 mois ─────────────
-- POURQUOI : lisser les pics/creux et voir la tendance de fond
ventes_avec_moyenne AS (
  SELECT
    client_id,
    mois,
    ca_mois,
    -- ROWS BETWEEN 2 PRECEDING AND CURRENT ROW = les 2 mois précédents + ce mois
    -- PARTITION BY client_id = calcul séparé pour chaque client
    AVG(ca_mois) OVER (
      PARTITION BY client_id
      ORDER BY mois
      ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS ca_moy_3m
  FROM ventes_mensuelles  -- on réutilise la CTE de l'étape 1 !
),

-- ── Étape 3 : identifier les clients actifs ce mois ──────────────
-- POURQUOI : filtrer sur les clients actifs seulement dans le résultat final
clients_actifs AS (
  SELECT DISTINCT client_id
  FROM ventes_mensuelles
  WHERE mois = DATE_TRUNC('month', CURRENT_DATE)  -- mois en cours uniquement
)

-- ── Requête finale : combiner toutes les étapes ──────────────────
-- On joint les résultats des CTEs comme des tables normales
SELECT v.*
FROM ventes_avec_moyenne v
INNER JOIN clients_actifs c USING (client_id)  -- USING = shorthand quand le nom est identique
ORDER BY client_id, mois;

-- ASTUCE DEBUG : pour tester une étape, remplacer la requête finale par :
-- SELECT * FROM ventes_mensuelles LIMIT 100;`,
  },
  {
    id: "sql-percentiles", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Statistiques",
    titre: "Percentiles, médiane et segmentation en déciles",
    desc: "La moyenne cache la réalité : un panier moyen de 150€ peut cacher 90% de paniers à 50€ et 10% à 1 050€. La médiane et les percentiles révèlent la vraie distribution. NTILE segmente ensuite automatiquement vos clients en Top 10%, Top 30%, etc. — base de tout programme de fidélité ou de scoring commercial.",
    code: `-- ── Percentiles : comprendre la distribution réelle des montants ──
-- PERCENTILE_CONT(0.5) = médiane (50% des valeurs sont en dessous)
-- Contrairement à AVG, la médiane n'est pas influencée par les outliers
SELECT
  MIN(montant)                                         AS minimum,
  PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY montant) AS p25,    -- 25% en dessous
  PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY montant) AS mediane, -- valeur du milieu
  AVG(montant)                                         AS moyenne,  -- à comparer avec mediane
  PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY montant) AS p75,    -- 75% en dessous
  PERCENTILE_CONT(0.90) WITHIN GROUP (ORDER BY montant) AS p90,    -- seuil top 10%
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY montant) AS p99,    -- seuil top 1%
  MAX(montant)                                         AS maximum
FROM commandes
WHERE statut = 'validee';
-- Si mediane << moyenne : il y a des très grands montants qui tirent la moyenne vers le haut

-- ── NTILE : segmenter les clients en N groupes égaux ──────────────
-- NTILE(10) crée 10 groupes de taille égale, triés par ca_annuel DESC
-- Décile 1 = les 10% qui dépensent le plus
WITH segments AS (
  SELECT
    client_id,
    ca_annuel,
    NTILE(10) OVER (ORDER BY ca_annuel DESC) AS decile  -- 1=top 10%, 10=bottom 10%
  FROM clients_ca_annuel
)
SELECT
  client_id,
  ca_annuel,
  decile,
  -- Transformer le décile en label métier
  CASE
    WHEN decile = 1           THEN 'Premium (Top 10%)'
    WHEN decile BETWEEN 2 AND 3 THEN 'Fidèle (Top 30%)'
    WHEN decile BETWEEN 4 AND 6 THEN 'Standard (30-60%)'
    ELSE                           'À risque (Bottom 40%)'
  END AS segment_client
FROM segments
ORDER BY ca_annuel DESC;`,
  },
  {
    id: "sql-nulls", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Qualité",
    titre: "Gestion des NULLs — COALESCE, NULLIF, IS NULL",
    desc: "NULL en SQL n'est pas zéro, ni une chaîne vide : c'est l'absence de valeur. C'est la source de bugs les plus difficiles à trouver — une division par NULL retourne NULL sans erreur, un filtre WHERE col = NULL ne retourne jamais rien. Ce snippet couvre tous les patterns courants : valeurs de remplacement, protection contre les divisions par zéro, comptage des données manquantes.",
    code: `-- ── COALESCE : retourner la première valeur non-NULL ─────────────
-- Cas d'usage : avoir un email de contact même si l'email pro est absent
SELECT
  COALESCE(email_pro, email_perso, 'non renseigné') AS email_contact,
  -- Si email_pro est NULL → essayer email_perso → sinon 'non renseigné'
  COALESCE(prix_promo, prix_normal, 0) AS prix_final
  -- Si pas de promo → prix normal → sinon 0 (gratuit)
FROM clients;

-- ── NULLIF : provoquer un NULL si deux valeurs sont égales ────────
-- Cas d'usage classique : éviter la division par zéro sans IF imbriqué
SELECT
  chiffre_affaires / NULLIF(nb_commandes, 0) AS panier_moyen
  -- Sans NULLIF : si nb_commandes=0, ERREUR "division by zero"
  -- Avec NULLIF : si nb_commandes=0, NULLIF retourne NULL, et x/NULL = NULL (pas d'erreur)

-- ── Filtrer les valeurs NULL ──────────────────────────────────────
-- ⚠️ WHERE col = NULL ne fonctionne PAS — NULL n'est pas égal à NULL !
-- Il faut utiliser IS NULL ou IS NOT NULL
SELECT * FROM clients WHERE email IS NULL;       -- lignes sans email
SELECT * FROM clients WHERE email IS NOT NULL;   -- lignes avec email renseigné

-- ⚠️ Attention aux jointures avec NULL :
-- Si client_id = NULL dans commandes, la jointure ne matchera jamais avec clients

-- ── Auditer les valeurs manquantes d'une table ────────────────────
-- Cas d'usage : avant de livrer un dataset, vérifier la complétude
SELECT
  COUNT(*)                                              AS total_lignes,
  COUNT(email)                                          AS email_renseigne,
  COUNT(*) - COUNT(email)                               AS email_manquant,
  ROUND(100.0 * (COUNT(*) - COUNT(email)) / COUNT(*), 1) AS pct_null_email,
  COUNT(telephone)                                      AS telephone_renseigne,
  COUNT(*) - COUNT(telephone)                           AS telephone_manquant
FROM clients;`,
  },
  {
    id: "sql-dates", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Temporel",
    titre: "Fonctions de date — troncature, calcul de durée, extraction",
    desc: "90% des analyses data ont une dimension temporelle. DATE_TRUNC regroupe les données par semaine/mois/trimestre. EXTRACT récupère une composante (heure, jour de semaine). DATE_DIFF calcule des délais (livraison, rétention). Ce snippet est une référence pour BigQuery, Snowflake et PostgreSQL avec les syntaxes spécifiques à chaque moteur.",
    code: `-- ── DATE_TRUNC : arrondir une date à la période souhaitée ────────
-- Cas d'usage : agréger les ventes par mois → toutes les dates du mois
-- → la même date (le 1er du mois). Permet ensuite un GROUP BY propre.
SELECT
  DATE_TRUNC('week',    created_at) AS debut_semaine,   -- lundi de la semaine
  DATE_TRUNC('month',   created_at) AS debut_mois,      -- 1er du mois
  DATE_TRUNC('quarter', created_at) AS debut_trimestre, -- 1er du trimestre
  DATE_TRUNC('year',    created_at) AS debut_annee      -- 1er janvier
FROM orders;

-- ── EXTRACT : extraire une composante d'une date ─────────────────
-- Cas d'usage : analyser les ventes par jour de semaine ou par heure
SELECT
  EXTRACT(YEAR  FROM created_at) AS annee,
  EXTRACT(MONTH FROM created_at) AS mois_numero,      -- 1 à 12
  EXTRACT(DOW   FROM created_at) AS jour_semaine,     -- 0=Dimanche, 6=Samedi (PostgreSQL/BQ)
  EXTRACT(HOUR  FROM created_at) AS heure_de_creation -- 0 à 23
FROM orders;

-- ── DATE_DIFF : calculer des durées ──────────────────────────────
-- Cas d'usage : délai de livraison, ancienneté client, durée d'abonnement
SELECT
  order_id,
  -- BigQuery
  DATE_DIFF(DATE(shipped_at), DATE(ordered_at), DAY) AS delai_livraison_jours,
  -- Snowflake : DATEDIFF('day', ordered_at, shipped_at)
  -- PostgreSQL : (shipped_at::date - ordered_at::date)
  DATE_DIFF(CURRENT_DATE, DATE(created_at), MONTH)   AS anciennete_mois
FROM orders;

-- ── Filtres temporels courants ────────────────────────────────────
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'     -- 30 derniers jours
  AND created_at >= DATE_TRUNC('month', CURRENT_DATE)      -- mois en cours
  AND created_at BETWEEN '2026-01-01' AND '2026-03-31'     -- Q1 2026

-- ── Formatage pour les exports / rapports ─────────────────────────
SELECT
  FORMAT_DATE('%d/%m/%Y', created_at) AS date_fr     -- BigQuery : "15/06/2026"
  -- TO_CHAR(created_at, 'DD/MM/YYYY')               -- Snowflake / PostgreSQL
FROM orders;`,
  },
  {
    id: "sql-string-agg", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Agrégation",
    titre: "STRING_AGG / LISTAGG — concaténer des valeurs groupées",
    desc: "Votre product manager veut voir, pour chaque client, la liste de tous ses achats sur une seule ligne. Avec un GROUP BY classique, impossible — il faudrait une colonne par achat et on ne connaît pas le nombre à l'avance. STRING_AGG agrège toutes les valeurs d'un groupe en une seule chaîne séparée par des virgules. Très utile aussi pour construire des listes d'emails, de tags, de catégories.",
    code: `-- OBJECTIF : transformer plusieurs lignes par groupe en une seule chaîne
-- Exemple : 3 achats pour client_001 → "Laptop, Souris, Clavier"

-- ── BigQuery et PostgreSQL ────────────────────────────────────────
SELECT
  client_id,
  -- Concaténer tous les produits, triés par date, séparés par une virgule
  STRING_AGG(produit, ', ' ORDER BY date_achat)     AS historique_achats,
  -- DISTINCT = dédupliquer (si le même produit acheté plusieurs fois)
  STRING_AGG(DISTINCT categorie, ' | ')              AS categories_uniques,
  -- Compter le nombre d'éléments avant agrégation
  COUNT(*) AS nb_achats
FROM achats
GROUP BY client_id;

-- ── Snowflake ─────────────────────────────────────────────────────
SELECT
  client_id,
  -- LISTAGG = équivalent de STRING_AGG dans Snowflake
  -- WITHIN GROUP (ORDER BY ...) pour trier les éléments
  LISTAGG(produit, ', ') WITHIN GROUP (ORDER BY date_achat) AS historique_achats
FROM achats
GROUP BY client_id;

-- ── Variante : construire une liste JSON (pour APIs) ──────────────
SELECT
  client_id,
  -- Construire manuellement un tableau JSON d'IDs
  '[' || STRING_AGG('"' || produit_id || '"', ',') || ']' AS produits_json
FROM achats
GROUP BY client_id;`,
  },
  {
    id: "sql-exists", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Filtres",
    titre: "EXISTS vs IN — filtrer sur un sous-ensemble efficacement",
    desc: "Question fréquente : 'quels clients ont passé au moins une commande de plus de 1000€ ?' ou 'quels clients n'ont jamais commandé ?'. EXISTS est conçu pour ça : il retourne vrai dès qu'il trouve une ligne correspondante et s'arrête (plus rapide qu'un JOIN sur de grandes tables). NOT EXISTS pour la logique inverse.",
    code: `-- ── EXISTS : sélectionner selon une condition sur une autre table ─
-- OBJECTIF : clients ayant au moins 1 commande de plus de 1 000€
-- EXISTS s'arrête dès qu'il trouve une ligne correspondante → très rapide
SELECT c.client_id, c.nom, c.email
FROM clients c
WHERE EXISTS (
  SELECT 1          -- le SELECT 1 est une convention : on ne récupère pas de données
  FROM commandes o  -- juste vérifier l'existence d'une ligne
  WHERE o.client_id = c.id   -- lien entre la table principale et la sous-requête
    AND o.montant > 1000
    AND o.statut = 'validee'
);

-- ── NOT EXISTS : sélectionner ce qui N'EST PAS dans une autre table ─
-- OBJECTIF : clients n'ayant jamais commandé (churned ou prospects)
SELECT c.client_id, c.nom, c.date_inscription
FROM clients c
WHERE NOT EXISTS (
  SELECT 1
  FROM commandes o
  WHERE o.client_id = c.id  -- si cette sous-requête ne retourne rien → NOT EXISTS = vrai
);

-- ── IN : plus lisible pour des listes de valeurs fixes ────────────
-- OBJECTIF : filtrer sur une liste connue à l'avance
SELECT nom FROM clients
WHERE statut IN ('actif', 'premium', 'vip');       -- ✅ liste courte = lisible
-- WHERE statut NOT IN ('inactif', 'archivé')       -- exclure certains statuts

-- ── Quand utiliser quoi ? ─────────────────────────────────────────
-- ✅ EXISTS    → condition sur une autre table, grandes tables (s'arrête au 1er match)
-- ✅ NOT EXISTS → "ce qui n'existe pas dans l'autre table"
-- ✅ IN        → liste de valeurs fixes courte (< 100 valeurs)
-- ⚠️ IN avec sous-requête → peut être lent sur de grandes tables, préférer EXISTS`,
  },
  {
    id: "sql-having", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Agrégation",
    titre: "GROUP BY + HAVING — filtrer APRÈS l'agrégation",
    desc: "WHERE et HAVING filtrent des données, mais à des moments différents. WHERE filtre les lignes AVANT le calcul des agrégats (COUNT, SUM...), HAVING filtre les groupes APRÈS. Cas concrets : trouver les clients avec plus de 5 commandes (HAVING COUNT > 5), détecter les emails en doublon (HAVING COUNT > 1), identifier les produits sous-performants.",
    code: `-- RÈGLE FONDAMENTALE :
-- WHERE  = filtre les LIGNES avant l'agrégation (ne peut pas utiliser COUNT, SUM, etc.)
-- HAVING = filtre les GROUPES après l'agrégation (peut utiliser COUNT, SUM, etc.)

SELECT
  client_id,
  COUNT(*)     AS nb_commandes,
  SUM(montant) AS ca_total,
  AVG(montant) AS panier_moyen
FROM commandes
-- WHERE s'exécute AVANT le GROUP BY : réduit le volume de données
WHERE statut = 'validee'             -- exclure les non-validées (impossible dans HAVING)
  AND date_commande >= '2026-01-01'  -- restreindre la période
GROUP BY client_id
-- HAVING s'exécute APRÈS le GROUP BY : filtre les groupes calculés
HAVING COUNT(*) >= 5                 -- garder seulement les clients avec 5+ commandes
   AND SUM(montant) > 500;           -- ET dont le CA total est > 500€

-- ── Cas d'usage classique : détecter les doublons ────────────────
-- Question : quels emails apparaissent plusieurs fois dans la table ?
SELECT
  email,
  COUNT(*) AS nb_occurrences
FROM clients
GROUP BY email
HAVING COUNT(*) > 1   -- seulement les emails qui apparaissent plus d'une fois
ORDER BY nb_occurrences DESC;
-- Ce type de requête est incontournable lors d'un audit qualité de données`,
  },
  {
    id: "sql-union", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "Union",
    titre: "UNION ALL vs UNION — combiner plusieurs sources de données",
    desc: "Vous avez les commandes dans 3 tables séparées (web, mobile, boutique) mais votre rapport veut tout consolider. UNION ALL empile les résultats sans déduplication — c'est l'option à utiliser par défaut (plus rapide). UNION supprime les doublons mais est plus coûteux. EXCEPT identifie ce qui était présent avant et a disparu (clients perdus, données supprimées).",
    code: `-- ── UNION ALL : empiler des tables (SANS suppression des doublons) ─
-- Cas d'usage : consolider les commandes de plusieurs sources
-- TOUJOURS préférer UNION ALL à UNION sauf besoin explicite de dédup
SELECT client_id, montant, 'web'    AS canal, date FROM commandes_web
UNION ALL
SELECT client_id, montant, 'mobile' AS canal, date FROM commandes_mobile
UNION ALL
SELECT client_id, montant, 'shop'   AS canal, date FROM commandes_boutique;
-- Note : les colonnes doivent être dans le même ordre et du même type dans chaque SELECT
-- Les noms de colonnes du résultat sont ceux du PREMIER SELECT

-- ── UNION : empiler EN supprimant les doublons ────────────────────
-- Cas d'usage : liste d'emails uniques de plusieurs pays (peut apparaître partout)
-- ⚠️ Plus lent que UNION ALL car effectue un DISTINCT implicite
SELECT email FROM clients_france
UNION
SELECT email FROM clients_belgique;
-- Équivalent à : UNION ALL + DISTINCT sur le résultat

-- ── EXCEPT : trouver ce qui est dans A mais PAS dans B ────────────
-- Cas d'usage : identifier les clients perdus entre deux périodes
SELECT client_id FROM clients_actifs_2025
EXCEPT
SELECT client_id FROM clients_actifs_2026;
-- Résultat : clients qui étaient actifs en 2025 mais plus en 2026`,
  },
  {
    id: "sql-json", cat: "SQL", lang: "sql", emoji: "🗄️", theme: "JSON",
    titre: "Extraction JSON — lire des colonnes semi-structurées",
    desc: "Les APIs modernes stockent souvent leurs données en JSON dans une colonne. Plutôt que d'extraire le JSON en Python puis de le recharger, vous pouvez l'interroger directement en SQL. Cas réels : table d'events avec un champ 'payload' JSON, webhooks Stripe/Salesforce, logs d'application. Ce snippet couvre BigQuery, Snowflake et PostgreSQL.",
    code: `-- Exemple de données : colonne 'payload' contient
-- {"event_type":"purchase","user":{"id":"u123","email":"jean@example.com"},"items":[{"product":"Laptop","qty":1}]}

-- ── BigQuery : fonctions JSON_VALUE et JSON_QUERY ──────────────────
SELECT
  event_id,
  -- JSON_VALUE : extraire une valeur scalaire (string, number) → retourne TEXT
  JSON_VALUE(payload, '$.event_type')        AS type_evenement,
  JSON_VALUE(payload, '$.user.id')           AS user_id,      -- chemin imbriqué avec .
  JSON_VALUE(payload, '$.user.email')        AS email,
  JSON_VALUE(payload, '$.items[0].product')  AS premier_produit, -- 1er élément du tableau
  -- JSON_QUERY : extraire un objet ou un tableau entier → retourne JSON
  JSON_QUERY(payload, '$.items')             AS items_json_complet
FROM events
WHERE JSON_VALUE(payload, '$.event_type') = 'purchase';  -- filtrer sur un champ JSON

-- ── Snowflake : notation native avec : et :: pour caster ──────────
SELECT
  payload:event_type::STRING            AS type_evenement,   -- :: = cast de type
  payload:user:id::STRING               AS user_id,          -- imbrication avec :
  payload:user:email::STRING            AS email,
  payload:items[0]:product::STRING      AS premier_produit,  -- [0] = premier élément

  -- LATERAL FLATTEN : "exploser" un tableau JSON en plusieurs lignes
  -- (une ligne par produit commandé)
  f.value:product::STRING               AS produit,
  f.value:qty::INTEGER                  AS quantite
FROM events,
  LATERAL FLATTEN(input => payload:items) f  -- f = alias pour chaque élément du tableau
WHERE payload:event_type::STRING = 'purchase';

-- ── PostgreSQL : opérateurs -> et ->> ─────────────────────────────
SELECT
  payload->>'event_type'               AS type_evenement,  -- ->> = retourne TEXT
  payload->'user'->>'id'               AS user_id,         -- -> navigue dans l'objet
  payload->'items'->0->>'product'      AS premier_produit  -- ->0 = index du tableau
FROM events;`,
  },
  /* ── Python ───────────────────────────────────────────── */
  {
    id: "py-profiling", cat: "Python", lang: "python", emoji: "🐍", theme: "EDA",
    titre: "Profiling rapide d'un DataFrame",
    desc: "Vous venez de recevoir un dataset inconnu (export Salesforce, dump BDD, fichier Redshift) et vous devez comprendre sa structure en 30 secondes. Cette fonction retourne en une vue synthétique : types des colonnes, nombre de valeurs renseignées, pourcentage de données manquantes, nombre de valeurs uniques, et un exemple de valeur. C'est le premier réflexe à avoir sur tout nouveau dataset, avant tout nettoyage ou modélisation.",
    code: `import pandas as pd

# OBJECTIF : obtenir une vue d'ensemble d'un DataFrame en une seule instruction
# Utile dès la réception d'un dataset inconnu — avant tout nettoyage

def quick_profile(df: pd.DataFrame) -> pd.DataFrame:
    # Construire un tableau récapitulatif colonne par colonne
    return pd.DataFrame({
        # Type de données de chaque colonne (int64, float64, object, datetime64...)
        "dtype":    df.dtypes,

        # Nombre de valeurs non-nulles (total - nulls)
        "non_null": df.notna().sum(),

        # Pourcentage de valeurs manquantes
        # > 40% → décider si on supprime la colonne ou on impute
        "null_pct": (df.isna().mean() * 100).round(1),

        # Nombre de valeurs distinctes
        # nunique = 1 → colonne constante, inutile pour un modèle
        # nunique ≈ len(df) et dtype=object → probablement une clé primaire
        "unique":   df.nunique(),

        # Première valeur comme exemple pour comprendre le format réel des données
        "sample":   df.iloc[0],
    })

# Usage : appeler en début d'analyse sur n'importe quel DataFrame
profile = quick_profile(df)
print(profile.to_string())`,
  },
  {
    id: "py-clean-cols", cat: "Python", lang: "python", emoji: "🐍", theme: "Nettoyage",
    titre: "Nettoyage automatique des noms de colonnes",
    desc: "Vous chargez un fichier Excel ou un export CRM avec des colonnes nommées 'Prénom Client', 'CA (€) 2025', 'Nb. Commandes / mois'. Accéder à ces colonnes en Python avec des espaces, accents et caractères spéciaux est un cauchemar. Cette fonction normalise tous les noms en snake_case ASCII automatiquement. Résultat : df['Prénom Client'] devient df.prenom_client, accessible sans guillemets. Indispensable avant tout travail sur des données issues d'Excel ou d'outils métier.",
    code: `import re
import unicodedata

# OBJECTIF : transformer tous les noms de colonnes en snake_case propre et sans accents
# Cas d'usage : fichiers Excel, exports CRM, données issues de formulaires, CSV métier

def clean_columns(df):
    def slugify(s):
        # Étape 1 : décomposer les caractères accentués en base + accent
        # "é" devient "e" + accent_aigu, "ç" devient "c" + cedille
        s = unicodedata.normalize("NFKD", s)

        # Étape 2 : encoder en ASCII en ignorant les diacritiques
        # "prénom" → "prenom", "naïf" → "naif", "CA (€)" → "CA ()"
        s = s.encode("ascii", "ignore").decode()

        # Étape 3 : remplacer tout caractère non-alphanumérique par un underscore
        # Espaces, tirets, parenthèses, points, slashes... → _
        # strip("_") : supprimer les _ en début et fin
        s = re.sub(r"[^a-zA-Z0-9]+", "_", s).strip("_").lower()
        return s

    # Appliquer la normalisation sur chaque nom de colonne du DataFrame
    df.columns = [slugify(c) for c in df.columns]
    return df

# Avant : ['Prénom Client', 'CA (€) 2025', 'Nb. Commandes / mois']
# Après : ['prenom_client', 'ca_2025', 'nb_commandes_mois']
df = clean_columns(df)
print(df.columns.tolist())

# ⚠️ À vérifier : si deux colonnes donnent le même nom après nettoyage
# ex: 'CA (€)' et 'CA (%)' → 'ca' et 'ca' → collision silencieuse
# Contrôle : assert len(set(df.columns)) == len(df.columns), "Colonnes en doublon !"`,
  },
  {
    id: "py-sklearn-pipeline", cat: "Python", lang: "python", emoji: "🐍", theme: "Machine Learning",
    titre: "Pipeline sklearn complet",
    desc: "Vous avez un dataset avec des colonnes numériques (age, revenu) et catégorielles (region, segment). Sans Pipeline, vous risquez un data leak critique : si vous fittez le scaler ou l'imputer sur tout le dataset avant le split train/test, votre modèle 'voit' indirectement les données de test via les statistiques calculées. Le Pipeline garantit que tous les préprocessings s'apprennent uniquement sur le train set. Bonus : en production, preprocessing + modèle se déploient d'un seul bloc avec pipeline.predict(X_nouveau).",
    code: `from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import cross_val_score

# Séparer les colonnes par type : traitement différent pour num vs catégoriel
num_features = ["age", "revenu", "anciennete"]  # colonnes avec des nombres
cat_features = ["region", "segment"]            # colonnes avec des textes

# ── PREPROCESSOR : transformations séparées selon le type de colonne ──
# ColumnTransformer applique des traitements différents en parallèle
preprocessor = ColumnTransformer([
    # Traitement des colonnes NUMÉRIQUES
    ("num", Pipeline([
        # Étape 1 : remplacer les NaN par la médiane de chaque colonne
        # strategy="median" est plus robuste que "mean" si des outliers sont présents
        ("impute", SimpleImputer(strategy="median")),
        # Étape 2 : standardiser (moyenne=0, écart-type=1)
        # Nécessaire pour les algos sensibles à l'échelle (régression linéaire, SVM, KNN)
        ("scale",  StandardScaler()),
    ]), num_features),

    # Traitement des colonnes CATÉGORIELLES
    ("cat", Pipeline([
        # Étape 1 : remplacer les NaN par la valeur la plus fréquente du groupe
        ("impute", SimpleImputer(strategy="most_frequent")),
        # Étape 2 : one-hot encoding — convertir en colonnes binaires (0/1)
        # handle_unknown="ignore" CRUCIAL : en prod, une valeur non vue à l'entraînement
        # (ex: nouvelle région) ne plantera pas, elle aura juste toutes ses colonnes à 0
        ("encode", OneHotEncoder(handle_unknown="ignore")),
    ]), cat_features),
])

# ── PIPELINE FINAL : preprocessing + modèle en une seule chaîne ───────
# L'ordre est crucial : le preprocessor DOIT être avant le modèle
pipeline = Pipeline([
    ("prep",   preprocessor),
    # GradientBoosting : solide par défaut sur les données tabulaires structurées
    ("model",  GradientBoostingClassifier(n_estimators=200, random_state=42)),
])

# ── ÉVALUATION SANS DATA LEAK ─────────────────────────────────────────
# cross_val_score refit le pipeline complet à chaque fold
# → l'imputer et le scaler apprennent uniquement sur les 4 folds d'entraînement
# → le fold de test est toujours "inconnu" du preprocessing
scores = cross_val_score(pipeline, X, y, cv=5, scoring="roc_auc")
print(f"AUC : {scores.mean():.3f} ± {scores.std():.3f}")

# ── DÉPLOIEMENT : entraîner une dernière fois sur tout le dataset ──────
pipeline.fit(X, y)
# Sauvegarder le pipeline complet (preprocessing + modèle) en un seul fichier
# import joblib; joblib.dump(pipeline, "model.pkl")
# En production : pipeline = joblib.load("model.pkl"); pipeline.predict(X_nouveau)`,
  },
  {
    id: "py-feature-importance", cat: "Python", lang: "python", emoji: "🐍", theme: "Machine Learning",
    titre: "Feature importance avec SHAP",
    desc: "Votre modèle XGBoost prédit le churn avec une AUC de 0.87, mais votre direction veut savoir 'pourquoi ce client va partir'. Les feature importances classiques de sklearn (basées sur les impuretés des noeuds) donnent un score global biaisé pour les features corrélées. SHAP (SHapley Additive exPlanations) calcule la contribution exacte de chaque feature pour chaque prédiction individuelle, avec le signe : positif = pousse vers churn, négatif = retient le client. C'est devenu le standard de l'explicabilité en ML.",
    code: `import shap
import xgboost as xgb
import matplotlib.pyplot as plt

# Entraîner le modèle (SHAP fonctionne aussi avec RandomForest, LightGBM, CatBoost...)
model = xgb.XGBClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ── Initialiser l'explainer SHAP ──────────────────────────────────────
# TreeExplainer est optimisé pour les modèles à base d'arbres décisionnels
# Il utilise l'algorithme SHAP exact (pas une approximation) → plus lent mais précis
# Pour les modèles non-arborescents (régression, SVM), utiliser shap.KernelExplainer
explainer = shap.TreeExplainer(model)

# Calculer les valeurs SHAP pour chaque ligne du jeu de test
# shap_values : matrice de shape (n_samples, n_features)
# Pour chaque ligne : sum(shap_values[i]) + expected_value = log-odds de la prédiction
shap_values = explainer.shap_values(X_test)

# ── GRAPHIQUE 1 : importance globale (bar plot) ───────────────────────
# Moyenne des valeurs absolues : quelle feature a le plus d'impact en général ?
# Réponse à : "quelles sont les 5 variables les plus influentes du modèle ?"
shap.summary_plot(shap_values, X_test, plot_type="bar")

# ── GRAPHIQUE 2 : beeswarm plot (distribution des impacts) ────────────
# Chaque point = une prédiction, couleur = valeur de la feature
# Rouge = valeur haute, Bleu = valeur basse
# Position X = impact sur la prédiction (droite = pousse vers churn)
# Ce graphique révèle les non-linéarités et interactions
shap.summary_plot(shap_values, X_test)

# ── GRAPHIQUE 3 : explication d'une prédiction individuelle ───────────
# Force plot : pourquoi CE CLIENT PRÉCIS est prédit comme churner ?
# Flèches rouges = features qui poussent vers churn
# Flèches bleues = features qui retiennent le client
# Très utile pour expliquer une décision à un commercial ou service client
shap.force_plot(
    explainer.expected_value,  # valeur de base : prédiction "sans information"
    shap_values[0],            # contribution de chaque feature pour la 1ère ligne
    X_test.iloc[0]             # valeurs réelles des features de ce client
)`,
  },
  {
    id: "py-eda-stats", cat: "Python", lang: "python", emoji: "🐍", theme: "EDA",
    titre: "EDA complète — stats descriptives avancées",
    desc: "df.describe() montre count, mean, std, min, quartiles, max — mais c'est insuffisant. La skewness (asymétrie) révèle si vos données sont étalées vers la droite (revenus, valeurs de panier, durées de session) : crucial car beaucoup d'algorithmes supposent une distribution symétrique. La kurtosis mesure les queues lourdes : une forte kurtosis signale des outliers fréquents. Ce snippet calcule toutes ces statistiques pour chaque colonne numérique, plus un résumé des variables catégorielles.",
    code: `import pandas as pd
import numpy as np

# OBJECTIF : statistiques descriptives complètes, au-delà de df.describe()
# À lancer en début de tout projet sur un nouveau dataset

def eda_complete(df: pd.DataFrame) -> pd.DataFrame:
    # Sélectionner uniquement les colonnes numériques (int, float)
    num_cols = df.select_dtypes(include=[np.number]).columns
    stats = pd.DataFrame(index=num_cols)

    # ── Complétude des données ─────────────────────────────────────────
    stats['count']    = df[num_cols].count()  # nombre de valeurs non-nulles
    # > 40% de nulls → décider : supprimer la colonne ou imputer ?
    stats['null_pct'] = (df[num_cols].isna().mean() * 100).round(1)

    # ── Statistiques de tendance centrale ─────────────────────────────
    stats['mean']     = df[num_cols].mean().round(3)    # moyenne (sensible aux outliers)
    stats['std']      = df[num_cols].std().round(3)     # écart-type : dispersion

    # ── Distribution complète (les 5 points de la boîte à moustaches) ─
    stats['min']      = df[num_cols].min()
    stats['p25']      = df[num_cols].quantile(0.25)  # 1er quartile
    stats['median']   = df[num_cols].median()        # médiane = p50 (robuste aux outliers)
    stats['p75']      = df[num_cols].quantile(0.75)  # 3ème quartile
    stats['max']      = df[num_cols].max()

    # ── Forme de la distribution (crucial pour choisir les bons algos) ─
    # Skewness (asymétrie) :
    # ≈ 0 : distribution symétrique (idéal)
    # > 1 : queue vers la droite (ex: CA, revenus) → envisager log-transform
    # < -1 : queue vers la gauche (ex: taux de succès élevé)
    stats['skewness'] = df[num_cols].skew().round(3)

    # Kurtosis (aplatissement vs gaussienne) :
    # > 3 : queues lourdes, outliers fréquents (transactions financières)
    # < 0 : distribution aplatie, peu d'outliers
    stats['kurtosis'] = df[num_cols].kurtosis().round(3)

    return stats

print(eda_complete(df).to_string())

# ── Variables catégorielles ────────────────────────────────────────────
# Pour chaque colonne texte : nombre de valeurs uniques + top 5 des fréquences
for col in df.select_dtypes(include='object').columns:
    print(f"\\n{col}: {df[col].nunique()} valeurs uniques")
    # normalize=True → pourcentages au lieu de counts bruts
    print(df[col].value_counts(normalize=True).head(5).mul(100).round(1))
    # nunique = 1 → colonne constante, aucune information pour le modèle
    # nunique ≈ len(df) → probablement un identifiant, à exclure des features`,
  },
  {
    id: "py-outliers", cat: "Python", lang: "python", emoji: "🐍", theme: "Nettoyage",
    titre: "Détection des outliers — IQR et z-score",
    desc: "Votre dataset contient un montant de -999€ (erreur de saisie), un âge de 250 ans (bug informatique), un CA de 10 millions quand la médiane est à 1 500€ (réel mais aberrant). Ces valeurs faussent les statistiques, font diverger les régressions, et révèlent souvent des problèmes de données en amont. Méthode IQR : robuste, recommandée par défaut, ne suppose pas de distribution normale. Méthode z-score : assume la normalité, à éviter sur des distributions très asymétriques. En production, on winsorise plutôt qu'on supprime.",
    code: `import pandas as pd
import numpy as np

# ── MÉTHODE 1 : IQR (Interquartile Range) ─────────────────────────────
# Méthode standard, recommandée par défaut
# Avantage : fonctionne même si la distribution n'est pas normale
def detect_outliers_iqr(df: pd.DataFrame, col: str, factor: float = 1.5):
    """
    factor=1.5 : seuil classique de la boîte à moustaches (Tukey)
    factor=3.0 : seuil permissif, seulement les outliers extrêmes
    """
    Q1, Q3 = df[col].quantile([0.25, 0.75])  # 1er et 3ème quartile
    IQR = Q3 - Q1                             # amplitude de l'écart interquartile
    # Tout ce qui est hors de ces bornes est considéré outlier
    lower, upper = Q1 - factor * IQR, Q3 + factor * IQR
    mask = (df[col] < lower) | (df[col] > upper)
    print(f"{col} — {mask.sum()} outliers ({mask.mean()*100:.1f}%)")
    print(f"  Bornes IQR : [{lower:.2f}, {upper:.2f}]")
    return df[mask]  # retourne uniquement les lignes identifiées comme outliers

# ── MÉTHODE 2 : z-score ───────────────────────────────────────────────
# Un z-score de 3 = la valeur est à 3 écarts-types de la moyenne
# Pour une distribution normale : 99.7% des valeurs sont dans [-3, +3]
# ⚠️ À éviter sur des données asymétriques (CA, revenus) — préférer IQR
def detect_outliers_zscore(df: pd.DataFrame, col: str, threshold: float = 3.0):
    z = (df[col] - df[col].mean()) / df[col].std()  # normaliser à moyenne=0, std=1
    mask = z.abs() > threshold
    return df[mask]

# ── Appliquer sur toutes les colonnes numériques ───────────────────────
num_cols = df.select_dtypes(include=np.number).columns
for col in num_cols:
    detect_outliers_iqr(df, col)

# ── WINSORIZING : remplacer les outliers par les bornes ───────────────
# PRÉFÉRABLE À LA SUPPRESSION : préserve le nombre de lignes du dataset
# Cas d'usage : features ML où supprimer des lignes brise le lien avec la cible
from scipy.stats import mstats
df_capped = df.copy()
for col in num_cols:
    # limits=[0.01, 0.01] = remplacer le 1% inférieur et le 1% supérieur
    # Ajuster selon les besoins : [0.05, 0.05] = plus agressif, écrête plus de valeurs
    df_capped[col] = mstats.winsorize(df[col], limits=[0.01, 0.01])`,
  },
  {
    id: "py-missing", cat: "Python", lang: "python", emoji: "🐍", theme: "Nettoyage",
    titre: "Valeurs manquantes — analyse et traitement complet",
    desc: "Votre dataset a 23% de nulls sur 'revenus_annuels', 45% sur 'score_credit', et 0.2% sur 'date_naissance'. Supprimer toutes les lignes avec des nulls vous ferait perdre plus de la moitié de vos données. Ce snippet audite d'abord les données manquantes (volume, pourcentage, pattern), puis applique la stratégie adaptée : médiane pour les numériques (robuste aux outliers), mode pour les catégorielles, KNN pour les cas où plusieurs colonnes sont corrélées. Les colonnes trop lacunaires (> 40%) sont supprimées.",
    code: `import pandas as pd
import numpy as np
from sklearn.impute import SimpleImputer, KNNImputer

# ── ÉTAPE 1 : audit complet des valeurs manquantes ─────────────────────
# Ne garder que les colonnes avec au moins 1 null, triées par % décroissant
missing = pd.DataFrame({
    'count':   df.isna().sum(),
    'pct':     (df.isna().mean() * 100).round(1),  # pourcentage de nulls
    'dtype':   df.dtypes,                           # type de la colonne
}).query('count > 0').sort_values('pct', ascending=False)
print(missing)
# Décision guidée par 'pct' :
# < 5%  → imputer sans hésiter
# 5-40% → imputer avec la bonne stratégie
# > 40% → envisager de supprimer la colonne (trop peu d'information fiable)

# ── ÉTAPE 2 : visualisation des patterns de données manquantes ─────────
# (nécessite : pip install missingno)
# Les nulls sont-ils aléatoires (MCAR) ou systématiques (MNAR) ?
# import missingno as msno; msno.matrix(df)

# ── ÉTAPE 3 : stratégies d'imputation selon le type de colonne ─────────

# Numériques → médiane (robuste aux outliers, contrairement à la moyenne)
# Ex: si revenus a des outliers à 10M€, la médiane ne sera pas tirée vers le haut
imputer_num = SimpleImputer(strategy='median')
df[num_cols] = imputer_num.fit_transform(df[num_cols])

# Catégorielles → mode (valeur la plus fréquente)
# Ex: 'region' avec 2% de nulls → remplacer par la région dominante du dataset
imputer_cat = SimpleImputer(strategy='most_frequent')
df[cat_cols] = imputer_cat.fit_transform(df[cat_cols])

# KNN imputer — cherche les k lignes les plus similaires pour imputer
# Meilleur résultat quand les colonnes sont corrélées entre elles
# Plus lent : éviter sur des datasets > 100k lignes
knn_imputer = KNNImputer(n_neighbors=5)
df[num_cols] = knn_imputer.fit_transform(df[num_cols])

# ── ÉTAPE 4 : supprimer les colonnes avec trop de NaN (> 40%) ─────────
# Une colonne avec 40%+ de valeurs manquantes apporte peu d'information fiable
df = df.loc[:, df.isna().mean() < 0.40]

# ── ÉTAPE 5 : supprimer les lignes sans valeur sur les colonnes clés ───
# La cible (target), les dates, et les identifiants ne peuvent pas être imputés
df = df.dropna(subset=['target', 'date', 'client_id'])`,
  },
  {
    id: "py-correlation", cat: "Python", lang: "python", emoji: "🐍", theme: "EDA",
    titre: "Corrélations et heatmap",
    desc: "Avant de construire un modèle de régression ou de classification, vous devez identifier les variables qui expliquent votre cible (corrélation élevée avec la cible) et celles qui apportent exactement la même information (multicolinéarité). Inclure 'montant_HT' et 'montant_TTC' ensemble dans un modèle linéaire fausse les coefficients et rend le modèle instable. Ce snippet produit une heatmap lisible, trie les features par corrélation avec la cible, et liste automatiquement les paires multicolinéaires à investiguer.",
    code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Calculer la matrice de corrélation sur toutes les colonnes numériques
# corr() utilise le coefficient de Pearson : mesure les relations linéaires
# Pour les relations non-linéaires, utiliser df.corr(method='spearman')
corr = df.select_dtypes(include=np.number).corr()

# ── HEATMAP : visualiser la matrice de corrélation ─────────────────────
fig, ax = plt.subplots(figsize=(12, 10))
# mask : cacher le triangle supérieur pour éviter les doublons (matrice symétrique)
mask = np.triu(np.ones_like(corr, dtype=bool))
sns.heatmap(
    corr, mask=mask,
    annot=True, fmt=".2f",   # afficher les valeurs dans chaque cellule
    cmap="RdYlGn",            # rouge = corrélation négative, vert = positive
    center=0, vmin=-1, vmax=1,
    linewidths=0.5, ax=ax
)
ax.set_title("Matrice de corrélation")
plt.tight_layout()
plt.show()

# ── FEATURES LES PLUS CORRÉLÉES AVEC LA CIBLE ─────────────────────────
# Les features avec une corrélation absolue élevée avec 'target' seront
# généralement les plus utiles pour la prédiction
# ⚠️ Corrélation faible ≠ feature inutile : les relations non-linéaires ne sont pas captées
target_corr = corr['target'].drop('target').abs().sort_values(ascending=False)
print("Top corrélations avec la cible :")
print(target_corr.head(10))

# ── DÉTECTION DE LA MULTICOLINÉARITÉ ──────────────────────────────────
# Si deux features ont une corrélation > 0.85 entre elles :
# → Dans un modèle linéaire : les coefficients deviennent instables (variance inflation)
# → Dans un RandomForest/GBM : moins problématique mais les features_importances sont dilués
high_corr = []
for i in range(len(corr.columns)):
    for j in range(i+1, len(corr.columns)):
        if abs(corr.iloc[i, j]) > 0.85:
            high_corr.append((corr.columns[i], corr.columns[j], round(corr.iloc[i, j], 2)))
# Action : pour chaque paire listée, en garder une ou créer une feature combinée
print("\\nPaires très corrélées (> 0.85) :", high_corr)`,
  },
  {
    id: "py-groupby", cat: "Python", lang: "python", emoji: "🐍", theme: "Agrégation",
    titre: "Groupby + agrégations multiples",
    desc: "Vous avez un DataFrame de transactions (une ligne par commande) et vous devez agréger par segment client pour obtenir : clients uniques, CA total, CA moyen, panier médian, nombre de commandes, date de dernière commande. C'est le même raisonnement qu'un GROUP BY SQL mais en pandas. Ce snippet couvre tous les patterns : nommage propre des colonnes résultantes, fonctions custom, transform() pour ajouter une colonne agrégée sans réduire le DataFrame, et pivot_table pour un tableau croisé.",
    code: `import pandas as pd

# ── Agrégations multiples avec nommage explicite ───────────────────────
# La syntaxe agg(nouvelle_colonne=('colonne_source', 'fonction')) est la plus lisible
# Éviter df.groupby('x')['y'].agg({'a': 'sum', 'b': 'mean'}) : syntaxe dépréciée
agg = df.groupby('segment').agg(
    nb_clients    = ('client_id',   'nunique'),  # clients distincts (pas count !)
    ca_total      = ('montant',     'sum'),       # CA total du segment
    ca_moyen      = ('montant',     'mean'),      # CA moyen par commande
    ca_median     = ('montant',     'median'),    # médiane (robuste aux outliers)
    nb_commandes  = ('commande_id', 'count'),     # nombre total de commandes
    date_derniere = ('date',        'max'),       # date de la dernière commande
).round(2)

# ── Fonctions d'agrégation custom ─────────────────────────────────────
# Cas d'usage : logique métier impossible avec les fonctions standard
agg2 = df.groupby('region').agg(
    # Somme conditionnelle (CA sans les lignes de type 'taxe')
    ca_hors_taxes = ('montant', lambda x: x[df.loc[x.index, 'type'] != 'taxe'].sum()),
    # Produit le plus fréquent du groupe
    top_produit   = ('produit', lambda x: x.value_counts().index[0]),
)

# ── Groupby multi-niveaux + reset_index ───────────────────────────────
# reset_index() : transformer l'index hiérarchique en colonnes normales
# Sans reset_index, 'annee', 'mois', 'region' restent dans l'index (difficile à manipuler)
df_monthly = df.groupby(['annee', 'mois', 'region'])['ca'].sum().reset_index()

# ── TRANSFORM : ajouter une colonne agrégée SANS réduire le DataFrame ─
# Contrairement à groupby().agg() qui produit une ligne par groupe,
# transform() retourne une valeur pour CHAQUE ligne (même nombre de lignes)
# Cas d'usage : calculer la part de chaque ligne dans son groupe
df['ca_segment']     = df.groupby('segment')['montant'].transform('sum')
df['pct_du_segment'] = df['montant'] / df['ca_segment'] * 100
# Résultat : chaque ligne a sa valeur ET la contribution en % à son segment

# ── PIVOT TABLE : équivalent du tableau croisé dynamique Excel ─────────
# margins=True : ajoute une ligne/colonne "Total" automatiquement
pivot = df.pivot_table(
    values='montant', index='region', columns='trimestre',
    aggfunc='sum', fill_value=0, margins=True
)`,
  },
  {
    id: "py-merge", cat: "Python", lang: "python", emoji: "🐍", theme: "Jointures",
    titre: "Merge / Join Pandas — tous les types",
    desc: "Vous avez 'clients' (une ligne par client) et 'commandes' (plusieurs lignes par client). Vous devez les assembler pour analyser les clients avec leurs commandes. L'erreur classique : faire un LEFT JOIN sans vérifier la cardinalité d'abord, et obtenir un DataFrame avec 10× plus de lignes qu'attendu parce qu'un client_id apparaissait plusieurs fois dans commandes. Ce snippet couvre les 4 types de JOIN et insiste sur la vérification de cardinalité avant tout merge en production.",
    code: `import pandas as pd

# ── INNER JOIN : ne garder QUE les lignes présentes des deux côtés ─────
# Équivalent SQL : SELECT * FROM clients INNER JOIN commandes USING (client_id)
# ⚠️ Les clients SANS commande sont perdus silencieusement — attention !
result = pd.merge(clients, commandes, on='client_id', how='inner')

# ── LEFT JOIN : garder TOUTES les lignes du DataFrame de gauche ────────
# Les clients sans commande auront des NaN dans les colonnes de 'commandes'
# C'est souvent le JOIN par défaut dans les analyses clients
result = pd.merge(clients, commandes, on='client_id', how='left')
# Identifier les clients sans aucune commande
clients_sans_commande = result[result['commande_id'].isna()]

# ── Clés avec des noms différents dans les deux DataFrames ────────────
# clients.id ↔ commandes.client_id (noms différents, même sens)
result = pd.merge(clients, commandes,
                  left_on='id', right_on='client_id', how='left')

# ── Jointure sur plusieurs colonnes ───────────────────────────────────
# Cas d'usage : réconcilier deux sources sur (date + produit_id) simultanément
result = pd.merge(df1, df2, on=['date', 'produit_id'], how='inner')

# ── Colonnes en commun (hors clé) : gérer les conflits de noms ────────
# Si df1 et df2 ont toutes les deux une colonne 'nom', pandas ajoute un suffixe
result = pd.merge(df1, df2, on='id', how='left',
                  suffixes=('_gauche', '_droite'))
# résultat : 'nom_gauche' (de df1) et 'nom_droite' (de df2)

# ── JOINTURE SUR L'INDEX ──────────────────────────────────────────────
# Plus rapide si les DataFrames ont déjà le bon index
result = df1.join(df2, how='left', rsuffix='_r')

# ── VÉRIFIER LA CARDINALITÉ AVANT DE MERGER ───────────────────────────
# TOUJOURS faire cette vérification avant un merge sur de vraies données
# Si client_id apparaît plusieurs fois dans commandes, chaque client sera dupliqué
print("Nb commandes par client (combien ont 1, 2, 3... commandes) :")
print(commandes.groupby('client_id').size().value_counts())

# Contrôle strict du résultat (à mettre dans les pipelines de production)
assert len(result) == len(clients), f"Doublon : {len(result)} lignes au lieu de {len(clients)}"`,
  },
  {
    id: "py-train-eval", cat: "Python", lang: "python", emoji: "🐍", theme: "Machine Learning",
    titre: "Split stratifié + évaluation complète d'un modèle",
    desc: "Vous avez entraîné un modèle de classification (churn, fraude, scoring) et vous voulez mesurer ses vraies performances. Un simple train_test_split sans stratify peut aboutir à un fold de test avec 0% de la classe minoritaire. La cross-validation avec 5 folds donne une estimation plus robuste que le split simple. Ce snippet est le template complet à avoir dans tout projet de classification : split stratifié, CV multi-métriques, rapport final, et matrice de confusion.",
    code: `from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.metrics import (classification_report, roc_auc_score,
                              confusion_matrix, ConfusionMatrixDisplay)
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

# ── SPLIT STRATIFIÉ ────────────────────────────────────────────────────
# stratify=y : garantit que les proportions de classes (ex: 90% / 10%) sont
# conservées identiquement dans le train et le test
# Sans stratify sur un dataset déséquilibré, le test set peut avoir très peu
# d'exemples de la classe minoritaire → métriques peu fiables
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
# Vérifier que la stratification a fonctionné
print("Proportions Train/Test :", y_train.value_counts(normalize=True).round(3))

# ── CROSS-VALIDATION AVEC PLUSIEURS MÉTRIQUES ─────────────────────────
# StratifiedKFold : à chaque fold, conserve les proportions de classes
# 5 folds = standard : suffisant pour estimer la variance, pas trop lent
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
model = RandomForestClassifier(n_estimators=200, random_state=42)

scores = cross_validate(model, X_train, y_train, cv=cv,
    scoring=['roc_auc', 'f1', 'precision', 'recall'])

# Afficher moyenne ± écart-type pour chaque métrique
# Un grand écart-type signale une instabilité du modèle selon les données
for metric, vals in scores.items():
    if metric.startswith('test_'):
        print(f"{metric[5:]:12} : {vals.mean():.3f} ± {vals.std():.3f}")

# ── ÉVALUATION FINALE SUR LE TEST SET (une seule fois, à la fin) ──────
# ⚠️ Le test set ne doit être utilisé qu'UNE SEULE FOIS pour l'évaluation finale
# Y regarder plusieurs fois pendant le développement = data leak indirect
model.fit(X_train, y_train)
y_pred  = model.predict(X_test)             # classes prédites (0 ou 1)
y_proba = model.predict_proba(X_test)[:, 1] # probabilité d'appartenir à la classe 1

# classification_report : precision, recall, f1 par classe + weighted average
print("\\n" + classification_report(y_test, y_pred))
# AUC-ROC : robuste aux classes déséquilibrées, ne dépend pas du seuil de décision
print(f"AUC-ROC : {roc_auc_score(y_test, y_proba):.4f}")

# ── MATRICE DE CONFUSION ──────────────────────────────────────────────
# Révèle les faux positifs et faux négatifs
# Décision à prendre : coûtent-ils la même chose ? (souvent non en fraude, churn...)
ConfusionMatrixDisplay.from_predictions(y_test, y_pred)
plt.title("Matrice de confusion")
plt.show()`,
  },
  {
    id: "py-hyperparam", cat: "Python", lang: "python", emoji: "🐍", theme: "Machine Learning",
    titre: "Optimisation des hyperparamètres — GridSearch & Optuna",
    desc: "Votre modèle de base a une AUC de 0.84. Vous voulez trouver les meilleurs hyperparamètres pour gagner quelques points. GridSearch teste toutes les combinaisons (trop lent au-delà de 3 paramètres). RandomizedSearchCV tire n_iter combinaisons aléatoirement (bien meilleur rapport qualité/temps). Optuna va plus loin avec l'optimisation bayésienne : il apprend de chaque essai pour cibler les zones prometteuses. Pour un projet de production, Optuna avec 100 trials donne généralement les meilleurs résultats.",
    code: `from sklearn.model_selection import RandomizedSearchCV
from sklearn.ensemble import GradientBoostingClassifier
import optuna
optuna.logging.set_verbosity(optuna.logging.WARNING)

# ── OPTION 1 : RandomizedSearchCV ─────────────────────────────────────
# Tire aléatoirement n_iter=50 combinaisons dans l'espace de recherche
# Bien meilleur que GridSearchCV (qui testerait 4×5×4×4×4 = 1280 combinaisons)
param_dist = {
    'n_estimators':     [100, 200, 300, 500],
    'max_depth':        [3, 4, 5, 6, None],
    'learning_rate':    [0.01, 0.05, 0.1, 0.2],
    'subsample':        [0.7, 0.8, 0.9, 1.0],
    'min_samples_leaf': [1, 5, 10, 20],
}
search = RandomizedSearchCV(
    GradientBoostingClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=50,              # tester 50 combinaisons aléatoires
    cv=5,                   # cross-validation à 5 folds pour chaque combinaison
    scoring='roc_auc',      # métrique à optimiser
    n_jobs=-1,              # utiliser tous les cores disponibles
    random_state=42,
    verbose=1               # afficher la progression
)
search.fit(X_train, y_train)
print("Best AUC :", search.best_score_.round(4))
print("Best params :", search.best_params_)

# ── OPTION 2 : Optuna (optimisation bayésienne) ────────────────────────
# Contrairement à RandomizedSearchCV qui tire au hasard, Optuna apprend
# de chaque trial pour cibler les zones de l'espace prometteuses
# → trouve de meilleurs hyperparamètres avec moins de trials

def objective(trial):
    # trial.suggest_* définit le type et la plage de recherche pour chaque paramètre
    params = {
        # suggest_int : valeur entière entre 100 et 500
        'n_estimators':  trial.suggest_int('n_estimators', 100, 500),
        'max_depth':     trial.suggest_int('max_depth', 3, 6),
        # suggest_float avec log=True : explore mieux les petites valeurs (0.01, 0.03, 0.1...)
        'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3, log=True),
        'subsample':     trial.suggest_float('subsample', 0.6, 1.0),
    }
    model = GradientBoostingClassifier(**params, random_state=42)
    score = cross_val_score(model, X_train, y_train, cv=5, scoring='roc_auc')
    return score.mean()  # Optuna va maximiser cette valeur

# direction='maximize' : on veut maximiser l'AUC
study = optuna.create_study(direction='maximize')
# 100 trials : bon équilibre entre qualité et temps de calcul
study.optimize(objective, n_trials=100)
print("Best AUC :", study.best_value)
print("Best params :", study.best_params)`,
  },
  {
    id: "py-imbalanced", cat: "Python", lang: "python", emoji: "🐍", theme: "Machine Learning",
    titre: "Classes déséquilibrées — stratégies et solutions",
    desc: "Votre dataset de fraude a 99% de transactions normales et 1% de fraudes. Un modèle naïf prédisant toujours 'pas de fraude' atteint 99% d'accuracy mais détecte 0 fraude. Ce snippet présente 4 stratégies : class_weight='balanced' (le plus simple, un seul paramètre), poids manuels, SMOTE (générer des exemples synthétiques de la classe minoritaire), et Pipeline avec SMOTE. Les métriques adaptées sont le F1 et la balanced_accuracy, jamais l'accuracy classique.",
    code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.utils.class_weight import compute_class_weight
from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline
import numpy as np

# ── OPTION 1 : class_weight='balanced' ────────────────────────────────
# La solution la plus simple : un seul paramètre à changer
# Le modèle pénalise davantage les erreurs sur la classe minoritaire
# Équivalent à : donner un poids inversement proportionnel à la fréquence
model = RandomForestClassifier(class_weight='balanced', random_state=42)

# ── OPTION 2 : poids manuels calculés explicitement ───────────────────
# Utile si vous voulez voir les poids calculés ou les ajuster
weights = compute_class_weight('balanced', classes=np.unique(y_train), y=y_train)
# weights = [0.51, 50.0] → la classe minoritaire (1% des données) est 98× plus pondérée
cw = dict(enumerate(weights))  # {0: 0.51, 1: 50.0}
print("Poids des classes :", cw)
model = RandomForestClassifier(class_weight=cw, random_state=42)

# ── OPTION 3 : SMOTE (Synthetic Minority Over-sampling Technique) ─────
# Crée de NOUVELLES lignes synthétiques pour la classe minoritaire
# en interpolant entre des exemples existants (pas un simple dupliqué)
# sampling_strategy=0.3 : augmenter la minorité jusqu'à 30% de la majorité
smote = SMOTE(sampling_strategy=0.3, random_state=42)
X_res, y_res = smote.fit_resample(X_train, y_train)
print(f"Avant SMOTE : {y_train.value_counts().to_dict()}")
print(f"Après SMOTE : {pd.Series(y_res).value_counts().to_dict()}")
# ⚠️ SMOTE doit s'appliquer UNIQUEMENT sur le train set, jamais sur le test set

# ── OPTION 4 : Pipeline avec SMOTE (approche recommandée en CV) ───────
# Intégrer SMOTE dans le Pipeline garantit qu'il ne s'applique qu'au train set
# à chaque fold de la cross-validation (évite le data leak)
pipeline = ImbPipeline([
    ('smote', SMOTE(random_state=42)),
    ('model', RandomForestClassifier(random_state=42)),
])

# ── MÉTRIQUES ADAPTÉES AUX CLASSES DÉSÉQUILIBRÉES ─────────────────────
# accuracy = trompeuse (99% en prédisant toujours la classe majoritaire)
# F1 = moyenne harmonique precision/recall, sensible aux faux négatifs
# balanced_accuracy = accuracy moyennée par classe (meilleure sur les datasets déséquilibrés)
from sklearn.metrics import f1_score, balanced_accuracy_score
print("F1 :", f1_score(y_test, y_pred))
print("Balanced accuracy :", balanced_accuracy_score(y_test, y_pred))`,
  },
  {
    id: "py-mlflow", cat: "Python", lang: "python", emoji: "🐍", theme: "MLOps",
    titre: "MLflow — tracking complet d'une expérience",
    desc: "Vous avez lancé 15 expériences avec des hyperparamètres différents et vous ne savez plus laquelle donnait les meilleurs résultats. MLflow résout ce problème : il loggue automatiquement les paramètres, les métriques, le modèle sérialisé et les artefacts de chaque run. Vous visualisez ensuite tous vos runs dans une interface web (mlflow ui), comparez les métriques, et rechargez le meilleur modèle en une ligne. C'est le minimum pour faire du ML sérieux en équipe ou en production.",
    code: `import mlflow
import mlflow.sklearn
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import roc_auc_score, f1_score

# Créer (ou sélectionner si existant) l'expérience MLflow
# Toutes les expériences sont regroupées par nom dans l'interface
mlflow.set_experiment("churn-prediction")

# Le bloc 'with' garantit que le run est fermé proprement même en cas d'erreur
with mlflow.start_run(run_name="GBT_baseline"):

    # ── 1. Logger les hyperparamètres ─────────────────────────────────
    # Tous les paramètres qui influencent le comportement du modèle
    params = {"n_estimators": 200, "max_depth": 4, "learning_rate": 0.1}
    mlflow.log_params(params)

    # ── 2. Entraîner le modèle ────────────────────────────────────────
    model = GradientBoostingClassifier(**params, random_state=42)
    model.fit(X_train, y_train)

    # ── 3. Logger les métriques de performance ────────────────────────
    # Ce sont les valeurs qui apparaîtront dans la table comparative des runs
    y_pred  = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]
    mlflow.log_metric("auc", roc_auc_score(y_test, y_proba))
    mlflow.log_metric("f1",  f1_score(y_test, y_pred))

    # ── 4. Ajouter des tags (métadonnées libres) ───────────────────────
    # Utile pour filtrer par contexte dans l'interface
    mlflow.set_tags({"dataset": "clients_2026", "version": "v1"})

    # ── 5. Enregistrer le modèle dans le Model Registry ───────────────
    # registered_model_name crée une entrée versionnée dans le registry
    # → permet de promouvoir une version en Staging puis Production
    mlflow.sklearn.log_model(model, "model",
        registered_model_name="churn-gbt")

    # ── 6. Logger des artefacts (fichiers quelconques) ────────────────
    # Tout fichier utile pour reproduire ou analyser l'expérience
    import pandas as pd
    fi = pd.Series(model.feature_importances_, index=X.columns)
    fi.to_csv("feature_importance.csv")
    mlflow.log_artifact("feature_importance.csv")

print("Run ID :", mlflow.last_active_run().info.run_id)

# ── Lancer l'interface web pour explorer tous vos runs ────────────────
# Dans le terminal : mlflow ui
# Ouvrir : http://localhost:5000`,
  },
  {
    id: "py-time-series", cat: "Python", lang: "python", emoji: "🐍", theme: "Temporel",
    titre: "Séries temporelles — resampling et rolling stats",
    desc: "Vous avez des ventes quotidiennes sur 2 ans et votre direction veut : des ventes par semaine et par mois, la tendance lissée sur 7 jours (sans les pics week-end), la comparaison avec le même mois de l'année précédente (YoY), et une décomposition tendance/saisonnalité pour comprendre les cycles. Ce snippet couvre tous ces besoins en pandas, en partant d'une colonne datetime. Pré-requis : la date doit être en index DatetimeIndex.",
    code: `import pandas as pd

# Pré-requis : la colonne date doit être l'index du DataFrame
# parse_dates=['date'] : convertir la colonne en datetime
# index_col='date' : l'utiliser comme index
df = pd.read_csv("data.csv", parse_dates=['date'], index_col='date')

# ── RESAMPLING : agréger à une fréquence moins fine (downsample) ───────
# 'D' = jour, 'W' = semaine, 'ME' = fin de mois, 'QE' = fin de trimestre
daily   = df['ventes'].resample('D').sum()
weekly  = df['ventes'].resample('W').sum()
# Agrégation différente selon la métrique (sum pour les ventes, mean pour les visites)
monthly = df['ventes'].resample('ME').agg({
    'ventes': 'sum', 'visites': 'mean', 'clients': 'nunique'
})

# Upsample : remplir les trous (passer de mensuel à journalier)
# ffill = forward fill : répéter la dernière valeur connue
df_complet = df.resample('D').asfreq().fillna(method='ffill')

# ── MOYENNES MOBILES : lisser les variations court terme ───────────────
# MA 7 jours : lisse les variations jour/nuit, week-end/semaine
# MA 30 jours : révèle la tendance mensuelle en ignorant les fluctuations hebdo
df['ma_7']  = df['ventes'].rolling(7).mean()
df['ma_30'] = df['ventes'].rolling(30).mean()
# EMA : moyenne mobile exponentielle (pondère plus les valeurs récentes)
df['ema_7'] = df['ventes'].ewm(span=7, adjust=False).mean()

# ── VARIATIONS PÉRIODIQUES ─────────────────────────────────────────────
# YoY (Year-over-Year) : comparer avec la même date il y a 1 an
df['yoy_pct'] = df['ventes'].pct_change(periods=365) * 100
# MoM (Month-over-Month) : comparer avec il y a 30 jours
df['mom_pct'] = df['ventes'].pct_change(periods=30)  * 100
# Les premières lignes seront NaN car il n'y a pas de référence passée

# ── DÉCOMPOSITION TENDANCE / SAISONNALITÉ ─────────────────────────────
# model='additive' : saisonnalité stable dans le temps (amplitude constante)
# model='multiplicative' : saisonnalité proportionnelle au niveau (croissante)
# period=7 : cycle hebdomadaire (adapter à 365 pour saisonnalité annuelle)
from statsmodels.tsa.seasonal import seasonal_decompose
decomp = seasonal_decompose(df['ventes'].dropna(), model='additive', period=7)
decomp.plot()
# Lire le résultat :
# Trend : tendance de fond (hausse, baisse, plateau)
# Seasonal : motif répétitif (pics le lundi, creux le week-end...)
# Residual : tout ce qui n'est pas expliqué par la tendance ni la saisonnalité`,
  },
  {
    id: "py-parquet", cat: "Python", lang: "python", emoji: "🐍", theme: "Fichiers",
    titre: "Lecture/écriture Parquet, CSV et JSON",
    desc: "Vous lisez un fichier CSV de 2 Go en pandas : 4 minutes de chargement, 1.8 Go en mémoire. En le convertissant en Parquet compressé Snappy, la lecture passe à 15 secondes et le fichier pèse 200 Mo. Règle de base : CSV pour les échanges ponctuels avec des non-développeurs, Parquet pour tout pipeline de données sérieux. Ce snippet couvre les options importantes pour chaque format : forcer les types, lire des colonnes partielles, gérer les gros fichiers, encoder pour Excel.",
    code: `import pandas as pd

# ── CSV : universel mais lent et sans typage ───────────────────────────
# Cas d'usage : réception de fichiers métier, export vers Excel, échange ponctuel
df = pd.read_csv("data.csv",
    dtype={'client_id': str},      # forcer le type → évite les ID numériques mal parsés
    parse_dates=['date'],           # convertir la colonne en datetime automatiquement
    usecols=['id', 'date', 'ca'],  # ne lire que ces colonnes (plus rapide et moins de RAM)
    chunksize=100_000              # lire par blocs de 100k lignes si le fichier est énorme
)
# utf-8-sig : ajoute un BOM pour que Excel l'ouvre sans déformer les accents
df.to_csv("output.csv", index=False, encoding='utf-8-sig')

# ── PARQUET : le format de prédilection en production ─────────────────
# Avantages : 5-10× plus petit que CSV, 10-50× plus rapide à lire, typage strict
# Lecture complète
df = pd.read_parquet("data.parquet")
# Lecture partielle : ne charger que les colonnes utiles (columnar storage)
# → lit uniquement les blocs disque nécessaires, ignore le reste
df = pd.read_parquet("data.parquet", columns=['id', 'date', 'ca'])
# compression='snappy' : bon compromis vitesse/taille (défaut recommandé)
# Alternatives : 'gzip' (meilleure compression), 'zstd' (plus rapide que snappy)
df.to_parquet("output.parquet", index=False, compression='snappy')

# ── PARQUET PARTITIONNÉ : pour un Data Lake S3 ou Azure Blob ──────────
# Spark et BigQuery liront seulement les partitions filtrées (partition pruning)
# → SELECT * WHERE annee=2026 AND mois=6 ne lira que le dossier annee=2026/mois=6
df.to_parquet("s3://bucket/data/", partition_cols=['annee', 'mois'], index=False)

# ── JSON / JSONL ───────────────────────────────────────────────────────
# orient='records', lines=True = format JSONL (une ligne JSON par enregistrement)
# C'est le format des logs d'application et des APIs streaming
df = pd.read_json("data.json", orient='records', lines=True)
df.to_json("output.json", orient='records', lines=True, force_ascii=False)

# ── EXCEL ──────────────────────────────────────────────────────────────
# Utiliser ExcelWriter pour écrire proprement (ferme le fichier automatiquement)
df = pd.read_excel("rapport.xlsx", sheet_name="Feuille1", header=0)
with pd.ExcelWriter("output.xlsx", engine='openpyxl') as writer:
    df.to_excel(writer, sheet_name="Data", index=False)`,
  },
  /* ── dbt ──────────────────────────────────────────────── */
  {
    id: "dbt-model", cat: "dbt", lang: "sql", emoji: "🔧", theme: "Modèles",
    titre: "Template de model dbt standard",
    desc: "C'est la structure de base de tout model dbt. La séparation en deux CTEs ('source' et 'renamed') est une convention essentielle : elle distingue clairement l'accès à la donnée brute de la logique de transformation. La config détermine comment dbt matérialise le résultat : 'table' recrée la table entière à chaque run, 'view' la calcule à la volée, 'incremental' ne traite que les nouvelles lignes. À copier-coller comme point de départ pour chaque nouveau model.",
    code: `{{
  config(
    -- materialized : comment dbt stocke le résultat dans le warehouse
    -- 'view'        : recalculé à chaque requête (pas de stockage, parfait pour le staging)
    -- 'table'       : recréé entièrement à chaque dbt run (lent mais toujours à jour)
    -- 'incremental' : ne traite que les nouvelles données (rapide, pour les grosses tables)
    -- 'ephemeral'   : CTE virtuelle, jamais stockée (optimisation, pour les sous-requêtes)
    materialized = 'table',

    -- schema : suffixe ajouté au schema de la target (ex: analytics_mart)
    schema       = 'mart',

    -- tags : permettent de filtrer les models lors du run
    -- 'dbt run --select tag:daily' lance uniquement les models taggés 'daily'
    tags         = ['daily', 'finance']
  )
}}

-- Convention dbt : première CTE = accès à la source via ref()
-- ref() crée une dépendance explicite entre les models (visible dans le lineage)
-- NE JAMAIS écrire un nom de table en dur — toujours passer par ref() ou source()
with source as (
  select * from {{ ref('stg_orders') }}  -- référence au model de staging
),

-- Deuxième CTE : renommage, casting, et transformations métier
-- Séparer clairement la donnée brute (source) de la logique (renamed)
renamed as (
  select
    order_id,
    customer_id,
    order_date,
    total_amount,
    status,

    -- Arrondir la date au 1er du mois pour les agrégations mensuelles
    date_trunc('month', order_date) as order_month,

    -- Créer un booléen métier plus lisible qu'un string 'completed'
    case when status = 'completed' then true else false end as is_completed
  from source
)

-- Le SELECT final est toujours simple : on expose la CTE de travail
select * from renamed`,
  },
  {
    id: "dbt-incremental", cat: "dbt", lang: "sql", emoji: "🔧", theme: "Performance",
    titre: "Model incrémental dbt",
    desc: "Votre table d'événements reçoit 5 millions de nouvelles lignes par jour. La matérialiser en 'table' (recréer depuis zéro) prend 45 minutes et coûte cher en compute. Le modèle incrémental compare la date max déjà chargée avec la source et ne traite que les nouvelles lignes : 2 minutes au lieu de 45. Le unique_key gère les upserts : si un event_id existe déjà (mise à jour), la ligne est remplacée ; sinon elle est insérée.",
    code: `{{
  config(
    materialized = 'incremental',  -- ne traiter que les nouvelles données

    -- unique_key : colonne(s) permettant d'identifier une ligne de façon unique
    -- Si une ligne avec cet ID existe déjà → UPDATE (mise à jour)
    -- Si elle n'existe pas → INSERT (nouvelle insertion)
    -- Sans unique_key, dbt fait uniquement des INSERTs (risque de doublons)
    unique_key   = 'event_id',

    -- on_schema_change : que faire si de nouvelles colonnes apparaissent dans la source ?
    -- 'sync_all_columns' : ajouter les nouvelles colonnes automatiquement
    -- 'fail' (défaut) : faire échouer le run si le schéma change
    -- 'ignore' : ignorer les nouvelles colonnes
    on_schema_change = 'sync_all_columns'
  )
}}

select
  event_id,
  user_id,
  event_type,
  created_at
from {{ source('raw', 'events') }}

-- Le bloc {% if is_incremental() %} ne s'exécute PAS lors du premier run (full refresh)
-- Il s'exécute lors de tous les runs suivants pour filtrer uniquement les nouvelles lignes
-- {{ this }} = référence à la table dbt elle-même (pour lire la date max déjà chargée)
{% if is_incremental() %}
  where created_at > (select max(created_at) from {{ this }})
  -- ⚠️ Late-arriving data : si des événements arrivent avec du retard,
  -- penser à utiliser une fenêtre glissante plutôt que le strict max :
  -- where created_at > (select max(created_at) - interval '3 days' from {{ this }})
{% endif %}`,
  },
  {
    id: "dbt-snapshot", cat: "dbt", lang: "sql", emoji: "🔧", theme: "Historisation",
    titre: "Snapshot SCD Type 2 — historiser les changements",
    desc: "Votre table clients est écrasée à chaque synchronisation CRM : impossible de savoir quel était le statut d'un client il y a 3 mois. Un snapshot dbt détecte automatiquement les changements sur les colonnes que vous spécifiez et ajoute des colonnes d'historique (valid_from, valid_to, is_current). C'est la mise en oeuvre automatique du SCD Type 2 (Slowly Changing Dimension), indispensable pour toute analyse temporelle : 'quels clients ont changé de segment en 2025 ?'.",
    code: `-- snapshots/clients_snapshot.sql
-- Les snapshots dbt se placent dans le dossier /snapshots, pas /models
{% snapshot clients_snapshot %}

{{
  config(
    target_schema = 'snapshots',  -- schéma où stocker la table d'historique

    -- unique_key : clé primaire de la table source
    -- dbt identifie les enregistrements à surveiller par cette clé
    unique_key = 'client_id',

    -- strategy : comment détecter les changements
    -- 'check' : surveiller des colonnes spécifiques (recommandé)
    -- 'timestamp' : utiliser une colonne updated_at comme indicateur de changement
    strategy  = 'check',

    -- check_cols : colonnes à surveiller
    -- Si 'statut', 'segment' ou 'email' change → dbt ferme l'ancienne ligne et crée une nouvelle
    check_cols = ['statut', 'segment', 'email'],

    -- invalidate_hard_deletes : si un client est supprimé de la source,
    -- marquer sa dernière ligne comme inactive (dbt_valid_to = now())
    invalidate_hard_deletes = true
  )
}}

select * from {{ source('raw', 'clients') }}

{% endsnapshot %}

-- ── Colonnes ajoutées automatiquement par dbt ─────────────────────────
-- dbt_scd_id     : identifiant unique de cette version de l'enregistrement
-- dbt_updated_at : horodatage de la détection du changement
-- dbt_valid_from : date à partir de laquelle cette version est valide
-- dbt_valid_to   : date à laquelle cette version a été remplacée (NULL = version courante)
-- dbt_is_current : TRUE pour la version active, FALSE pour les versions historiques

-- ── Utilisation dans un modèle aval ───────────────────────────────────
-- Vue actuelle (équivalent de la table source actuelle)
select *
from {{ ref('clients_snapshot') }}
where dbt_is_current = true;

-- Vue historique : quel était le statut d'un client à une date précise ?
select *
from {{ ref('clients_snapshot') }}
where client_id = 'C123'
  and dbt_valid_from <= '2025-06-01'
  and (dbt_valid_to > '2025-06-01' or dbt_valid_to is null);`,
  },
  {
    id: "dbt-macro", cat: "dbt", lang: "sql", emoji: "🔧", theme: "Macros",
    titre: "Macro dbt — fonctions SQL réutilisables",
    desc: "Dans vos modèles dbt, vous écrivez en boucle : LOWER(TRIM(col)), CASE WHEN denominateur = 0 THEN 0 ELSE num/den END, CAST(TO_CHAR(date, 'YYYYMMDD') AS INTEGER). Une macro dbt factorise ces patterns en une fonction nommée, réutilisable dans tous vos modèles. Le Jinja templating permet de passer des arguments. Résultat : vos modèles sont 3× plus lisibles et les corrections se font en un seul endroit.",
    code: `-- macros/utils.sql
-- Les macros dbt se placent dans le dossier /macros
-- Elles sont disponibles dans TOUS les modèles du projet sans import

-- ── Macro 1 : nettoyage d'une chaîne ─────────────────────────────────
-- LOWER(TRIM(col)) est répété dans tous les modèles qui normalisent des emails,
-- des noms... → factoriser en macro pour centraliser et nommer l'intention
{% macro clean_string(col) %}
  LOWER(TRIM({{ col }}))
{% endmacro %}

-- ── Macro 2 : division protégée contre le zéro ───────────────────────
-- Sans cette macro, x / 0 = erreur SQL (division by zero) dans tous les warehouses
-- Le paramètre 'default=0' a une valeur par défaut → optionnel à l'appel
{% macro safe_divide(numerator, denominator, default=0) %}
  CASE WHEN {{ denominator }} = 0
    THEN {{ default }}                            -- retourner 0 (ou NULL, ou toute valeur)
    ELSE {{ numerator }}::FLOAT / {{ denominator }}  -- cast explicite en FLOAT pour la précision
  END
{% endmacro %}

-- ── Macro 3 : convertir une date en clé INTEGER (YYYYMMDD) ────────────
-- Les tables de dimensions en BI utilisent souvent un integer comme date_id
-- INTEGER est plus performant qu'une DATE pour les jointures en BI (Power BI, Tableau)
{% macro date_id(col) %}
  CAST(TO_CHAR({{ col }}, 'YYYYMMDD') AS INTEGER)
{% endmacro %}

-- ── Utilisation dans un modèle ────────────────────────────────────────
-- models/mart/clients.sql
select
  -- Appel de macro : {{ macro_name(arguments) }}
  -- dbt remplace cet appel par le SQL de la macro AVANT d'envoyer la requête
  {{ clean_string('email') }}                       as email,
  {{ safe_divide('ca_total', 'nb_commandes') }}     as panier_moyen,
  {{ safe_divide('nb_ok', 'nb_total', default=1) }} as taux_succes,  -- défaut custom
  {{ date_id('derniere_commande') }}                as date_derniere_cmd_id
from {{ ref('stg_clients') }}`,
  },
  {
    id: "dbt-source-freshness", cat: "dbt", lang: "sql", emoji: "🔧", theme: "Qualité",
    titre: "Sources et freshness — surveiller la fraîcheur des données",
    desc: "Votre pipeline Airbyte charge des données depuis le CRM toutes les 6 heures. Ce matin le pipeline est tombé silencieusement et vos dashboards affichent des données vieilles de 18 heures sans que personne ne s'en rende compte. La freshness dbt surveille le timestamp de la dernière mise à jour de chaque table source et déclenche une alerte automatique (warn ou error) si les données n'ont pas été actualisées depuis plus de X heures. C'est le filet de sécurité minimum pour tout pipeline de données.",
    code: `# models/sources.yml
# Ce fichier déclare les tables sources (tables brutes que dbt ne crée pas)
# Convention : référencer via source('nom_source', 'nom_table') dans les modèles
version: 2

sources:
  - name: raw                   # nom logique de la source (utilisé dans les ref)
    database: my_database       # nom de la base de données dans le warehouse
    schema: raw_data            # schéma dans la base
    loader: airbyte             # documentation : quel outil alimente cette source

    # ── FRESHNESS GLOBALE : alerte si les données sont trop vieilles ──────
    # warn_after : lever un warning (job en jaune dans dbt Cloud)
    # error_after : faire échouer le job (job en rouge, alertes Slack/email déclenchées)
    freshness:
      warn_after:  { count: 12, period: hour }  # ⚠️ warning si > 12h sans mise à jour
      error_after: { count: 24, period: hour }  # ❌ erreur si > 24h sans mise à jour

    # loaded_at_field : colonne timestamp à surveiller pour la fraîcheur
    # Pour Airbyte : _airbyte_emitted_at | Pour Fivetran : _fivetran_synced
    loaded_at_field: _airbyte_emitted_at

    tables:
      - name: clients
        description: "Table clients brute synchronisée depuis le CRM Salesforce"
        # Tests de qualité déclarés ici (au niveau de la source)
        columns:
          - name: client_id
            tests:
              - unique     # chaque client_id ne doit apparaître qu'une fois
              - not_null   # aucun client_id ne peut être NULL
          - name: email
            tests:
              - unique
              - not_null

      - name: commandes
        description: "Table commandes synchronisée depuis l'ERP"
        # Override de freshness pour cette table spécifique (remplace les valeurs globales)
        # Une table de commandes se met à jour plus souvent → seuils plus stricts
        freshness:
          warn_after:  { count: 6,  period: hour }
          error_after: { count: 12, period: hour }

# ── Exécuter la vérification de freshness ────────────────────────────
# dbt source freshness
# Ajouter dans le job dbt Cloud pour être alerté avant le run principal`,
  },
  /* ── PySpark ──────────────────────────────────────────── */
  {
    id: "spark-optimize", cat: "PySpark", lang: "python", emoji: "⚡", theme: "Performance",
    titre: "Optimisations PySpark — partition & cache",
    desc: "Votre job Spark tourne depuis 3 heures alors qu'il devrait prendre 20 minutes. Les problèmes de performance Spark les plus fréquents : partitions mal calibrées (200 partitions par défaut sur un petit dataset = 200 tâches inutiles), jointures sans broadcast sur les petites tables (shuffle coûteux), DataFrames recalculés plusieurs fois. Ces 5 règles couvrent 80% des cas de lenteur rencontrés en production.",
    code: `from pyspark.sql import functions as F

# ── 1. REPARTITIONNER avant un groupBy ou join coûteux ─────────────────
# Spark démarre avec 200 partitions par défaut (spark.sql.shuffle.partitions)
# Sur un small dataset → 200 partitions vides = overhead inutile
# Sur un large dataset → trop peu de partitions = OOM (out of memory)
# Règle : ~128 Mo par partition est un bon point de départ
df_repartitioned = df.repartition(200, "customer_id")
# repartition(n, col) : redistribue les données sur n partitions, regroupées par col

# ── 2. BROADCAST JOIN pour les petites tables (< 10 MB) ────────────────
# Sans broadcast : Spark envoie les deux tables entières sur le réseau (shuffle)
# Avec broadcast : Spark envoie la petite table à CHAQUE executor → pas de shuffle
from pyspark.sql.functions import broadcast
result = large_df.join(broadcast(small_df), "key")
# Régler le seuil automatique : spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "50m")

# ── 3. CACHE : éviter de recalculer une DataFrame utilisée plusieurs fois ─
# Spark recalcule tout depuis le début à chaque action — si vous utilisez
# le même DataFrame 3 fois, il est recalculé 3 fois
df_cached = df.cache()
df_cached.count()  # déclencher le cache (Spark est lazy, rien ne s'exécute avant une action)
# Libérer la mémoire quand on n'a plus besoin : df_cached.unpersist()

# ── 4. ÉVITER LES UDFs PYTHON ─────────────────────────────────────────
# Les UDFs Python sérialisent chaque ligne Python ↔ JVM → 40× plus lent que les fonctions natives
# Mauvais (UDF Python) :
# df.withColumn("upper", udf(lambda x: x.upper(), StringType())(col("name")))
# Bon (fonction native Spark, s'exécute en JVM, ultra-rapide) :
df = df.withColumn("upper", F.upper(F.col("name")))
# Catalogue des fonctions natives : pyspark.sql.functions (F.*)

# ── 5. ÉCRIRE EN PARQUET PARTITIONNÉ ─────────────────────────────────
# Les requêtes avec filtres sur les colonnes de partition (year, month)
# ne liront que les dossiers correspondants → réduction drastique du volume lu
df.write.partitionBy("year", "month") \\
  .mode("overwrite") \\
  .parquet("s3://bucket/data/")`,
  },
  {
    id: "spark-window", cat: "PySpark", lang: "python", emoji: "⚡", theme: "Fenêtres",
    titre: "Window functions en PySpark",
    desc: "En SQL, vous utilisez ROW_NUMBER(), SUM() OVER, LAG(). En PySpark, ce sont les mêmes concepts mais avec une syntaxe différente. Ce snippet reproduit les patterns les plus courants sur un DataFrame de commandes : rang par client (pour déduplication), cumul des ventes, variation vs période précédente (LAG), et moyenne mobile sur 7 jours. La particularité PySpark : la fenêtre se définit séparément avec Window.partitionBy().orderBy() avant d'être utilisée dans withColumn().",
    code: `from pyspark.sql import functions as F
from pyspark.sql.window import Window

# ── DÉFINIR LES FENÊTRES ───────────────────────────────────────────────
# Une fenêtre = une portée de lignes sur laquelle appliquer une fonction
# partitionBy = grouper (équivalent PARTITION BY en SQL)
# orderBy = trier à l'intérieur de chaque groupe (nécessaire pour ROW_NUMBER, LAG...)

# Fenêtre par client, triée par date (pour les calculs cumulatifs et rang)
w_client = Window.partitionBy("client_id").orderBy("date")
# Fenêtre temporelle : 7 jours glissants (ligne courante + les 6 précédentes)
# rowsBetween(-6, 0) = de -6 lignes avant à la ligne courante (0)
w_date   = Window.orderBy("date").rowsBetween(-6, 0)

df = df.withColumn("rang_commande",
        # rank() : 1ère commande du client reçoit rang=1, 2ème rang=2, etc.
        # Si deux commandes ont la même date : rang identique puis saut (1,1,3...)
        # Utiliser dense_rank() pour éviter le saut : (1,1,2...)
        F.rank().over(w_client))                         \\
       .withColumn("ca_cumul",
        # SUM cumulatif : total de toutes les commandes jusqu'à la date courante
        F.sum("montant").over(w_client))                  \\
       .withColumn("ca_precedent",
        # LAG(col, 1) : valeur de la ligne précédente dans la fenêtre
        # Retourne NULL pour la 1ère commande (pas de précédente)
        F.lag("montant", 1).over(w_client))               \\
       .withColumn("variation_pct",
        # Variation en % = (actuel - précédent) / précédent × 100
        F.round((F.col("montant") - F.col("ca_precedent"))
        / F.col("ca_precedent") * 100, 1))               \\
       .withColumn("ca_rolling_7j",
        # Moyenne mobile sur 7 jours (lisse les pics et creux)
        F.avg("montant").over(w_date))

# ── DENSE RANK : classement sans saut ─────────────────────────────────
# dense_rank() sur toutes les lignes (sans PARTITION BY = fenêtre globale)
# Cas d'usage : Top 10 des clients, classement des produits
df = df.withColumn("dense_rank",
        F.dense_rank().over(Window.orderBy(F.desc("ca_total"))))

# ── FIRST / LAST : première et dernière valeur du groupe ─────────────
# unboundedPreceding → unboundedFollowing = toute la partition (début à fin)
# Cas d'usage : récupérer la date de 1ère commande sur chaque ligne client
df = df.withColumn("premiere_commande",
        F.first("date").over(Window.partitionBy("client_id")
                                   .orderBy("date")
                                   .rowsBetween(Window.unboundedPreceding,
                                                Window.unboundedFollowing)))`,
  },
  {
    id: "spark-schema", cat: "PySpark", lang: "python", emoji: "⚡", theme: "Schéma",
    titre: "Schéma explicite et lecture Parquet S3",
    desc: "Vous lisez un dossier S3 avec 500 fichiers Parquet. Sans schéma explicite, Spark échantillonne chaque fichier pour inférer les types — coûteux et parfois incorrect si les fichiers ont des types incohérents. Définir le schéma explicitement élimine cette inférence, garantit les types attendus, et accélère le démarrage du job. Ce snippet montre aussi le partition pruning : quand vous filtrez sur une colonne de partition, Spark ne lit que les dossiers correspondants.",
    code: `from pyspark.sql import SparkSession
from pyspark.sql.types import (StructType, StructField,
    StringType, IntegerType, DoubleType, DateType, BooleanType)

spark = SparkSession.builder.appName("pipeline").getOrCreate()

# ── SCHÉMA EXPLICITE : toujours en production ─────────────────────────
# Sans schéma, Spark lit un échantillon de chaque fichier pour inférer les types
# Problèmes courants : un client_id "001" inféré en INTEGER (perd le zéro initial),
# des montants "1234.56" inférés en STRING si un fichier contient une valeur nulle
schema = StructType([
    # nullable=False : Spark refusera les NULLs sur cette colonne (contrat de qualité)
    # nullable=True  : les NULLs sont acceptés (défaut)
    StructField("client_id",   StringType(),  nullable=False),
    StructField("date",        DateType(),    nullable=False),
    StructField("montant",     DoubleType(),  nullable=True),
    StructField("nb_produits", IntegerType(), nullable=True),
    StructField("est_premium", BooleanType(), nullable=True),
    StructField("region",      StringType(),  nullable=True),
])

# ── LECTURE PARQUET : avec schéma explicite ───────────────────────────
# .schema(schema) : ignorer l'inférence, appliquer directement notre schéma
df = spark.read.schema(schema).parquet("s3://bucket/commandes/")

# ── PARTITION PRUNING : filtrer directement au niveau du dossier ───────
# Si la table est partitionnée par 'annee', les fichiers sont organisés en :
# s3://bucket/commandes/annee=2025/, s3://bucket/commandes/annee=2026/...
# Avec ce filtre, Spark NE LIT PAS les dossiers annee=2025, annee=2024...
# → réduction drastique du volume lu sur de grands Data Lakes
df = spark.read.parquet("s3://bucket/commandes/").filter("annee = 2026")

# ── DEBUG : inspecter le DataFrame après lecture ───────────────────────
df.printSchema()  # vérifier les types réels
print(f"Lignes : {df.count():,} | Partitions : {df.rdd.getNumPartitions()}")

# ── ÉCRITURE DELTA LAKE (tables ACID sur S3) ───────────────────────────
# Delta Lake = Parquet + journal de transactions (ACID, time travel, schema evolution)
# overwriteSchema=true : autoriser le changement de schéma lors d'un overwrite
df.write.format("delta") \\
        .mode("overwrite") \\
        .partitionBy("annee", "mois") \\
        .option("overwriteSchema", "true") \\
        .save("s3://bucket/delta/commandes/")`,
  },
  {
    id: "spark-join-skew", cat: "PySpark", lang: "python", emoji: "⚡", theme: "Performance",
    titre: "Jointures et gestion du data skew",
    desc: "Votre job Spark prend 90 minutes alors qu'il devrait finir en 15 minutes. Dans Spark Stage UI, 199 tasks finissent en 10 secondes et 1 task tourne depuis 85 minutes. C'est du data skew : une valeur de clé (souvent NULL ou 'UNKNOWN') concentre 90% des données sur une seule partition. Ce snippet montre les 3 solutions : broadcast join (si une table est petite), split+union (traiter la clé skewed séparément), et salting (répartir artificiellement une clé populaire).",
    code: `from pyspark.sql import functions as F

# ── SOLUTION 1 : BROADCAST JOIN (si une table est petite < 10-50 MB) ──
# Pas de shuffle : la petite table est copiée sur chaque executor
# Aucun problème de skew possible avec un broadcast join
result = df_large.join(F.broadcast(df_small), "product_id", "left")

# ── DIAGNOSTIC : identifier la clé qui provoque le skew ───────────────
# Regarder les 10 valeurs les plus fréquentes de la clé de jointure
df.groupBy("client_id").count().orderBy(F.desc("count")).show(10)
# Si une valeur (NULL, 'ANONYMOUS', 'INCONNU') représente > 30% → skew confirmé

# ── SOLUTION 2 : SPLIT + UNION (traiter la clé skewed séparément) ─────
# Séparer les données normales des données skewed, joindre séparément, réunifier
df_normal = df.filter(F.col("client_id") != "ANONYMOUS")  # données sans skew
df_skewed = df.filter(F.col("client_id") == "ANONYMOUS")  # données skewed

# Joindre les données normales normalement
result_normal = df_normal.join(ref, "client_id", "left")

# Pour les données skewed : pas de jointure possible (clé inconnue), juste remettre NULL
result_skewed = df_skewed.withColumn("client_id", F.lit(None))

# Réunifier les deux résultats
result = result_normal.union(result_skewed)

# ── SOLUTION 3 : SALTING (répartir une clé très populaire) ─────────────
# Ajouter un suffixe aléatoire "_0" à "_9" pour disperser sur 10 partitions
SALT = 10  # nombre de partitions cibles pour la clé skewed
df_salted = df.withColumn("salted_key",
    F.concat(F.col("client_id"), F.lit("_"),
             (F.rand() * SALT).cast("int")))  # ajoute _0, _1, ..., _9 aléatoirement

# La table de référence doit être "explosée" pour matcher toutes les variantes
ref_expanded = ref.withColumn("salt",
    F.explode(F.array([F.lit(i) for i in range(SALT)])))  # duplique chaque ligne 10 fois
ref_expanded = ref_expanded.withColumn("salted_key",
    F.concat(F.col("client_id"), F.lit("_"), F.col("salt")))

# ── VÉRIFIER LA DISTRIBUTION APRÈS REPARTITION ────────────────────────
# Compter les lignes par partition (idéalement égal sur toutes les partitions)
df.repartition(200, "client_id") \\
  .groupBy(F.spark_partition_id()).count() \\
  .orderBy(F.desc("count")).show(10)
# Si une partition a 100× plus de lignes que les autres → skew persistant`,
  },
  {
    id: "git-data", cat: "Git/Shell", lang: "bash", emoji: "🔀", theme: "Configuration",
    titre: ".gitignore pour projets data",
    desc: "Un data scientist vient de pousser par erreur un CSV de 2 Go contenant des données clients sur GitHub. Le fichier est dans l'historique git et reste accessible même après suppression (git filter-branch pour purger = très douloureux). Ce .gitignore prévient la catastrophe en bloquant dès le départ tous les formats de données, les credentials, les artefacts ML, et les environnements. À copier-coller en début de chaque projet data, avant le premier commit.",
    code: `# .gitignore pour projets data / ML
# À créer à la racine du projet AVANT le premier commit
# git add .gitignore && git commit -m "chore: add .gitignore"

# ── Données : NE JAMAIS committer ─────────────────────────
# Même un petit fichier de test peut contenir des données personnelles
# Les fichiers > 50 Mo font exploser les clones et ralentissent git pour tout le monde
data/raw/
data/processed/
*.csv
*.parquet
*.xlsx
*.json.gz
*.zip
*.tar.gz

# ── Credentials et secrets ────────────────────────────────
# Un .env commité dans un dépôt public = credentials exposés en quelques heures
# (les bots scannent GitHub en temps réel)
.env
.env.*
secrets/
credentials.json
*.pem              # clés privées SSL/TLS
*.key              # clés cryptographiques
service_account*.json  # service accounts GCP
*_credentials.json     # tout fichier de credentials

# ── Artefacts ML ─────────────────────────────────────────
# Les modèles .pkl peuvent peser plusieurs centaines de Mo
# Les stocker dans un Model Registry (MLflow, S3) ou DVC, pas dans Git
models/*.pkl
models/*.joblib
models/*.h5        # modèles Keras/TensorFlow
mlruns/            # dossier local MLflow (tracking server local)
outputs/
artifacts/

# ── Notebooks Jupyter : supprimer les outputs avant commit ────────────
# Les outputs incluent les résultats d'exécution et parfois des données en clair
# Solution propre : nbstripout (hook git qui supprime les outputs automatiquement)
# pip install nbstripout && nbstripout --install (dans le dossier du projet)
.ipynb_checkpoints/

# ── Environnements Python ─────────────────────────────────
# Chaque dev recrée son env depuis requirements.txt — ne pas partager le .venv
.venv/
venv/
env/
__pycache__/       # bytecode Python compilé
*.pyc
.pytest_cache/     # cache des tests pytest

# ── IDEs et OS ────────────────────────────────────────────
.idea/             # JetBrains (PyCharm, DataSpell)
.vscode/           # Visual Studio Code
*.DS_Store         # macOS (fichiers cachés Finder)`,
  },
  {
    id: "git-workflow", cat: "Git/Shell", lang: "bash", emoji: "🔀", theme: "Workflow",
    titre: "Workflow Git pour équipes data",
    desc: "Votre équipe data travaille à 4 sur le même repo. Sans convention, les branches s'appellent 'test2', 'fix-trucs', 'prijanth-finale-v3'. En 3 mois, plus personne ne sait ce qui est mergé ou non. Ce snippet établit une convention complète : nommage des branches (feat/, fix/), format Conventional Commits, workflow quotidien avec PR, et nettoyage des notebooks avant commit. Avec cette convention, git log devient de la documentation lisible.",
    code: `# ── CONVENTION DE NOMMAGE DES BRANCHES ───────────────────
# Un nom de branche doit répondre à : "qu'est-ce que cette branche fait ?"
# feat/    : nouvelle feature ou nouveau modèle
# fix/     : correction d'un bug dans un pipeline ou une requête
# refactor/: restructuration sans changement fonctionnel
# data/    : mise à jour de données ou de schéma
# docs/    : documentation uniquement (README, commentaires...)

git checkout -b feat/churn-model-v2
git checkout -b fix/null-client-id-pipeline
git checkout -b data/add-rgpd-columns

# ── CONVENTIONAL COMMITS : commits lisibles et catégorisés ────────────
# Format : type(scope): description courte en impératif
# type   = feat, fix, data, refactor, test, docs, chore
# scope  = nom du module ou composant impacté (optionnel mais recommandé)
# Sans cette convention, git log ressemble à : "modif", "fix2", "tentative3"

git commit -m "feat(churn): ajouter feature ancienneté client"
git commit -m "fix(etl): corriger doublon sur jointure commandes"
git commit -m "data(schema): ajouter colonne consentement_rgpd"
git commit -m "refactor(pipeline): remplacer UDF par fonction native Spark"

# ── WORKFLOW QUOTIDIEN ────────────────────────────────────
# 1. Mettre à jour le main local
git fetch origin && git pull origin main

# 2. Créer une branche depuis main (jamais travailler directement sur main)
git checkout -b feat/ma-feature

# ... coder, tester localement ...

# 3. Ajouter les fichiers SPÉCIFIQUES (jamais git add . en aveugle)
git add src/models/churn.py tests/test_churn.py
git commit -m "feat(churn): ..."

# 4. Pousser et ouvrir une PR
git push origin feat/ma-feature
# Puis ouvrir la PR sur GitHub/GitLab avec une description du changement métier

# ── NETTOYER LES NOTEBOOKS AVANT COMMIT ───────────────────
# Les outputs (résultats, graphiques, données) peuvent exposer des données sensibles
# et alourdissent le diff de façon illisible
pip install nbstripout
# Installer le hook git : nettoie automatiquement à chaque commit
nbstripout --install

# ── ALIAS GIT UTILES ──────────────────────────────────────
# git lg : voir l'historique en arbre coloré avec branches
git config --global alias.lg "log --oneline --graph --decorate --all"
# Utilisation : git lg  (affiche l'historique graphique)`,
  },
  {
    id: "shell-venv", cat: "Git/Shell", lang: "bash", emoji: "🔀", theme: "Environnement",
    titre: "Setup environnement Python pour projet data",
    desc: "Vous avez développé votre pipeline avec pandas 1.5 et scikit-learn 1.1. Votre collègue tire le repo, installe les packages, et le pipeline plante — il a pandas 2.0 qui a changé l'API. Un environnement virtuel isole les dépendances du projet des packages système. Ce snippet couvre venv (standard Python, zéro dépendance) et conda/mamba (recommandé pour le ML, gère mieux les bibliothèques C++ comme scipy, tensorflow). Inclut un requirements.txt complet pour un projet data type.",
    code: `# ── AVEC VENV : l'option standard Python (zéro installation requise) ──
python -m venv .venv                      # créer l'environnement dans .venv/
source .venv/bin/activate                 # activer sur Linux/Mac
# .venv\\Scripts\\activate                 # activer sur Windows PowerShell

# Installer les dépendances depuis requirements.txt
pip install -r requirements.txt

# Geler les versions exactes après installation (reproduire l'environnement exact)
# requirements.txt : versions minimales (>=)
# requirements-lock.txt : versions EXACTES installées (== )
pip freeze > requirements-lock.txt

# ── AVEC CONDA / MAMBA : recommandé pour les projets ML ────────────────
# Avantage vs venv : gère les dépendances C/C++ (numpy, scipy, tensorflow...)
# sans conflit. Indispensable pour certains packages ML sur Windows.
# mamba = conda mais 10× plus rapide (même syntaxe, remplacement drop-in)
conda create -n mon-projet python=3.11 -y
conda activate mon-projet
pip install -r requirements.txt           # installer les packages Python dans l'env conda

# Exporter l'environnement pour le partager ou le reproduire sur une autre machine
conda env export > environment.yml
conda env create -f environment.yml       # recréer depuis le fichier exporté

# ── REQUIREMENTS.TXT TYPE POUR PROJET DATA ────────────────
# Versions minimales avec >= : permet les mises à jour de sécurité automatiques
# mais garantit un comportement cohérent sur l'API
cat > requirements.txt << 'EOF'
# Manipulation de données
pandas>=2.0
numpy>=1.24

# Machine Learning
scikit-learn>=1.3
xgboost>=2.0
lightgbm>=4.0
shap>=0.43

# Visualisation
matplotlib>=3.7
seaborn>=0.12

# MLOps
mlflow>=2.8

# Notebooks et dev
jupyter>=1.0
nbstripout>=0.7     # nettoyer les outputs notebooks avant commit

# Utilitaires
python-dotenv>=1.0  # charger les variables .env
EOF

# ── MAKEFILE : automatiser les commandes courantes ─────────
# Créer un fichier Makefile à la racine du projet pour standardiser les commandes
# make install → pip install -r requirements.txt
# make test    → pytest tests/
# make train   → python src/train.py
# make clean   → rm -rf artifacts/ mlruns/ __pycache__`,
  },

  /* ── R ──────────────────────────────────────────────────── */
  {
    id: "r-tidyverse-wrangling", cat: "R", lang: "r", emoji: "📊", theme: "Manipulation",
    titre: "Data wrangling avec tidyverse",
    desc: "Le tidyverse est la suite de packages R la plus utilisée en data analyse. dplyr (manipulation), tidyr (pivot), readr (lecture). La syntaxe pipe %>% (ou |> en R 4.1+) enchaîne les transformations de façon lisible, comme une phrase : 'prends ce dataset, filtre, groupe, résume'. Indispensable pour tout analyste data sous R.",
    code: `library(tidyverse)

# Charger les données
df <- read_csv("ventes.csv")

# Pipeline dplyr : filtre → groupe → résumé
resultats <- df |>
  # Filtrer : garder seulement 2024 et catégories non-nulles
  filter(annee == 2024, !is.na(categorie)) |>

  # Grouper par région et catégorie
  group_by(region, categorie) |>

  # Calculer les métriques agrégées
  summarise(
    ca_total     = sum(montant, na.rm = TRUE),
    nb_commandes = n(),
    panier_moyen = mean(montant, na.rm = TRUE),
    .groups = "drop"   # dissoudre le groupement après summarise
  ) |>

  # Trier par CA décroissant
  arrange(desc(ca_total)) |>

  # Garder le top 10
  slice_head(n = 10)

# Pivot : transformer les colonnes en lignes (format long)
df_long <- df |>
  pivot_longer(
    cols      = starts_with("mois_"),   # colonnes mois_1 à mois_12
    names_to  = "mois",
    values_to = "ventes"
  )

print(resultats)`,
  },
  {
    id: "r-ggplot2-viz", cat: "R", lang: "r", emoji: "📊", theme: "Visualisation",
    titre: "Visualisations avec ggplot2",
    desc: "ggplot2 implémente la 'Grammar of Graphics' : chaque graphique se construit en couches (données + esthétiques + géométries + thèmes). C'est le standard de la visualisation en R. Résultat : des graphiques de qualité publication en quelques lignes, bien plus propres qu'Excel ou matplotlib.",
    code: `library(ggplot2)
library(dplyr)

# ── 1. Barplot horizontal : Top catégories par CA ──────────
df |>
  group_by(categorie) |>
  summarise(ca = sum(montant)) |>
  arrange(desc(ca)) |>
  ggplot(aes(x = reorder(categorie, ca), y = ca, fill = ca)) +
    geom_col(show.legend = FALSE) +
    coord_flip() +                        # barres horizontales
    scale_y_continuous(labels = scales::comma) +
    scale_fill_gradient(low = "#EDE9FE", high = "#7C3AED") +
    labs(
      title    = "Chiffre d'affaires par catégorie",
      subtitle = "Données 2024",
      x = NULL, y = "CA (€)"
    ) +
    theme_minimal(base_size = 13) +
    theme(plot.title = element_text(face = "bold"))

# ── 2. Série temporelle avec intervalle de confiance ───────
df_mensuel |>
  ggplot(aes(x = mois, y = ventes)) +
    geom_ribbon(aes(ymin = p25, ymax = p75), fill = "#EDE9FE", alpha = 0.5) +
    geom_line(color = "#7C3AED", linewidth = 1.2) +
    geom_point(color = "#7C3AED", size = 2.5) +
    facet_wrap(~region, scales = "free_y") +  # un graphique par région
    theme_minimal() +
    labs(title = "Évolution mensuelle des ventes par région")

# Sauvegarder en haute résolution
ggsave("output/ventes_regions.png", width = 12, height = 7, dpi = 300)`,
  },
  {
    id: "r-statistical-analysis", cat: "R", lang: "r", emoji: "📊", theme: "Statistiques",
    titre: "Tests statistiques et modélisation",
    desc: "R est né pour les statistiques. Ces patterns couvrent les besoins data courants : test A/B (t.test), corrélation, régression linéaire, et détection d'outliers. Utile pour les data analysts qui veulent aller au-delà des agrégations simples.",
    code: `# ── A/B TEST : est-ce que la variante B convertit mieux ? ──
groupe_a <- c(0.032, 0.028, 0.041, 0.035, 0.029)  # taux de conversion
groupe_b <- c(0.041, 0.045, 0.038, 0.050, 0.043)

test <- t.test(groupe_b, groupe_a, alternative = "greater")
cat("p-value :", test$p.value, "\n")
cat("Significatif :", test$p.value < 0.05, "\n")
# p-value < 0.05 → B convertit significativement mieux que A

# ── CORRÉLATION : quelles variables sont liées ? ────────────
library(corrr)
df_num <- df |> select(where(is.numeric))

correlations <- df_num |>
  correlate() |>
  focus(ca_total)      # afficher les corrélations avec ca_total uniquement

# ── RÉGRESSION LINÉAIRE : prédire le CA ────────────────────
modele <- lm(ca_total ~ nb_produits + anciennete_client + canal_acquisition,
             data = df_train)

summary(modele)        # R², p-values, coefficients
# Interpréter : chaque client supplémentaire en ancienneté
# augmente le CA de X€ en moyenne, toutes choses égales

# Prédiction sur nouvelles données
predictions <- predict(modele, newdata = df_test, interval = "prediction")

# ── DÉTECTION D'OUTLIERS : méthode IQR ─────────────────────
detecter_outliers <- function(x) {
  Q1  <- quantile(x, 0.25)
  Q3  <- quantile(x, 0.75)
  IQR <- Q3 - Q1
  x < (Q1 - 1.5 * IQR) | x > (Q3 + 1.5 * IQR)
}

df |> filter(detecter_outliers(montant)) |> nrow()`,
  },

  /* ── Polars ─────────────────────────────────────────────── */
  {
    id: "polars-basics", cat: "Polars", lang: "python", emoji: "⚡", theme: "Bases",
    titre: "Polars — manipulation de données ultra-rapide",
    desc: "Polars est le remplaçant moderne de Pandas. Écrit en Rust, il est 5 à 20x plus rapide sur les gros datasets et utilise moins de mémoire. L'API lazy (scan → collect) permet d'optimiser l'exécution comme un moteur SQL. À privilégier pour tout nouveau projet data Python traitant plus de 100k lignes.",
    code: `import polars as pl

# ── LECTURE ET INSPECTION ──────────────────────────────────
# Polars lit les CSV en colonnes (Arrow), pas en lignes comme Pandas
df = pl.read_csv("transactions.csv")
print(df.shape)         # (lignes, colonnes)
print(df.dtypes)        # types inférés automatiquement (i64, f64, Utf8, Date...)
print(df.describe())    # stats descriptives

# ── FILTRAGE ET SÉLECTION ──────────────────────────────────
# Expressions Polars : plus lisibles et optimisées que Pandas
resultat = (
    df
    .filter(
        (pl.col("montant") > 1000) &
        (pl.col("statut") == "validé") &
        pl.col("date").dt.year().eq(2024)
    )
    .select([
        "client_id",
        "montant",
        "date",
        pl.col("produit").str.to_uppercase().alias("produit_norm"),
    ])
)

# ── AGRÉGATION ET GROUP BY ─────────────────────────────────
stats = (
    df
    .group_by(["region", "categorie"])
    .agg([
        pl.col("montant").sum().alias("ca_total"),
        pl.col("montant").mean().alias("panier_moyen"),
        pl.col("client_id").n_unique().alias("nb_clients"),
        pl.col("montant").quantile(0.9).alias("p90"),
    ])
    .sort("ca_total", descending=True)
)

# ── MODE LAZY : optimisation automatique ──────────────────
# Polars analyse toutes les opérations AVANT d'exécuter
# Il élimine les colonnes inutiles et réordonne les filtres
resultat_lazy = (
    pl.scan_csv("gros_fichier.csv")   # ne charge rien en mémoire
    .filter(pl.col("annee") == 2024)  # pushdown : filtre au niveau fichier
    .select(["id", "montant", "region"])
    .group_by("region")
    .agg(pl.col("montant").sum())
    .collect()                         # exécution réelle ici seulement
)`,
  },
  {
    id: "polars-joins-transforms", cat: "Polars", lang: "python", emoji: "⚡", theme: "Jointures",
    titre: "Jointures, pivots et expressions avancées",
    desc: "Polars gère les jointures et pivots avec une syntaxe claire. Les expressions enchaînées permettent des transformations complexes sans créer de variables intermédiaires. La méthode with_columns ajoute des colonnes calculées sans copier le DataFrame entier.",
    code: `import polars as pl

# ── JOINTURES ──────────────────────────────────────────────
commandes  = pl.read_parquet("commandes.parquet")
clients    = pl.read_parquet("clients.parquet")
produits   = pl.read_parquet("produits.parquet")

# Jointure multiple enchaînée (comme SQL JOIN)
enrichi = (
    commandes
    .join(clients, on="client_id", how="left")
    .join(produits, on="produit_id", how="left")
    # Polars détecte automatiquement les colonnes ambiguës → suffixe _right
)

# ── COLONNES CALCULÉES ─────────────────────────────────────
df_enrichi = df.with_columns([
    # Calculs arithmétiques
    (pl.col("prix_ht") * pl.col("quantite")).alias("ca_ligne"),
    (pl.col("prix_ht") * 1.2).alias("prix_ttc"),

    # Manipulation de texte
    pl.col("email").str.split("@").list.get(1).alias("domaine_email"),

    # Dates
    pl.col("date_commande").dt.month().alias("mois"),
    (pl.col("date_livraison") - pl.col("date_commande"))
        .dt.total_days().alias("delai_livraison_jours"),

    # Conditionnelle (équivalent CASE WHEN)
    pl.when(pl.col("montant") > 1000)
      .then(pl.lit("premium"))
      .when(pl.col("montant") > 100)
      .then(pl.lit("standard"))
      .otherwise(pl.lit("small"))
      .alias("segment"),
])

# ── PIVOT ──────────────────────────────────────────────────
# Transformer lignes → colonnes (ventes par mois en colonnes)
pivot = (
    df
    .pivot(
        values   = "ventes",
        index    = "produit",
        columns  = "mois",
        aggregate_function = "sum",
    )
    .fill_null(0)
)`,
  },

  /* ── Scala / Spark ──────────────────────────────────────── */
  {
    id: "scala-spark-basics", cat: "Scala", lang: "scala", emoji: "🔷", theme: "Spark API",
    titre: "Apache Spark avec l'API Scala",
    desc: "Scala est le langage natif de Spark. Il offre les meilleures performances (pas d'overhead sérialisation Python) et un typage fort qui détecte les erreurs à la compilation. Indispensable pour les Data Engineers travaillant sur des pipelines Spark critiques en production.",
    code: `import org.apache.spark.sql.{SparkSession, DataFrame}
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._

// ── INITIALISATION ─────────────────────────────────────────
val spark = SparkSession.builder()
  .appName("PipelineVentes")
  .config("spark.sql.adaptive.enabled", "true")   // AQE : optimisation auto
  .config("spark.sql.shuffle.partitions", "200")  // tuning : adapter au volume
  .getOrCreate()

import spark.implicits._  // active les conversions implicites (Seq.toDS, etc.)

// ── LECTURE ────────────────────────────────────────────────
val commandes: DataFrame = spark.read
  .option("header", "true")
  .option("inferSchema", "true")
  .option("timestampFormat", "yyyy-MM-dd HH:mm:ss")
  .csv("s3://mon-bucket/commandes/2024/")

// ── TRANSFORMATIONS ────────────────────────────────────────
val commandesEnrichies = commandes
  .filter($"statut" === "validé" && $"montant" > 0)
  .withColumn("annee",  year($"date_commande"))
  .withColumn("mois",   month($"date_commande"))
  .withColumn("ca_ttc", $"montant" * lit(1.2))
  .withColumn("segment",
    when($"montant" > 1000, "premium")
    .when($"montant" > 100, "standard")
    .otherwise("small")
  )
  .dropDuplicates(Seq("commande_id"))  // déduplication par clé métier

// ── AGRÉGATION ─────────────────────────────────────────────
val statsRegion = commandesEnrichies
  .groupBy($"region", $"annee", $"mois")
  .agg(
    sum($"montant").alias("ca_total"),
    count($"commande_id").alias("nb_commandes"),
    avg($"montant").alias("panier_moyen"),
    countDistinct($"client_id").alias("nb_clients_uniques")
  )
  .orderBy($"annee", $"mois", desc($"ca_total"))

// ── ÉCRITURE Delta Lake ────────────────────────────────────
statsRegion.write
  .format("delta")
  .mode("overwrite")
  .partitionBy("annee", "mois")
  .save("s3://mon-bucket/gold/stats_region/")

spark.stop()`,
  },
  {
    id: "scala-spark-streaming", cat: "Scala", lang: "scala", emoji: "🔷", theme: "Streaming",
    titre: "Structured Streaming — traitement temps réel",
    desc: "Spark Structured Streaming traite les flux Kafka exactement comme des tables statiques. La même API DataFrame fonctionne en batch et en streaming. Le watermark gère les événements tardifs. Le trigger configurable permet de choisir entre micro-batch (latence secondes) et continu.",
    code: `import org.apache.spark.sql.streaming.Trigger
import scala.concurrent.duration._

// ── LECTURE KAFKA ──────────────────────────────────────────
val evenements = spark.readStream
  .format("kafka")
  .option("kafka.bootstrap.servers", "broker:9092")
  .option("subscribe", "transactions")
  .option("startingOffsets", "latest")
  .load()
  .select(
    from_json(
      $"value".cast("string"),
      schema = new StructType()
        .add("transaction_id", StringType)
        .add("client_id",      StringType)
        .add("montant",        DoubleType)
        .add("timestamp",      TimestampType)
    ).alias("data")
  )
  .select($"data.*")

// ── AGRÉGATION EN FENÊTRE GLISSANTE ───────────────────────
// Compter les transactions par client dans une fenêtre de 10 min
// avec un watermark de 2 min (tolérance pour les événements tardifs)
val alertesFraude = evenements
  .withWatermark("timestamp", "2 minutes")
  .groupBy(
    window($"timestamp", "10 minutes", "1 minute"),  // fenêtre glissante
    $"client_id"
  )
  .agg(
    count("*").alias("nb_transactions"),
    sum($"montant").alias("total_montant")
  )
  .filter($"nb_transactions" > 10)   // alerte si > 10 transactions en 10 min

// ── ÉCRITURE EN CONTINU ────────────────────────────────────
val query = alertesFraude.writeStream
  .outputMode("append")
  .format("kafka")
  .option("kafka.bootstrap.servers", "broker:9092")
  .option("topic", "alertes-fraude")
  .trigger(Trigger.ProcessingTime(30.seconds))
  .option("checkpointLocation", "/tmp/checkpoint/fraude")
  .start()

query.awaitTermination()`,
  },

  /* ── YAML ───────────────────────────────────────────────── */
  {
    id: "yaml-airflow-dag", cat: "YAML", lang: "yaml", emoji: "⚙️", theme: "Airflow",
    titre: "DAG Airflow — orchestration d'un pipeline ETL",
    desc: "Les TaskFlow DAGs modernes d'Airflow utilisent le décorateur @dag et @task (Python), mais la configuration de l'environnement, des variables, des connexions et des pools se fait en YAML (via Helm charts ou airflow.cfg). Ce snippet couvre les configurations YAML clés pour déployer Airflow en production sur Kubernetes.",
    code: `# ── airflow/values.yaml (Helm chart officiel) ─────────────
# Configuration d'un déploiement Airflow sur Kubernetes

executor: KubernetesExecutor  # chaque tâche = un pod isolé (scalabilité max)

# Variables d'environnement pour tous les workers
env:
  - name: AIRFLOW__CORE__PARALLELISM
    value: "32"
  - name: AIRFLOW__CORE__MAX_ACTIVE_RUNS_PER_DAG
    value: "3"
  - name: AIRFLOW__SCHEDULER__DAG_DIR_LIST_INTERVAL
    value: "30"   # scanner le dossier dags toutes les 30s

# Connexions pré-configurées (Snowflake, GCS, Slack)
connections:
  - id: snowflake_prod
    type: snowflake
    host: "xxx.snowflakecomputing.com"
    schema: PROD_DB
    login: "{{ .Values.snowflake.user }}"
    password: "{{ .Values.snowflake.password }}"
    extra: '{"account": "xxx", "warehouse": "COMPUTE_WH", "role": "TRANSFORMER"}'

  - id: slack_alerts
    type: http
    host: "https://hooks.slack.com"
    password: "{{ .Values.slack.webhookToken }}"

# Variables Airflow (accessibles via Variable.get() dans les DAGs)
variables:
  - key: ENV
    value: "production"
  - key: DATA_BUCKET
    value: "gs://datasphere-prod-data"
  - key: ALERT_EMAIL
    value: "data-alerts@company.com"

# Pools : limiter la concurrence sur des ressources partagées
pools:
  - name: snowflake_pool
    slots: 10   # max 10 tâches simultanées vers Snowflake
    description: "Limite les connexions concurrent vers Snowflake"
  - name: api_external_pool
    slots: 3    # max 3 appels API externes en parallèle

# Resources des workers Kubernetes
workers:
  resources:
    requests:
      memory: "512Mi"
      cpu: "500m"
    limits:
      memory: "2Gi"
      cpu: "2000m"`,
  },
  {
    id: "yaml-dbt-profiles", cat: "YAML", lang: "yaml", emoji: "⚙️", theme: "dbt",
    titre: "dbt — profiles.yml et dbt_project.yml",
    desc: "dbt utilise deux fichiers YAML centraux : profiles.yml (connexions aux warehouses, ne jamais committer dans git) et dbt_project.yml (configuration du projet, matérialisations par défaut, tags). La bonne configuration de ces fichiers évite 80% des problèmes en production.",
    code: `# ── ~/.dbt/profiles.yml ───────────────────────────────────
# NE PAS committer ce fichier ! Mettre dans .gitignore
# Utiliser les variables d'env pour les secrets en CI/CD

mon_projet:
  target: dev          # target par défaut (override avec --target prod)
  outputs:

    dev:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_USER') }}"
      password: "{{ env_var('SNOWFLAKE_PASSWORD') }}"
      role: TRANSFORMER_DEV
      database: DEV_DB
      warehouse: DEV_WH
      schema: "dbt_{{ env_var('DBT_USER', 'default') }}"  # schéma perso par dev
      threads: 4
      client_session_keep_alive: false

    prod:
      type: snowflake
      account: "{{ env_var('SNOWFLAKE_ACCOUNT') }}"
      user: "{{ env_var('SNOWFLAKE_SERVICE_ACCOUNT') }}"
      private_key_path: "{{ env_var('SNOWFLAKE_PRIVATE_KEY_PATH') }}"
      role: TRANSFORMER_PROD
      database: PROD_DB
      warehouse: TRANSFORM_WH
      schema: PUBLIC
      threads: 8

---
# ── dbt_project.yml ───────────────────────────────────────
name: mon_projet
version: '1.7.0'
config-version: 2
profile: mon_projet

# Structure des dossiers
model-paths: ["models"]
test-paths: ["tests"]
seed-paths: ["seeds"]
snapshot-paths: ["snapshots"]

# Configuration par couche (staging → intermediate → marts)
models:
  mon_projet:
    staging:          # sources brutes nettoyées
      +materialized: view       # vues : toujours à jour, pas de coût de stockage
      +schema: staging
      +tags: ["staging"]

    intermediate:     # logique métier complexe
      +materialized: ephemeral  # CTE inlinées, n'existent pas en DB

    marts:            # tables finales exposées aux analystes
      +materialized: table
      +schema: marts
      +tags: ["marts", "daily"]
      finance:
        +materialized: incremental   # seulement les nouvelles lignes
        +unique_key: transaction_id`,
  },

  /* ── Regex ──────────────────────────────────────────────── */
  {
    id: "regex-data-cleaning", cat: "Regex", lang: "python", emoji: "🔍", theme: "Nettoyage",
    titre: "Patterns Regex essentiels pour la data",
    desc: "Les expressions régulières sont indispensables pour nettoyer des données textuelles : emails invalides, numéros de téléphone mal formatés, SIRET/SIREN, codes postaux, etc. Ces patterns couvrent 90% des cas de nettoyage de données en contexte français. Compatibles Python re, Pandas str.contains(), SQL REGEXP.",
    code: `import re
import pandas as pd

# ── PATTERNS ESSENTIELS ────────────────────────────────────
PATTERNS = {
    # Email valide (simple, pas RFC complète)
    "email":        r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$',

    # Numéro de téléphone français (06, 07, 01-05, +33)
    "telephone_fr": r'^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.\-]*\d{2}){4}$',

    # Code postal français (5 chiffres, commence par 0-9)
    "code_postal":  r'^(?:0[1-9]|[1-8]\d|9[0-5])\d{3}$',

    # SIRET (14 chiffres)
    "siret":        r'^\d{14}$',

    # IBAN français
    "iban_fr":      r'^FR\d{2}[0-9A-Z]{23}$',

    # Date ISO 8601 (YYYY-MM-DD)
    "date_iso":     r'^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$',

    # Montant euro (1234.56 ou 1 234,56)
    "montant":      r'^\d{1,3}(?:[\s.]\d{3})*(?:[,.]\d{2})?$',
}

# ── APPLICATION SUR UN DATAFRAME PANDAS ───────────────────
df = pd.read_csv("clients.csv")

# Valider et flag les champs incorrects
df["email_valide"]  = df["email"].str.match(PATTERNS["email"], na=False)
df["siret_valide"]  = df["siret"].astype(str).str.match(PATTERNS["siret"], na=False)
df["cp_valide"]     = df["code_postal"].astype(str).str.match(PATTERNS["code_postal"], na=False)

# Extraire des informations depuis du texte libre
df["montant_extrait"] = df["texte_facture"].str.extract(
    r'(\d+[.,]\d{2})\s*€',   # capture le montant avant le signe €
    expand=False
)

# Nettoyer : normaliser les téléphones (supprimer espaces/tirets/points)
df["tel_normalise"] = (
    df["telephone"]
    .str.replace(r'[\s.\-()]', '', regex=True)   # supprimer séparateurs
    .str.replace(r'^0033', '0', regex=True)       # 0033 → 0
    .str.replace(r'^\+33', '0', regex=True)       # +33 → 0
)

# Rapport qualité
print(df[["email_valide", "siret_valide", "cp_valide"]].mean().round(3))
# → proportion de lignes valides par colonne`,
  },
  {
    id: "regex-sql-patterns", cat: "Regex", lang: "sql", emoji: "🔍", theme: "SQL",
    titre: "Regex en SQL — BigQuery, Snowflake, PostgreSQL",
    desc: "Tous les warehouses modernes supportent les fonctions regex en SQL. Syntaxe légèrement différente selon le moteur mais les patterns sont portables. Utile pour valider des données directement dans les requêtes de transformation dbt ou Dataform sans passer par Python.",
    code: `-- ── BIGQUERY ──────────────────────────────────────────────
-- REGEXP_CONTAINS : teste si le pattern est présent
SELECT
  email,
  REGEXP_CONTAINS(email, r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')
    AS email_valide,

  -- REGEXP_EXTRACT : capture la première correspondance
  REGEXP_EXTRACT(description, r'(\d{14})')  AS siret_trouve,

  -- REGEXP_REPLACE : nettoyer les espaces dans un numéro
  REGEXP_REPLACE(telephone, r'[\s.\-]', '')  AS tel_normalise

FROM clients;

-- ── SNOWFLAKE ──────────────────────────────────────────────
-- RLIKE : alias de REGEXP_LIKE
SELECT
  email,
  email RLIKE '^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$' AS valide,
  REGEXP_SUBSTR(adresse, '[0-9]{5}')  AS code_postal_extrait,
  REGEXP_REPLACE(telephone, '[^0-9+]', '') AS tel_propre  -- garder chiffres et +
FROM clients;

-- ── POSTGRESQL ─────────────────────────────────────────────
-- ~ pour tester, ~* pour case-insensitive, !~ pour négation
SELECT
  email,
  email ~  '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$' AS email_ok,
  email !~ '@'  AS email_sans_arobase,   -- emails manifestement invalides
  REGEXP_REPLACE(telephone, '[^0-9]', '', 'g') AS tel_chiffres
FROM clients
WHERE siret ~ '^\d{14}$';  -- filtrer les SIRET valides uniquement`,
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
      "Établir une baseline simple (règle métier ou modèle naïf)",
      "Analyse exploratoire : distribution cible, nulls, outliers",
      "Vérifier le déséquilibre de classes et définir la stratégie",
      "Identifier les risques de data leakage avant tout split",
      "Définir la stratégie de validation (K-fold stratifié ou time-split)",
      "Implémenter le feature engineering et le documenter",
      "Entraîner au moins 3 familles d'algorithmes différentes",
      "Analyser les erreurs du meilleur modèle (où échoue-t-il ?)",
      "Valider l'absence totale de data leakage",
      "Backtesting sur une période récente non vue à l'entraînement",
      "Analyser les features importantes (SHAP ou équivalent)",
      "Calibrer les probabilités si nécessaire (Platt scaling)",
      "Présenter les résultats aux équipes métier avec impact business",
      "Définir le monitoring en production (drift, performance)",
      "Documenter le modèle (model card) avant déploiement",
    ],
  },
  {
    id: "eda-audit", role: "Data Scientist", emoji: "🔬",
    titre: "Audit EDA avant modélisation",
    desc: "Les vérifications à faire sur un nouveau dataset avant de construire un modèle.",
    items: [
      "Vérifier la taille du dataset (lignes, colonnes, types)",
      "Analyser le taux de valeurs nulles par colonne",
      "Identifier les colonnes à fort taux de null (> 40%) — à supprimer ou imputer ?",
      "Vérifier l'unicité de la clé primaire supposée",
      "Analyser la distribution de la variable cible (classes, outliers)",
      "Vérifier le déséquilibre de classes si classification",
      "Détecter les outliers sur les features numériques (IQR ou z-score)",
      "Analyser la distribution de chaque feature numérique (skewness)",
      "Identifier les features catégorielles à haute cardinalité",
      "Calculer la matrice de corrélation et identifier les features colinéaires",
      "Vérifier la cohérence temporelle si colonne date (trous, doublons)",
      "Détecter les data leaks potentiels (features trop corrélées à la cible)",
      "Identifier les features quasi-constantes (variance < seuil)",
      "Valider les plages de valeurs métier (ex: âge entre 0 et 120)",
      "Documenter les observations et décisions prises dans un rapport EDA",
    ],
  },
  {
    id: "data-quality", role: "Data Engineer", emoji: "🔍",
    titre: "Data Quality avant livraison",
    desc: "Vérifications à faire avant de passer un dataset en production.",
    items: [
      "Vérifier le volume de lignes (cohérent avec l'attendu ?)",
      "Contrôler les valeurs nulles sur les colonnes critiques (clé, date, montant)",
      "Vérifier l'unicité des clés primaires (COUNT(*) vs COUNT(DISTINCT pk))",
      "Contrôler les plages de valeurs (min/max cohérents, pas de négatif sur montant)",
      "Vérifier la fraîcheur des données (MAX(timestamp) dans les dernières 24h ?)",
      "Contrôler les références (FK vers tables de référence valides)",
      "Vérifier les formats (dates ISO, codes sur longueur fixe, SIRET 14 chiffres)",
      "Comparer les totaux agrégés avec le système source (± 0.1%)",
      "Vérifier l'absence de duplicats sur la clé métier",
      "Tester les cas limites (valeurs extrêmes, chaînes vides, caractères spéciaux)",
      "Valider la cohérence cross-tables (agrégats cohérents entre faits et dimensions)",
      "Vérifier les jointures : pas de cartésien, pas de perte de lignes inattendue",
      "Documenter les règles de qualité et les résultats dans un rapport",
    ],
  },
  {
    id: "etl-deploy", role: "Data Engineer", emoji: "⚙️",
    titre: "Mise en production d'un pipeline ETL",
    desc: "Avant de lancer un nouveau pipeline de données en production.",
    items: [
      "Tests unitaires sur les transformations clés (input → output attendu)",
      "Tests d'intégration sur un jeu de données représentatif",
      "Vérifier l'idempotence : le pipeline produit le même résultat à chaque run",
      "Vérifier le comportement en cas de données manquantes à la source",
      "Définir la stratégie de reprise sur erreur (retry, dead-letter queue)",
      "Tester avec un volume de données proche de la production (pas juste 100 lignes)",
      "Vérifier les permissions d'accès source et destination",
      "Configurer les alertes Slack/email en cas d'échec",
      "Documenter le lineage (source → transformations → destination)",
      "Configurer le monitoring : temps d'exécution, lignes traitées",
      "Planifier le scheduling et vérifier les dépendances avec d'autres jobs",
      "Définir la procédure de rollback en cas de problème",
      "Obtenir la validation du Data Owner avant mise en prod",
    ],
  },
  {
    id: "ml-deploy", role: "MLOps Engineer", emoji: "🚀",
    titre: "Avant déploiement d'un modèle ML",
    desc: "Checklist de validation avant de mettre un modèle en production.",
    items: [
      "Modèle versionné dans le Model Registry avec sa date et ses métriques",
      "Tests unitaires sur le code de preprocessing (transformations critiques)",
      "Validation des performances sur un jeu de test récent (3 derniers mois)",
      "Validation de la latence de prédiction (respecte le SLA défini ?)",
      "Documentation complète des features : nom, source, calcul, type",
      "Validation par l'équipe métier (shadow mode ou A/B test si possible)",
      "Plan de rollback documenté (modèle précédent prêt à redéployer)",
      "Monitoring configuré : distribution des features en entrée (data drift)",
      "Monitoring configuré : distribution des prédictions (concept drift)",
      "Alertes définies en cas de dégradation (seuils quantifiés)",
      "Revue de sécurité : données PII passent-elles par le modèle ?",
      "Vérification RGPD : les données d'entraînement étaient-elles consentiées ?",
      "Approbation formelle du Data Owner et de la Direction métier",
      "Documentation des biais connus et des limites du modèle (model card)",
    ],
  },
  {
    id: "sql-review", role: "Data Analyst", emoji: "🗄️",
    titre: "Revue d'une requête SQL avant production",
    desc: "Checklist pour valider une requête SQL avant de la partager ou planifier.",
    items: [
      "La requête est-elle lisible ? (CTEs plutôt que sous-requêtes imbriquées)",
      "Toutes les colonnes sont-elles nommées explicitement (pas de SELECT *) ?",
      "Les JOIN sont-ils justifiés ? Vérifier la cardinalité (pas de multiplication de lignes)",
      "Les colonnes de jointure ont-elles le même type dans les deux tables ?",
      "Les NULLs sont-ils gérés correctement (COALESCE, NULLIF, IS NULL) ?",
      "Les divisions sont-elles protégées contre le zéro (NULLIF) ?",
      "Les dates sont-elles filtrées explicitement (éviter de lire toute l'historique) ?",
      "COUNT(*) et COUNT(DISTINCT clé) ont-ils été vérifiés sur le résultat ?",
      "Les doublons sont-ils possibles ? Une déduplication est-elle nécessaire ?",
      "La requête est-elle testée sur un subset avant de lancer sur toutes les données ?",
      "Commentaire en tête de requête : date, auteur, objectif métier",
      "La requête est-elle versionnée dans Git ?",
    ],
  },
  {
    id: "bi-dashboard", role: "Data Analyst", emoji: "📊",
    titre: "Création d'un tableau de bord BI",
    desc: "De la collecte des besoins à la livraison d'un dashboard Power BI/Tableau.",
    items: [
      "Identifier les 3-5 questions métier auxquelles le dashboard doit répondre",
      "Valider la source de données avec le Data Owner",
      "Définir la granularité (par jour ? par client ? par produit ?)",
      "Confirmer les définitions métier (qu'est-ce qu'un client actif ? un chiffre d'affaires ?)",
      "Créer un modèle de données étoile (tables de faits + dimensions)",
      "Définir les métriques clés et leurs formules exactes",
      "Valider les chiffres avec une source de vérité (Excel, système source)",
      "Appliquer les règles de sécurité (Row-Level Security si données sensibles)",
      "Tester les filtres croisés et leur cohérence",
      "Ajouter une date de dernière mise à jour visible sur le dashboard",
      "Optimiser les performances (temps de chargement < 3 secondes ?)",
      "Tester sur mobile si le dashboard sera consulté en déplacement",
      "Former les utilisateurs finaux et documenter la lecture des indicateurs",
      "Définir le processus de mise à jour et le responsable",
    ],
  },
  {
    id: "ab-test", role: "Data Analyst", emoji: "🧪",
    titre: "Analyse d'un test A/B",
    desc: "Avant, pendant et après un test A/B — éviter les pièges classiques.",
    items: [
      "Définir l'hypothèse et la métrique primaire AVANT le lancement",
      "Calculer la taille d'échantillon nécessaire (power 80%, alpha 5%)",
      "Vérifier l'assignation aléatoire des groupes (pas de biais de sélection)",
      "Vérifier l'absence de contamination entre les groupes (effet de spillover)",
      "Définir la durée du test à l'avance et s'y tenir (pas de peek)",
      "Attendre la fin du test avant toute analyse (peeking problem)",
      "Vérifier l'équilibre des groupes sur les dimensions clés (sexe, région...)",
      "Utiliser le bon test statistique (z-test, t-test, Mann-Whitney selon la distribution)",
      "Calculer l'intervalle de confiance, pas juste la p-value",
      "Vérifier la signification pratique (pas juste statistique) : l'effet est-il assez grand ?",
      "Analyser les sous-groupes avec prudence (test multiples = inflation du faux positif)",
      "Documenter les résultats avec confiance, lift, p-value, durée, taille",
      "Présenter la décision recommandée, pas seulement les chiffres",
    ],
  },
  {
    id: "rgpd", role: "Data Manager", emoji: "🔒",
    titre: "Conformité RGPD pour un projet data",
    desc: "Points de contrôle RGPD avant de lancer un projet utilisant des données personnelles.",
    items: [
      "Identifier toutes les données à caractère personnel (DCP) impliquées",
      "Vérifier la base légale du traitement (consentement, contrat, intérêt légitime...)",
      "Documenter le traitement dans le Registre des activités de traitement (RAT)",
      "Réaliser une AIPD si le traitement présente des risques élevés",
      "Définir la durée de conservation et le processus d'archivage/suppression",
      "Vérifier les transferts hors UE (clauses contractuelles types si nécessaire)",
      "Mettre en place le principe de minimisation (ne collecter que ce qui est nécessaire)",
      "Configurer la pseudonymisation ou l'anonymisation si possible",
      "Définir les droits des personnes (accès, rectification, effacement, portabilité)",
      "Mettre en place un processus de réponse aux demandes d'exercice de droits (< 30 jours)",
      "Vérifier la sécurité des accès (RBAC, chiffrement au repos et en transit)",
      "Informer les personnes concernées (mention dans la politique de confidentialité)",
      "Désigner un référent RGPD interne pour le projet",
    ],
  },
  {
    id: "governance", role: "Data Manager", emoji: "🏛️",
    titre: "Gouvernance d'un nouveau dataset",
    desc: "Intégrer correctement un nouveau jeu de données dans le SI data.",
    items: [
      "Identifier le Data Owner (référent métier responsable des données)",
      "Documenter la définition de chaque colonne (dictionnaire de données)",
      "Classifier les données (public, interne, confidentiel, hautement confidentiel)",
      "Identifier les données personnelles (RGPD) et leur base légale",
      "Définir la durée de conservation et le processus de purge",
      "Configurer les droits d'accès (RBAC — principe du moindre privilège)",
      "Intégrer dans le Data Catalog avec tags, description et propriétaire",
      "Documenter le lineage complet (source → transformations → destination)",
      "Définir les règles de qualité et les SLA de fraîcheur",
      "Mettre en place des alertes de qualité (volume, null rate, freshness)",
      "Informer les équipes consommatrices de la disponibilité",
      "Prévoir le processus de demande d'accès et d'habilitation",
      "Définir le processus de signalement d'anomalie et d'incident",
    ],
  },
  {
    id: "onboarding-projet", role: "Data Engineer", emoji: "🧭",
    titre: "Onboarding sur un nouveau projet data",
    desc: "Ce qu'il faut comprendre et faire dans les 2 premières semaines.",
    items: [
      "Lire toute la documentation disponible (README, Confluence, Notion)",
      "Comprendre l'architecture data globale (sources, ingestion, transformation, BI)",
      "Identifier les outils en place (stack technique, credentials, accès)",
      "Cartographier les principales tables et leur usage métier",
      "Identifier les Data Owners et les stakeholders clés",
      "Lire les 10 derniers PRs merges pour comprendre les standards de code",
      "Faire tourner le pipeline localement (setup dev environment)",
      "Comprendre le workflow Git et le processus de PR review",
      "Identifier les points douloureux actuels (dette technique, bugs récurrents)",
      "Demander un accès en lecture à la production (jamais en écriture d'emblée)",
      "Planifier une session de pair-programming avec un collègue expérimenté",
      "Documenter ce qui était flou pour améliorer l'onboarding des futurs arrivants",
    ],
  },
  {
    id: "sql-perf", role: "Data Analyst", emoji: "⚡",
    titre: "Optimisation d'une requête SQL lente",
    desc: "Diagnostic et solutions pour accélérer une requête qui tourne trop longtemps.",
    items: [
      "Lire le plan d'exécution (EXPLAIN ANALYZE) — identifier les full scans",
      "Vérifier si les colonnes de filtre (WHERE) sont indexées",
      "Vérifier si les colonnes de jointure sont indexées dans les deux tables",
      "Réduire le périmètre de données : filtrer le plus tôt possible (avant les JOIN)",
      "Remplacer SELECT * par les colonnes réellement nécessaires",
      "Vérifier la cardinalité des jointures (multiplication de lignes ?)",
      "Remplacer les sous-requêtes corrélées par des CTEs ou des JOIN",
      "Utiliser LIMIT pour tester avant de lancer sur tout le dataset",
      "Vérifier si les partitions sont utilisées (partition pruning)",
      "Éviter les fonctions sur les colonnes de filtre (empêchent l'usage des index)",
      "Analyser les statistiques de la table (ANALYZE TABLE si nécessaire)",
      "Considérer une table matérialisée si la requête est fréquente",
    ],
  },
];

const TIPS: Record<string, { titre: string; tips: string[] }[]> = {
  "Data Analyst": [
    {
      titre: "SQL — Qualité & Performance",
      tips: [
        "Toujours écrire un commentaire en tête de requête : date, auteur, objectif métier.",
        "Utiliser des CTEs plutôt que des sous-requêtes imbriquées : 10× plus lisible et plus maintenable.",
        "Avant toute analyse, vérifier COUNT(*) vs COUNT(DISTINCT clé) — détecte immédiatement les doublons.",
        "NULLIF(x, 0) évite les divisions par zéro sans IF imbriqués. Réflexe à avoir sur chaque ratio.",
        "Les window functions (LAG, LEAD, RANK, SUM OVER) remplacent 80% des auto-jointures complexes.",
        "Filtrer tôt dans une CTE avant les jointures — réduit la taille des tables et accélère la requête.",
        "EXPLAIN ANALYZE avant toute requête lente : trouver les full scans et jointures cartésiennes.",
        "Ne jamais utiliser SELECT * en production : spécifier les colonnes nécessaires réduit le coût et le temps.",
      ],
    },
    {
      titre: "Power BI — Bonnes pratiques",
      tips: [
        "Créer une table 'Calendrier' dédiée dans le modèle : indispensable pour les fonctions time intelligence.",
        "Mesures DAX avec CALCULATE + FILTER > colonnes calculées : recalcul dynamique selon le contexte.",
        "ALL() dans une mesure DAX supprime les filtres pour calculer des pourcentages du total.",
        "Ajouter une date de dernière actualisation visible sur chaque page du rapport.",
        "Nommer toutes les mesures DAX avec un préfixe métier : [CA] au lieu de [Sum of montant].",
        "Modèle étoile (faits + dimensions) > modèle flocon : plus simple et plus performant.",
        "Power Query : appliquer les filtres de lignes avant de charger la table (Query Folding).",
        "Row-Level Security (RLS) pour les rapports avec données sensibles : configurer par région ou entité.",
      ],
    },
    {
      titre: "Excel & Analyse rapide",
      tips: [
        "Tableau croisé dynamique + segment = analyse exploratoire rapide sans SQL.",
        "RECHERCHEV est lente et fragile — préférer INDEX/EQUIV ou XLOOKUP (Excel 365).",
        "Power Query dans Excel : transformer des données sans formule, avec un historique des étapes.",
        "Raccourcis indispensables : Ctrl+T (table), Ctrl+Shift+L (filtres), Alt+= (somme auto).",
        "Valider les formules avec un jeu de données connu avant de déployer sur le fichier de production.",
      ],
    },
    {
      titre: "Storytelling & Communication",
      tips: [
        "Une diapo = une idée. Le titre annonce la conclusion, pas le sujet (ex: 'Le CA augmente de 12%').",
        "Choisir le bon graphique : barres pour comparer, lignes pour les tendances, scatter pour les corrélations.",
        "Toujours commencer par le So What — l'insight, pas les données brutes.",
        "Anticiper les questions : préparer un backup avec le détail méthodologique.",
        "Couleurs : 1-2 couleurs d'accent maximum. Le rouge signifie toujours un problème.",
        "Arrondir intelligemment : 1,23 M€ est plus lisible que 1 234 567,89 €.",
      ],
    },
    {
      titre: "Prompts LLM pour Data Analysts",
      tips: [
        "\"Génère une requête SQL qui [objectif]. Utilise des CTEs. Table : [schéma]\"",
        "\"Explique cette erreur SQL et propose une correction : [coller l'erreur]\"",
        "\"Vérifie cette requête SQL pour des problèmes de performance et de logique : [code]\"",
        "\"Génère 10 mesures DAX utiles pour un modèle de données e-commerce [schéma]\"",
        "\"Transforme ce résultat de tableau croisé en insights rédigés pour un comité de direction.\"",
      ],
    },
  ],
  "Data Scientist": [
    {
      titre: "Machine Learning — Méthodologie",
      tips: [
        "Toujours commencer par une baseline naïve (prédire la majorité, ou la moyenne) avant tout modèle.",
        "La stratification dans le split est obligatoire sur des classes déséquilibrées.",
        "SHAP > feature_importances_ : explique mieux, détecte les interactions, fonctionne sur tous les modèles.",
        "Un modèle interprétable à AUC 0.85 vaut souvent mieux qu'une boîte noire à 0.87.",
        "Vérifier le data leakage AVANT d'afficher un bon score : c'est la cause n°1 de faux résultats.",
        "Cross-validation temporelle (TimeSeriesSplit) obligatoire pour les données avec une dimension temps.",
        "La calibration des probabilités est essentielle si les scores sont utilisés pour prioriser (pas juste classer).",
        "Analyser les erreurs du modèle : où échoue-t-il ? Les faux négatifs coûtent-ils plus que les faux positifs ?",
      ],
    },
    {
      titre: "Python — Code & Reproductibilité",
      tips: [
        "requirements.txt ou pyproject.toml : toujours versionner ses dépendances avec les versions exactes.",
        "Fixer la random_state partout (train_test_split, modèles, SMOTE) pour des résultats reproductibles.",
        "Notebooks Jupyter = exploration. La production = modules Python testés avec pytest.",
        "nbstripout : retirer les outputs des notebooks avant chaque commit Git (pip install nbstripout --install).",
        "Typer les fonctions Python avec des type hints : meilleure documentation et détection d'erreurs.",
        "Utiliser des dataclasses ou Pydantic pour les configurations de modèle — plus sûr que les dicts.",
        "Logging > print() en production : niveaux DEBUG/INFO/WARNING/ERROR, pas de print().",
      ],
    },
    {
      titre: "MLOps & Expérimentation",
      tips: [
        "Tracker chaque expérience dans MLflow : params, métriques, artefacts, version du code.",
        "Ne jamais relancer manuellement un training sans logger les résultats.",
        "Le modèle en prod doit être exactement celui loggé dans le registry — pas de 'j'ai retouché un peu'.",
        "Définir des seuils de re-entraînement AVANT la mise en prod : quand déployer la version suivante ?",
        "Le monitoring de la distribution des features en entrée est souvent plus utile que le monitoring des métriques.",
        "Shadow mode : faire tourner le nouveau modèle en parallèle de l'ancien avant de basculer.",
      ],
    },
    {
      titre: "Statistiques appliquées",
      tips: [
        "p-value < 0.05 n'est pas suffisant : vérifier aussi l'effect size (Cohen's d, odds ratio).",
        "Corrélation ≠ causalité : toujours chercher les variables confondantes.",
        "Test de Student (t-test) suppose la normalité : sur de petits échantillons, préférer Mann-Whitney.",
        "Bonferroni correction si vous faites plusieurs tests simultanément (problème des comparaisons multiples).",
        "Bootstrap : générer des intervalles de confiance sans supposer la distribution des données.",
        "La puissance statistique d'un test se calcule AVANT le lancement, pas après.",
      ],
    },
    {
      titre: "Prompts LLM pour Data Scientists",
      tips: [
        "\"Explique cette erreur Python et propose 3 corrections : [coller l'erreur]\"",
        "\"Génère une fonction Python [description]. Inclure type hints, docstrings et tests unitaires.\"",
        "\"Voici mon pipeline sklearn. Identifie les problèmes potentiels et propose des améliorations.\"",
        "\"Génère des données synthétiques réalistes (100 lignes, dataset churn client) en pandas.\"",
        "\"Transforme ce code pandas en polars équivalent (plus performant sur large dataset).\"",
        "\"Quelle architecture de modèle recommandes-tu pour [type de problème] avec [contraintes] ?\"",
      ],
    },
  ],
  "Data Engineer": [
    {
      titre: "Pipelines & Architecture",
      tips: [
        "Idempotence first : un pipeline réexécutable sans effets de bord est un pipeline fiable.",
        "Partitionner les tables par date dès le départ : impossible à ajouter proprement après coup.",
        "Les petits fichiers tuent les performances Spark et BigQuery — compacter régulièrement avec OPTIMIZE.",
        "Toujours logger les volumes en entrée et en sortie de chaque étape ETL.",
        "dbt + Airflow (ou Kestra) = le duo standard 2026 : transformation versionnée + orchestration.",
        "Late-arriving data : définir la stratégie dès le design (re-run, upsert, ou ignorer).",
        "Le schéma évolutif est inévitable : utiliser un format qui le supporte (Iceberg, Delta Lake).",
        "Alerter sur le volume de données : un job qui produit 0 lignes est souvent un bug silencieux.",
      ],
    },
    {
      titre: "SQL & Modélisation",
      tips: [
        "Schéma en étoile > schéma normalisé pour l'analytique : moins de jointures, requêtes plus rapides.",
        "Les colonnes de type 'statut' doivent toujours avoir une valeur par défaut — jamais NULL.",
        "Toujours tester COUNT(*) en entrée et COUNT(*) en sortie d'un pipeline pour détecter les pertes.",
        "Une clé de substitution (surrogate key) > une clé naturelle composite pour les tables de faits.",
        "SCD Type 2 (historisation) pour les dimensions qui changent : date_debut, date_fin, is_current.",
        "Une vue dans le warehouse ne remplace pas un test de qualité dans dbt.",
      ],
    },
    {
      titre: "Git & Qualité du code",
      tips: [
        "Convention de branches : feat/xxx, fix/xxx, refactor/xxx — la PR review devient 5× plus simple.",
        "Commits atomiques (une modification = un commit) : plus facile à revert et à comprendre.",
        ".gitignore data projects : jamais de .csv, .parquet, .env ou credentials en Git.",
        "GitHub Actions pour dbt : les tests dbt doivent passer avant chaque merge sur main.",
        "Code review systématique : homogénéise les standards et diffuse les connaissances.",
        "pre-commit hooks : formatage automatique (black, sqlfluff) avant chaque commit.",
      ],
    },
    {
      titre: "Cloud & Optimisation des coûts",
      tips: [
        "Snowflake : AUTO_SUSPEND à 60 secondes sur les warehouses interactifs — économie immédiate.",
        "BigQuery : tagger les requêtes coûteuses (labels) pour les identifier dans le billing.",
        "AWS S3 : Parquet compressé Snappy divise par 5-10 la taille et le coût de requête.",
        "Databricks : jobs clusters plutôt que all-purpose clusters pour les runs automatisés (3× moins cher).",
        "S3 Lifecycle policies : archiver en Glacier les données > 90 jours non accédées.",
        "Toujours tagger les ressources cloud (projet, équipe, env) : indispensable pour allouer les coûts.",
        "Scanner les requêtes BigQuery sans partitionnement dans les logs : souvent les coûts cachés majeurs.",
      ],
    },
    {
      titre: "Sécurité & Bonnes pratiques",
      tips: [
        "Principe du moindre privilège : accès en lecture seule par défaut, écriture justifiée et auditée.",
        "Jamais de credentials en clair dans le code : variables d'environnement ou vault (AWS Secrets Manager).",
        "Chiffrer les données sensibles au repos (S3 SSE-KMS) et en transit (TLS obligatoire).",
        "Auditer régulièrement les droits d'accès : les anciens collaborateurs ont-ils encore un accès ?",
        "Logging de tous les accès aux données PII : obligatoire RGPD et indispensable pour l'audit.",
      ],
    },
  ],
  "Analytics Engineer": [
    {
      titre: "dbt — Patterns & Bonnes pratiques",
      tips: [
        "Nommer les models par couche : stg_ (staging), int_ (intermédiaire), fct_ (faits), dim_ (dimensions).",
        "Un model dbt = une seule transformation logique. Si > 200 lignes, découper en deux models.",
        "Utiliser {{ ref() }} partout : jamais de nom de table en dur dans un model.",
        "Les tests dbt (unique, not_null, relationships) sont des contrats de qualité, pas optionnels.",
        "Matérialiser en 'view' par défaut, en 'table' si lente, en 'incremental' si volumineuse.",
        "dbt docs generate && dbt docs serve : partager la documentation avec les équipes métier.",
        "Les snapshots dbt = SCD Type 2 sans effort : historiser les changements de dimension.",
        "Ajouter des tests de freshness sur les sources : alerter si les données ont plus de X heures.",
      ],
    },
    {
      titre: "SQL analytique avancé",
      tips: [
        "Les window functions évitent 90% des self-joins complexes : maîtriser PARTITION BY + ORDER BY.",
        "QUALIFY (Snowflake/BigQuery) filtre directement sur le résultat d'une window function sans CTE.",
        "UNNEST/LATERAL FLATTEN pour exploser des colonnes JSON ou des arrays.",
        "Materialized views pour les agrégats coûteux souvent requêtés (BigQuery, Snowflake).",
        "Dynamic tables (Snowflake) = materialized views avec fraîcheur configurable automatiquement.",
        "Le semi-join (EXISTS / IN) est souvent plus rapide qu'un JOIN + DISTINCT.",
      ],
    },
    {
      titre: "Modélisation & Gouvernance",
      tips: [
        "One Big Table (OBT) vs schéma étoile : OBT = simple mais coûteux ; étoile = performant mais complexe.",
        "Definir les métriques dans un semantic layer (dbt Metrics, Cube.dev) : une seule définition partagée.",
        "Les colonnes de date_id (YYYYMMDD en INTEGER) sont plus performantes que les colonnes DATE en BI.",
        "Documenter les règles métier dans les descriptions dbt — la source de vérité pour les équipes.",
        "grain = la granularité d'un model. Toujours documenter ce que représente une ligne.",
        "Tests de cohérence cross-models : vérifier que les agrégats fct_ correspondent aux dim_.",
      ],
    },
    {
      titre: "Collaboration & Productivité",
      tips: [
        "Revue de code dbt : vérifier les tests, la documentation, le naming et l'efficacité SQL.",
        "Slim CI : ne tester que les models modifiés en PR (dbt --select state:modified+).",
        "Exposer les models dbt dans le catalog : informer les consommateurs BI des nouvelles tables.",
        "Créer des macros pour tout ce qui se répète (safe_divide, clean_string, date_id).",
        "PR dbt = description du changement métier + impact sur les models en aval.",
      ],
    },
  ],
  "Data Manager": [
    {
      titre: "Gouvernance & Organisation",
      tips: [
        "Commencer par identifier 3-5 Data Owners motivés : la gouvernance sans sponsor métier échoue systématiquement.",
        "Un Data Catalog imparfait utilisé > un Data Catalog parfait jamais consulté. Commencer simple.",
        "Mesurer le temps perdu à chercher des données : c'est l'argument ROI le plus puissant pour la gouvernance.",
        "RGPD : cartographier les données personnelles par domaine avant tout projet IA.",
        "Réunion de Data Quality mensuelle (30 min) : traiter les incidents avant qu'ils deviennent des crises.",
        "Les définitions métier conflictuelles sont la première source d'erreur dans les rapports.",
        "Chaque colonne critique doit avoir un propriétaire et une définition validée en moins de 48h.",
      ],
    },
    {
      titre: "Pilotage de l'équipe data",
      tips: [
        "3 métriques pour piloter une équipe data : délai de livraison, qualité (incidents prod), satisfaction métier.",
        "Un roadmap data visible de tous (Confluence, Notion, Jira) réduit les demandes informelles répétées.",
        "Les quick wins (< 2 semaines, impact mesurable) sont essentiels pour maintenir la confiance.",
        "Distinguer les demandes urgentes des demandes importantes : pas toutes traitées de la même façon.",
        "Rétrospective mensuelle en équipe : ce qui a bien marché, ce qui doit changer.",
        "Documentation des schémas de données = actif stratégique dont la valeur croît dans le temps.",
      ],
    },
    {
      titre: "Communication avec les métiers",
      tips: [
        "Traduire les résultats ML en langage business : pas l'AUC, mais '12% de fraude en moins = 800k€ évités'.",
        "Présenter les incertitudes et les limites des données : les métiers font des décisions meilleures avec honnêteté.",
        "Un dashboard sans SLA de fraîcheur visible perd la confiance des utilisateurs dès la première anomalie.",
        "Impliquer les équipes métier dans la définition des métriques : elles savent mieux que vous ce qu'elles mesurent.",
        "Former les utilisateurs BI : un utilisateur formé crée moins de mauvaises interprétations et moins de tickets.",
      ],
    },
    {
      titre: "Sécurité & Conformité",
      tips: [
        "Revue semestrielle des accès : qui a accès à quoi ? Les anciens employés sont-ils désactivés ?",
        "Politique de classification des données appliquée dès la création : confidentiel/interne/public.",
        "Chiffrement en transit et au repos pour toutes les données personnelles — obligation RGPD.",
        "Registre des activités de traitement (RAT) à jour : obligation légale et audit CNIL simplifié.",
        "Formation RGPD annuelle pour toute l'équipe data : les erreurs de conformité coûtent cher.",
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

const SNIPPET_CATS = ["Tous", "SQL", "Python", "dbt", "PySpark", "Git/Shell", "R", "Polars", "Scala", "YAML", "Regex"];
const TIPS_ROLES = ["Data Analyst", "Data Scientist", "Data Engineer", "Analytics Engineer", "Data Manager"];
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
  const [snippetTheme, setSnippetTheme] = useState("Tout");
  const [tipsRole, setTipsRole] = useState("Data Analyst");
  const [resCat, setResCat] = useState("docs");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const byLang = snippetCat === "Tous" ? SNIPPETS : SNIPPETS.filter((s: {cat: string}) => s.cat === snippetCat);
  const filteredSnippets = snippetTheme === "Tout" ? byLang : byLang.filter((s: {theme: string}) => s.theme === snippetTheme);
  const themeCounts = byLang.reduce((acc: Record<string, number>, s: {theme: string}) => ({ ...acc, [s.theme]: (acc[s.theme] || 0) + 1 }), {});
  const availableThemes = ["Tout", ...Object.keys(themeCounts).sort((a, b) => themeCounts[b] - themeCounts[a])];

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
            {/* ── Filtre par langage ── */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              {SNIPPET_CATS.map(cat => (
                <button key={cat} onClick={() => { setSnippetCat(cat); setSnippetTheme("Tout"); }} className={`filter-chip ${snippetCat === cat ? "active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* ── Sous-filtre par thématique (dynamique selon le langage) ── */}
            {availableThemes.length > 2 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginRight: 4 }}>Thème</span>
                {availableThemes.map(theme => (
                  <button
                    key={theme}
                    onClick={() => setSnippetTheme(theme)}
                    style={{
                      padding: "4px 11px",
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: snippetTheme === theme ? 700 : 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      background: snippetTheme === theme ? "#EDE9FE" : "#F8FAFC",
                      color: snippetTheme === theme ? "#5B21B6" : "#64748B",
                      border: snippetTheme === theme ? "1.5px solid #C4B5FD" : "1.5px solid #E2E8F0",
                    }}
                  >
                    {theme}
                    {theme !== "Tout" && (
                      <span style={{ marginLeft: 5, fontSize: 10, color: snippetTheme === theme ? "#7C3AED" : "#94A3B8" }}>
                        {themeCounts[theme]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {filteredSnippets.map(s => (
                <div key={s.id} className="card" style={{ overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span className="badge badge-indigo">{s.cat}</span>
                        <span className="badge badge-neutral" style={{ fontFamily: "var(--font-mono)" }}>{s.lang}</span>
                        <span style={{
                          padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE",
                        }}>{s.theme}</span>
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

            </div>
          </div>
        )}

      </section>
    </main>
  );
}
