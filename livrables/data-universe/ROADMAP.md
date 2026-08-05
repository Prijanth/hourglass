# Roadmap Data Universe — Plan d'action

> Liste consolidée de tout ce qui reste à faire, corriger, améliorer et monétiser.
> À cocher au fur et à mesure des sessions.

---

## PHASE 1 — Corrections critiques (faire en premier)

- [x] **1.1** Corriger l'encodage mojibake dans `content/certifications.json` (vérifié OK — artefact d'affichage PowerShell)
- [x] **1.2** Nettoyer le dépôt git : stager et committer la suppression des fichiers `livrables/datasphere/`
- [x] **1.3** DNS OVH déjà correctement configuré : `@ A → 76.76.21.21`, `www CNAME → cname.vercel-dns.com` (badge cosmétique, pas bloquant)
- [x] **1.3b** Supprimer le fichier `netlify.toml` devenu obsolète (fait)
- [x] **1.4** Synchroniser les chiffres de la hero card homepage : 143 concepts, 97 outils (fait)

---

## PHASE 2 — Contenu et infrastructure manquants

- [ ] **2.1** Créer la boîte email `contact@data-universe.fr` sur OVH (section MX / Zimbra) — **ACTION UTILISATEUR**
- [x] **2.2** Intégrer le lien de désabonnement dans le template email de confirmation (fait)
- [ ] **2.3** Réactiver le bot de contenu après tous les développements — **À FAIRE EN DERNIER**
- [x] **2.4** Article : *Migration SAS 9 → Dataiku : les coûts cachés réels* (dans articles.json)
- [x] **2.5** Article : *Data Mesh — 3 ans après le buzz, où en est-on vraiment ?* (dans articles.json)
- [x] **2.6** Article : *AI Act : guide technique pour les Data Engineers* (dans articles.json)

---

## PHASE 3 — Améliorations UX / Produit

- [x] **3.1** Page newsletter dédiée `/newsletter` avec formulaire complet (faite)
- [x] **3.2** Tags sur les articles (ajoutés dans articles.json + affichés dans /actualites)
- [x] **3.3** Section "Pour vous" sur la homepage (localStorage `du_visited` + composant `PourVous`)
- [x] **3.4** Quiz intégré sur les fiches certifications (sidebar avec lien vers `/quiz/[slug]`)
- [x] **3.5** Badge "Données vérifiées" avec date dynamique depuis `certifications.json`
- [x] **3.6** Bouton partage LinkedIn sur les fiches certifications

---

## PHASE 4 — SEO et visibilité

- [ ] **4.1** Définir une stratégie backlinks — **ACTION UTILISATEUR** (publications LinkedIn avec lien vers le site)
- [ ] **4.2** Créer un compte LinkedIn dédié à Data Universe — **ACTION UTILISATEUR**
- [x] **4.3** Optimiser meta descriptions + OpenGraph sur 7 pages clés (certifications, glossaire, actualites, cas-usage, metiers, outils, concepts)
- [ ] **4.4** Identifier les mots-clés GSC qui commencent à remonter et les renforcer — **ACTION UTILISATEUR**

---

## PHASE 5 — Vérifications pré-lancement officiel

- [ ] **5.1** Tester les liens affiliés Amazon Associates de bout en bout — **ACTION UTILISATEUR**
- [ ] **5.2** Activer officiellement Impact.com / Udemy et tester les liens — **ACTION UTILISATEUR**
- [ ] **5.3** Test complet newsletter : inscription → email de confirmation → clic → confirmation Supabase — **ACTION UTILISATEUR**
- [ ] **5.4** Test lien de désabonnement bout-en-bout — **ACTION UTILISATEUR**
- [x] **5.5** Vérifier les routes du sitemap : 20 routes statiques OK, toutes les routes dynamiques OK (generateStaticParams présent partout)
- [x] **5.6** GA4 custom events : clics affiliés (Amazon/Udemy) trackés dans `ResourceLink`, inscription newsletter trackée dans `newsletter/page.tsx`
- [x] **5.7** Audit mobile 375px (code) : 3 classes responsive ajoutées (`cert-hero-grid`, `cert-main-grid`, `newsletter-form-grid`), inline grids remplacés — **Vérification visuelle à faire par l'utilisateur**

---

## PHASE 6 — Monétisation (dernière étape)

- [ ] **6.1** Faire une demande Google AdSense — **ACTION UTILISATEUR** (attendre ~10 000 pages vues/mois)
- [ ] **6.2** S'inscrire à Carbon Ads — **ACTION UTILISATEUR**
- [ ] **6.3** S'inscrire aux programmes d'affiliation Coursera et DataCamp — **ACTION UTILISATEUR**
- [x] **6.4** Créer la page jobboard sponsorisé avec les tarifs (section pricing ajoutée dans `/recruteurs` : gratuit / 50€ Pro / 200€ Premium)
- [ ] **6.5** Créer un guide PDF premium (ex : "Réussir sa certification AWS ML Engineer") — **CONTENU**
- [x] **6.6** Créer une page `/travailler-avec-nous` pour les leads consulting (6 domaines d'expertise, 3 formats d'intervention, CTA email)
- [ ] **6.7** Définir le media kit newsletter (format, audience, tarifs) — **CONTENU** (dès 500 abonnés)
- [ ] **6.8** Prospecter des sponsors — **ACTION UTILISATEUR**

---

*Dernière mise à jour : 2026-07-21*
