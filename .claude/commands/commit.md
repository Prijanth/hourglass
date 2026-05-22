# /commit

Sauvegarde l'état actuel du workspace dans Git.

## Ce que cette commande fait

1. Vérifie si le dépôt Git est initialisé, le crée si nécessaire
2. Affiche les fichiers modifiés/ajoutés depuis le dernier commit
3. Propose un message de commit généré automatiquement selon les changements détectés
4. Attend confirmation avant de committer
5. Effectue le commit et confirme la sauvegarde

## Comportement

- Ne committe **jamais** `.env` ni aucun fichier de secrets (protégé par `.gitignore`)
- Si c'est le premier commit, initialise le dépôt et crée la branche `main`
- Le message de commit est en français, court et descriptif
- Si l'argument `$ARGUMENTS` est fourni, l'utiliser directement comme message de commit sans demander confirmation

## Instructions pour Claude

Exécute les étapes suivantes :

**Étape 1 — Vérifier/initialiser le dépôt**
```bash
git rev-parse --git-dir 2>$null
```
Si le dépôt n'existe pas, lancer `git init` puis `git checkout -b main`.

**Étape 2 — Voir l'état**
```bash
git status
git diff --stat HEAD 2>$null
```
Affiche un résumé lisible des changements en cours.

**Étape 3 — Message de commit**
- Si `$ARGUMENTS` est non vide, utiliser ce texte comme message
- Sinon, analyser les changements et proposer un message en français. Demander confirmation ou modification avant de continuer.

**Étape 4 — Committer**
```bash
git add .
git commit -m "<message validé>"
```

**Étape 5 — Confirmer**
Afficher le hash du commit et le résumé des fichiers sauvegardés.
