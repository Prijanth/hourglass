import type { Metadata } from "next";
import Link from "next/link";
import { ParcoursEtapes } from "./parcours";
import { Bifurcation } from "./bifurcation";

export const metadata: Metadata = {
  title: "Débuter en data — Parcours guidé pour entrer dans la data en 2026 | Data Universe",
  description: "Tu veux débuter dans la data ? Suis ce parcours en 5 étapes : bases SQL et Python, certifications pour débutants, premiers projets et ressources gratuites recommandées par des praticiens.",
};


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
  {
    q: "Mon profil commerce ou non-technique est-il un handicap ?",
    r: "Non, surtout pour Data Analyst et Product Owner Data. Beaucoup d'entreprises cherchent des profils qui combinent compréhension métier et maîtrise des données — c'est exactement ce que tu apportes. Commence par SQL et Power BI, qui se maîtrisent en quelques semaines, et tu seras opérationnel rapidement. Le bagage technique se construit en poste.",
  },
  {
    q: "Quelle certification choisir selon le métier que je vise ?",
    r: "Data Analyst → Google Data Analytics Certificate (orienté SQL, Sheets, Tableau, accessible sans prérequis, ~180h). Data Engineer → AWS Data Engineer Associate (cloud AWS, pipelines, plus technique). Data Scientist → AWS ML Specialty ou Google Professional ML Engineer (statistiques et Python requis). Cloud Practitioner (AWS) ou Cloud Digital Leader (Google) sont de bons points de départ cloud pour n'importe quel métier.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ.map(({ q, r }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": r },
  })),
};

export default function DebuterPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
              en 2026
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
              { n: "6-18", l: "mois pour être employable*" },
              { n: "100%", l: "gratuit à suivre" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#7C3AED", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 12 }}>
            * 6 mois depuis un profil analytique (finance, marketing, RH) vers Data Analyst. 12-18 mois pour une reconversion complète depuis un profil non-technique. Les examens de certification sont payants (50-300€).
          </p>
        </div>
      </section>

      {/* ── ORIENTATION PAR PROFIL ─────────────────────── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px 0" }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Trouve ton point de départ</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 20 }}>
            Ce parcours est-il fait pour toi ?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {[
              {
                emoji: "🎓", color: "#0E7490", bg: "#ECFEFF",
                title: "Tu viens de commerce ou d'un domaine non-tech",
                desc: "Data Analyst ou Product Owner Data sont tes portes d'entrée naturelles. SQL + Power BI suffisent pour commencer.",
                cta: "Voir Data Analyst", href: "/metiers/data-analyst",
              },
              {
                emoji: "💻", color: "#7C3AED", bg: "#EDE9FE",
                title: "Tu as un background technique (info, ingé, maths)",
                desc: "Data Engineer, Data Scientist ou AI Engineer sont accessibles en sortie d'école avec Python et les bonnes certifications.",
                cta: "Voir Data Engineer", href: "/metiers/data-engineer",
              },
              {
                emoji: "📈", color: "#15803D", bg: "#F0FDF4",
                title: "Tu es déjà en poste data et tu veux progresser",
                desc: "Ce parcours est orienté débutants. Explore plutôt les fiches métiers seniors et les certifications avancées.",
                cta: "Voir les métiers seniors", href: "/metiers",
              },
            ].map(p => (
              <div key={p.title} style={{ background: p.bg, border: `1px solid ${p.color}22`, borderRadius: 14, padding: "18px 20px" }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{p.emoji}</div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: p.color, marginBottom: 6, lineHeight: 1.4 }}>{p.title}</p>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
                <a href={p.href} style={{ fontSize: 12.5, fontWeight: 700, color: p.color, textDecoration: "none" }}>{p.cta} →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BIFURCATION — Par où commencer ? ──────────────── */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ marginBottom: 36 }}>
          <span
            className="section-label"
            style={{
              display: "block",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "var(--indigo)",
              marginBottom: 8,
            }}
          >
            Par où commencer ?
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 6,
            }}
          >
            Quel est ton point de départ ?
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 520 }}>
            Clique sur ta situation pour voir un plan personnalisé.
          </p>
        </div>
        <Bifurcation />
      </section>

      <ParcoursEtapes />

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
            padding: "12px 22px", borderRadius: 10,
            background: "#7C3AED", color: "#fff",
            fontSize: 13.5, fontWeight: 700, textDecoration: "none",
            fontFamily: "var(--font-display)",
          }}>
            Je viens de commerce → Data Analyst
          </Link>
          <Link href="/metiers/data-engineer" style={{
            padding: "12px 22px", borderRadius: 10,
            background: "#0E7490", color: "#fff",
            fontSize: 13.5, fontWeight: 700, textDecoration: "none",
            fontFamily: "var(--font-display)",
          }}>
            J&apos;ai un background tech → Data Engineer
          </Link>
          <Link href="/metiers" style={{
            padding: "12px 22px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", color: "#64748B",
            fontSize: 13.5, fontWeight: 600, textDecoration: "none",
          }}>
            Je veux comparer tous les métiers →
          </Link>
        </div>
        <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 20 }}>
          Tu peux aussi <Link href="/newsletter" style={{ color: "var(--indigo)", fontWeight: 600 }}>t&apos;abonner à la newsletter</Link> pour suivre les ressources data chaque semaine.
        </p>
      </section>
    </main>
  );
}
