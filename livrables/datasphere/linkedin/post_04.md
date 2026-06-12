# C'est quoi un Lakehouse ?
**Format :** Post texte + schéma textuel
**Objectif :** Éduquer
**Hashtags :** #Lakehouse #DataLake #DataWarehouse #Architecture #DataSphère

---

Le mot "Lakehouse" revient partout en ce moment.
Databricks en parle. Delta Lake. Apache Iceberg. Mais c'est quoi concrètement ?

Une analogie pour comprendre. 🏠

---

**Le Data Warehouse** c'est un appartement Haussmannien.

Tout est structuré, rangé, propre.
Les données sont organisées en tables bien définies.
Les requêtes SQL sont rapides.

Mais : cher à construire, peu flexible, difficile à modifier.
Et les données non-structurées (images, logs, textes bruts) n'y ont pas leur place.

---

**Le Data Lake** c'est un entrepôt.

Tout rentre. Structuré, semi-structuré, brut.
Coût de stockage très faible.

Mais : vite ingérable. Un "data swamp" si personne ne range.
Pas optimisé pour les requêtes analytiques.

---

**Le Lakehouse** c'est l'entrepôt qu'on a organisé comme un appartement.

```
[ Stockage objet bas coût (S3 / ADLS) ]
           +
[ Couche transactionnelle (Delta Lake / Iceberg) ]
           +
[ Moteur de requêtes SQL rapide ]
= Lakehouse
```

Tu gardes la flexibilité et le faible coût du Data Lake.
Tu gagnes la structure et les performances du Data Warehouse.

---

C'est pour ça que Delta Lake, Apache Iceberg et Apache Hudi existent.
Ils ajoutent les propriétés ACID au stockage objet.

Databricks, Snowflake et Microsoft Fabric construisent leurs produits sur ce paradigme.

---
**CTA :** Comprendre l'architecture Lakehouse en profondeur : fiche complète sur DataSphère.
**Lien :** https://datasphere.fr/concepts/lakehouse
