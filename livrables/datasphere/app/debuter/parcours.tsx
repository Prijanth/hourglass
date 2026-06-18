"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ETAPES = [
  {
    num: "01",
    titre: "Comprendre les métiers de la data",
    duree: "1 semaine",
    desc: "Avant d'apprendre quoi que ce soit, il faut savoir vers quel métier tu te diriges. Data Analyst, Data Engineer, Data Scientist, ML Engineer : chaque rôle a des compétences différentes.",
    actions: [
      "Lire les fiches métiers Data Universe pour comprendre les différences",
      "Identifier le rôle qui correspond à ton profil et tes objectifs",
      "Regarder les salaires et les compétences requises pour chaque poste",
    ],
    liens: [
      { label: "Fiche Data Analyst", href: "/metiers/data-analyst" },
      { label: "Fiche Data Engineer", href: "/metiers/data-engineer" },
      { label: "Fiche Data Scientist", href: "/metiers/data-scientist" },
      { label: "Tous les métiers data", href: "/metiers" },
      { label: "Je viens d'un autre domaine →", href: "/metiers/data-analyst#transition" },
    ],
    couleur: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    num: "02",
    titre: "Apprendre SQL — la compétence n°1",
    duree: "2 à 4 semaines",
    desc: "SQL est présent dans pratiquement toutes les offres data, quel que soit le métier. C'est la compétence la plus rentable à acquérir en premier : facile à apprendre, immédiatement valorisable.",
    actions: [
      "Suivre un cours SQL débutant (SQLZoo ou SQLBolt sont gratuits)",
      "Pratiquer avec de vraies données sur BigQuery sandbox (gratuit)",
      "Réaliser les exercices de 8 Week SQL Challenge (gratuit)",
    ],
    liens: [
      { label: "Glossaire : SQL", href: "/glossaire?q=sql" },
      { label: "Concept : OLAP vs OLTP", href: "/concepts/olap-vs-oltp" },
    ],
    couleur: "#0E7490",
    bg: "#ECFEFF",
  },
  {
    num: "03",
    titre: "Apprendre Python pour la data",
    duree: "4 à 8 semaines",
    desc: "Python est le langage standard de la data. Mais si tu vises Data Analyst, commence par Power BI — c'est la compétence n°1 des offres junior en France. Python (Pandas) arrive ensuite pour les analyses plus avancées.",
    actions: [
      "Si tu vises Data Analyst : apprendre Power BI (Microsoft Learn, gratuit) — présent dans 80% des offres junior",
      "Suivre Python for Everybody (Coursera, gratuit en audit) pour les bases du scripting",
      "Pratiquer Pandas sur des datasets publics (Kaggle) : lecture de fichiers, groupby, merge",
    ],
    liens: [
      { label: "Glossaire : Pandas", href: "/glossaire?q=pandas" },
      { label: "Glossaire : Python", href: "/glossaire?q=python" },
      { label: "Outil : Pandas (la référence)", href: "/outils/pandas" },
    ],
    couleur: "#15803D",
    bg: "#F0FDF4",
  },
  {
    num: "04",
    titre: "Décrocher ta première certification",
    duree: "4 à 12 semaines",
    desc: "Une certification valide tes compétences auprès des recruteurs et t'oblige à apprendre de façon structurée. Commence par une certification cloud accessible — elles sont reconnues, abordables et bien documentées.",
    actions: [
      "Choisir entre Google Data Analytics Certificate (débutant, 6 mois) ou AWS Cloud Practitioner (2 mois)",
      "Suivre les cours officiels et la documentation",
      "Passer l'examen — le taux de réussite au premier essai est élevé si tu révises sérieusement",
    ],
    liens: [
      { label: "Toutes les certifications débutants", href: "/certifications?niveau=Débutant" },
      { label: "Certif : Google Data Analytics", href: "/certifications/google-data-analytics" },
      { label: "Certif : AWS Cloud Practitioner", href: "/certifications/aws-cloud-practitioner" },
    ],
    couleur: "#B45309",
    bg: "#FFFBEB",
  },
  {
    num: "05",
    titre: "Construire ton premier projet réel",
    duree: "2 à 4 semaines",
    desc: "Un projet concret sur ton CV vaut plus que 3 certifications. Il démontre que tu sais appliquer ce que tu as appris sur un vrai problème. Il n'a pas besoin d'être parfait — il doit être réel.",
    actions: [
      "Choisir un sujet qui t'intéresse vraiment (sport, finance, mobilité, santé…)",
      "Récupérer des données ouvertes (data.gouv.fr, Kaggle Datasets, APIs publiques)",
      "Construire un dashboard simple ou une analyse complète, la publier sur GitHub",
    ],
    liens: [
      { label: "Cas d'usage pour s'inspirer", href: "/cas-usage" },
      { label: "Outils débutants recommandés", href: "/outils?niveau=débutant" },
    ],
    couleur: "#BE123C",
    bg: "#FFF1F2",
  },
];

