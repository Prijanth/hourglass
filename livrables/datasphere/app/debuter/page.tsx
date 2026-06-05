import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Débuter en data — Parcours guidé pour entrer dans la data en 2025 | DataSphère",
  description: "Tu veux débuter dans la data ? Suis ce parcours en 5 étapes : bases SQL et Python, certifications pour débutants, premiers projets et ressources gratuites recommandées par des praticiens.",
};

const ETAPES = [
  {
    num: "01",
    titre: "Comprendre les métiers de la data",
    duree: "1 semaine",
    desc: "Avant d'apprendre quoi que ce soit, il faut savoir vers quel métier tu te diriges. Data Analyst, Data Engineer, Data Scientist, ML Engineer : chaque rôle a des compétences différentes.",
    actions: [
      "Lire les fiches métiers DataSphère pour comprendre les différences",
      "Identifier le rôle qui correspond à ton profil et tes objectifs",
      "Regarder les salaires et les compétences requises pour chaque poste",
    ],
    liens: [
      { label: "Fiche Data Analyst", href: "/metiers/data-analyst" },
      { label: "Fiche Data Engineer", href: "/metiers/data-engineer" },
      { label: "Fiche Data Scientist", href: "/metiers/data-scientist" },
      { label: "Tous les métiers data", href: "/metiers" },
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
      "Suivre un cours SQL débutant (SQLZoo ou Mode Analytics sont gratuits)",
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
    desc: "Python est le langage standard de la data. Les bases suffisent pour commencer : manipulation de données avec Pandas, visualisation avec Matplotlib, et quelques notions de scripting.",
    actions: [
      "Suivre Python for Everybody (Coursera, gratuit en audit)",
      "Pratiquer avec des datasets publics sur Kaggle (compétitions débutants)",
      "Apprendre Pandas : pd.read_csv, groupby, merge — les 20 fonctions essentielles",
    ],
    liens: [
      { label: "Glossaire : Pandas", href: "/glossaire?q=pandas" },
      { label: "Glossaire : Python", href: "/glossaire?q=python" },
      { label: "Outil : Polars (alternative rapide)", href: "/outils/polars" },
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

const FAQ = [
  {
    q: "Faut-il être matheux pour travailler dans la data ?",
    r: "Pour un poste de Data Analyst ou Data Engineer, non. Les maths de lycée suffisent. Pour Data Scientist ou ML Engineer, un niveau Bac+3 en statistiques est utile mais pas bloquant : beaucoup de Data Scientists ont appris les stats sur le tas. Commence par les métiers moins math-intensifs si tu pars de zéro.",
  },
  {
    q: "Combien de temps pour trouver un premier poste ?",
    r: "De 6 à 18 mois selon ton profil de départ. Quelqu'un qui part d'un profil analytique (finance, marketing, RH) peut viser Data Analyst en 6 mois. Une reconversion complète depuis un profil non technique prend plutôt 12-18 mois. La clé : combiner formation + certif + projet réel.",
  },
  {
    q: "Faut-il faire un master pour entrer dans la data ?",
    r: "Non. Les certifications cloud (AWS, GCP, Azure) sont reconnues par les recruteurs. Un portfolio avec 2-3 projets bien documentés compensera l'absence de diplôme dans la majorité des recrutements en PME et scale-ups. En grands groupes et cabinets, un Bac+5 est souvent attendu pour les postes seniors.",
  },
  {
    q: "Par quel outil commencer : Python ou SQL ?",
    r: "SQL en premier, sans hésiter. Il s'apprend plus vite, s'utilise dans tous les métiers data, et te permettra d'être opérationnel rapidement. Python arrive ensuite naturellement. Les deux sont indispensables à terme.",
  },
];

export default function DebuterPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "80px 24px 72px",
        borderBottom: "1px solid #E2E8F0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.08)", top: -140, right: -100, filter: "blur(80px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 100,
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
            fontSize: 11, fontWeight: 700, color: "#7C3AED",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 22,
          }}>
            🚀 Parcours débutant
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800, color: "#0F172A",
            lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: 20,
          }}>
            Débuter dans la data{" "}
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              en 2025
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, maxWidth: 640, marginBottom: 36 }}>
            Tu veux entrer dans la data mais tu ne sais pas par où commencer ? Ce parcours en 5 étapes te donne une feuille de route concrète, testée et validée par des praticiens.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#etape-01" style={{
              padding: "12px 24px", borderRadius: 10,
              background: "#7C3AED", color: "#fff",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "var(--font-display)",
            }}>
              Commencer le parcours →
            </a>
            <Link href="/metiers" style={{
              padding: "12px 24px", borderRadius: 10,
              border: "1.5px solid #E2E8F0", color: "#64748B",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}>
              Explorer les métiers
            </Link>
          </div>

          {/* Indicateurs */}
          <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid #DDD6FE", flexWrap: "wrap" }}>
            {[
              { n: "5", l: "étapes claires" },
              { n: "3-6", l: "mois pour être employable" },
              { n: "100%", l: "gratuit à suivre" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#7C3AED", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parcours en 5 étapes */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Le parcours</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
            5 étapes pour entrer dans la data
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {ETAPES.map((e, i) => (
            <div
              key={e.num}
              id={`etape-${e.num}`}
              style={{
                borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {/* Header étape */}
              <div style={{ background: e.bg, padding: "22px 28px", display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: e.couleur,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#fff", flexShrink: 0,
                }}>
                  {e.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>{e.titre}</h3>
                    <span style={{
                      padding: "4px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 600,
                      background: "rgba(0,0,0,0.06)", color: "#475569", whiteSpace: "nowrap",
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
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 12 }}>
                    Ce que tu dois faire
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {e.actions.map((a, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%",
                          background: e.bg, border: `2px solid ${e.couleur}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginTop: 1,
                        }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: e.couleur }} />
                        </div>
                        <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Liens */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 12 }}>
                    Ressources DataSphère
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
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Questions fréquentes</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Ce que tout débutant se demande
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FAQ.map(({ q, r }) => (
              <div key={q} style={{ padding: "24px 26px", borderRadius: 16, background: "#fff", border: "1px solid #E2E8F0" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{q}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
          Quelle est ta prochaine étape ?
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 28px" }}>
          Tu as le parcours. Choisis maintenant le métier qui te correspond — et découvre exactement quelles compétences et certifications te mèneront là-bas.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/metiers/data-analyst" style={{
            padding: "12px 28px", borderRadius: 10,
            background: "#7C3AED", color: "#fff",
            fontSize: 14, fontWeight: 700, textDecoration: "none",
            fontFamily: "var(--font-display)",
          }}>
            Je veux devenir Data Analyst →
          </Link>
          <Link href="/metiers" style={{
            padding: "12px 28px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", color: "#64748B",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            Explorer tous les métiers →
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 20 }}>
          Tu peux aussi <Link href="/newsletter" style={{ color: "var(--indigo)", fontWeight: 600 }}>t&apos;abonner à la newsletter</Link> pour suivre les ressources data chaque semaine.
        </p>
      </section>
    </main>
  );
}
