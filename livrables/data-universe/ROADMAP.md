# Roadmap Data Universe — Plan d'action

> Liste consolidée de tout ce qui reste à faire, corriger, améliorer et monétiser.
> À cocher au fur et à mesure des sessions.

---

## PHASE 1 — Corrections critiques (faire en premier)

- [ ] **1.1** Corriger l'encodage mojibake dans `content/certifications.json` (et vérifier concepts.json, cas-usage.json, ia.json)
- [ ] **1.2** Nettoyer le dépôt git : stager et committer la suppression des fichiers `livrables/datasphere/` (toujours trackés en ghost)
- [ ] **1.3** Corriger le DNS OVH pour pointer vers Vercel : dans la zone DNS OVH, remplacer les enregistrements Netlify par ceux que Vercel recommande (probablement `A` → `76.76.21.21` et CNAME `www` → `cname.vercel-dns.com`) — badge "DNS Change Recommended" visible dans Vercel settings/domains
- [ ] **1.3b** Supprimer le fichier `netlify.toml` devenu obsolète depuis la migration vers Vercel
- [ ] **1.4** Synchroniser les chiffres de la hero card homepage avec les volumes réels actuels (certifications, concepts, outils, etc.)

---

## PHASE 2 — Contenu et infrastructure manquants

- [ ] **2.1** Créer la boîte email `contact@data-universe.fr` sur OVH (section MX / Zimbra)
- [ ] **2.2** Intégrer le lien de désabonnement dans le template email des futures newsletters
- [ ] **2.3** Décider si on réactive le bot de contenu (et à quelle fréquence) puis le relancer
- [ ] **2.4** Écrire l'article : *Migration SAS 9 → Dataiku : les coûts cachés réels*
- [ ] **2.5** Écrire l'article : *Data Mesh — 3 ans après le buzz, où en est-on vraiment ?*
- [ ] **2.6** Écrire l'article : *AI Act : guide technique pour les Data Engineers*

---

## PHASE 3 — Améliorations UX / Produit

- [ ] **3.1** Créer une page landing dédiée pour la newsletter (pas juste un formulaire dans le footer)
- [ ] **3.2** Ajouter un système de tags sur les articles (LLM, Gouvernance, Carrière, Outils...)
- [ ] **3.3** Ajouter une section "Pour vous" sur la homepage (contenu lié aux dernières pages visitées, via localStorage)
- [ ] **3.4** Ajouter un mode quiz intégré sur les fiches certifications (3-5 questions directement sur la page)
- [ ] **3.5** Ajouter un badge "Lien vérifié le [date]" sur les fiches certifications (les URLs d'organismes changent)
- [ ] **3.6** Améliorer le partage LinkedIn : card pré-remplie avec titre, description et image de la fiche partagée

---

## PHASE 4 — SEO et visibilité

- [ ] **4.1** Définir une stratégie backlinks (publications LinkedIn personnelles avec lien vers le site, soumissions annuaires data FR)
- [ ] **4.2** Créer un compte LinkedIn dédié à Data Universe (ou page entreprise)
- [ ] **4.3** Optimiser les meta descriptions sur les 10 pages les plus visitées (à identifier via GSC)
- [ ] **4.4** Identifier les mots-clés pour lesquels le site commence à remonter dans GSC et les renforcer

---

## PHASE 5 — Vérifications pré-lancement officiel

- [ ] **5.1** Tester les liens affiliés Amazon Associates de bout en bout (clic → tracking)
- [ ] **5.2** Activer officiellement le programme Impact.com / Udemy et tester les liens
- [ ] **5.3** Test complet newsletter : inscription → email de confirmation → clic → confirmation Supabase
- [ ] **5.4** Test lien de désabonnement bout-en-bout
- [ ] **5.5** Vérifier que toutes les routes du sitemap (706 pages) renvoient un 200 (pas de 404 cachés)
- [ ] **5.6** Configurer des événements GA4 personnalisés : clics affiliés, clics newsletter, inscriptions
- [ ] **5.7** Audit visuel mobile (375px) sur les pages les plus consultées

---

## PHASE 6 — Monétisation (dernière étape)

- [ ] **6.1** Faire une demande Google AdSense (attendre d'avoir ~10 000 pages vues/mois)
- [ ] **6.2** S'inscrire à Carbon Ads (réseau pub premium ciblé tech/dev)
- [ ] **6.3** S'inscrire aux programmes d'affiliation Coursera et DataCamp
- [ ] **6.4** Créer la page jobboard sponsorisé avec les tarifs (offre d'emploi = 50-200€)
- [ ] **6.5** Créer un premier guide PDF premium (ex : "Réussir sa certification AWS ML Engineer") — vente via Gumroad
- [ ] **6.6** Créer une page `/travailler-avec-nous` pour les leads consulting (formulaire qualifié)
- [ ] **6.7** Définir le media kit newsletter (format, audience, tarifs par placement) dès 500 abonnés
- [ ] **6.8** Prospecter des sponsors potentiels (Databricks, Snowflake, outils data français) pour la newsletter

---

*Dernière mise à jour : 2026-07-21*