const STORAGE_KEY = "Data Universe_debuter_progress";

export function ParcoursEtapes() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCompleted(JSON.parse(saved));
    } catch {}
  }, []);

  function toggle(num: string) {
    setCompleted(prev => {
      const next = { ...prev, [num]: !prev[num] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function reset() {
    setCompleted({});
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 72px" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Le parcours</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
          5 étapes pour entrer dans la data
        </h2>

        {/* Barre de progression */}
        {mounted && (
          <div style={{ maxWidth: 420, margin: "20px auto 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#64748B" }}>
                {completedCount === 0
                  ? "Aucune étape complétée"
                  : completedCount === ETAPES.length
                  ? "🎉 Parcours terminé !"
                  : `${completedCount} / ${ETAPES.length} étapes complétées`}
              </span>
              {completedCount > 0 && (
                <button onClick={reset} style={{ fontSize: 11.5, color: "#94A3B8", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  Réinitialiser
                </button>
              )}
            </div>
            <div style={{ height: 8, background: "#E2E8F0", borderRadius: 100, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(completedCount / ETAPES.length) * 100}%`,
                background: "linear-gradient(90deg, #7C3AED, #0EA5E9)",
                borderRadius: 100,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {ETAPES.map((e, i) => {
          const isDone = mounted && completed[e.num];
          return (
            <div
              key={e.num}
              id={`etape-${e.num}`}
              style={{
                borderRadius: 20,
                border: isDone ? "1.5px solid #86EFAC" : "1px solid #E2E8F0",
                overflow: "hidden",
                boxShadow: isDone ? "0 2px 12px rgba(21,128,61,0.08)" : "0 2px 12px rgba(0,0,0,0.04)",
                transition: "border-color 0.3s, box-shadow 0.3s",
                opacity: isDone ? 0.85 : 1,
              }}
            >
              {/* Header étape */}
              <div style={{ background: isDone ? "#F0FDF4" : e.bg, padding: "22px 28px", display: "flex", alignItems: "flex-start", gap: 20, transition: "background 0.3s" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: isDone ? "#22C55E" : e.couleur,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0,
                  transition: "background 0.3s",
                }}>
                  {isDone ? "✓" : e.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{
                      fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800,
                      color: isDone ? "#15803D" : "#0F172A",
                      textDecoration: isDone ? "line-through" : "none",
                      transition: "color 0.3s",
                    }}>{e.titre}</h3>
                    <span style={{
                      padding: "4px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 600,
                      background: "rgba(0,0,0,0.06)", color: "#475569", whiteSpace: "nowrap" as const,
                    }}>
                      ⏱ {e.duree}
                    </span>
                  </div>
                  <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.7, marginTop: 6 }}>{e.desc}</p>
                </div>
              </div>

              {/* Corps */}
              <div style={{ padding: "24px 28px", background: "#fff", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
                {/* Actions */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 12 }}>
                    Ce que tu dois faire
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {e.actions.map((a, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: isDone ? "#DCFCE7" : e.bg,
                          border: `2px solid ${isDone ? "#22C55E" : e.couleur}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 1,
                        }}>
                          {isDone
                            ? <span style={{ fontSize: 10, color: "#22C55E", fontWeight: 700 }}>✓</span>
                            : <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.couleur }} />
                          }
                        </div>
                        <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{a}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bouton marquer */}
                  <button
                    onClick={() => toggle(e.num)}
                    style={{
                      marginTop: 18,
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                      border: isDone ? "1.5px solid #86EFAC" : `1.5px solid ${e.couleur}30`,
                      background: isDone ? "#F0FDF4" : `${e.couleur}08`,
                      color: isDone ? "#15803D" : e.couleur,
                      transition: "all 0.2s",
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{isDone ? "↩" : "✓"}</span>
                    {isDone ? "Marquer comme à faire" : "Marquer comme fait"}
                  </button>
                </div>

                {/* Liens */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 12 }}>
                    Ressources Data Universe
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {e.liens.map(l => (
                      <Link key={l.href} href={l.href} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 14px", borderRadius: 10,
                        background: "#F8FAFC", border: "1px solid #E2E8F0",
                        textDecoration: "none", fontSize: 13, color: "#0F172A", fontWeight: 500,
                        transition: "all 0.15s",
                      }}>
                        {l.label}
                        <span style={{ color: e.couleur, fontSize: 14, fontWeight: 700 }}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connecteur vers étape suivante */}
              {i < ETAPES.length - 1 && (
                <div style={{ textAlign: "center", padding: "4px 0 0", background: "#fff" }}>
                  <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 2, paddingBottom: 8 }}>
                    <div style={{ width: 2, height: 12, background: "#E2E8F0" }} />
                    <div style={{ fontSize: 16, color: "#CBD5E1" }}>↓</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
