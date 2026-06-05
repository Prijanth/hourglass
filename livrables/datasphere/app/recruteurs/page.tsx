import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recruteurs — Publiez votre offre data auprès de 2 400 pros | DataSphère",
  description: "Touchez 2 400 professionnels de la data francophones : Data Engineers, Data Scientists, Analytics Engineers. Publication gratuite, audience qualifiée, modération sous 24h.",
};

const PROFILS = [
  { emoji: "⚙️", titre: "Data Engineer",          desc: "Pipelines, ingestion, transformation, cloud" },
  { emoji: "🧪", titre: "Data Scientist",          desc: "ML, statistiques, modélisation prédictive" },
  { emoji: "📐", titre: "Analytics Engineer",      desc: "dbt, SQL avancé, semantic layer, BI" },
  { emoji: "🤖", titre: "ML / AI Engineer",        desc: "Déploiement de modèles, MLOps, LLMs" },
  { emoji: "📊", titre: "Data Analyst",             desc: "Reporting, dashboards, Power BI, Tableau" },
  { emoji: "🏛️", titre: "Data Architect / CDO",   desc: "Gouvernance, architecture data, stratégie" },
];

const PROCESS = [
  { n: "01", titre: "Déposez votre offre",     desc: "Remplissez le formulaire en 3 minutes : poste, stack technique, remote, fourchette salariale." },
  { n: "02", titre: "Modération sous 24h",     desc: "Chaque offre est relue manuellement pour garantir la pertinence et la qualité pour l'audience." },
  { n: "03", titre: "Publication et diffusion", desc: "L'offre est publiée sur le job board DataSphère et mentionnée dans la newsletter selon la date d'envoi." },
  { n: "04", titre: "Candidatures directes",   desc: "Les candidats vous contactent directement. Pas d'intermédiaire, pas de frais cachés." },
];

const FAQ = [
  { q: "Combien coûte la publication ?", r: "La publication est gratuite. L'audience est qualifiée — des praticiens data actifs, pas des étudiants en recherche de stage. Si le modèle évolue vers un format premium à l'avenir, les offres existantes restent gratuites." },
  { q: "Quelle est la durée de publication ?", r: "Les offres sont publiées pour 30 jours renouvelables. Après expiration, l'offre est retirée automatiquement pour maintenir la fraîcheur du job board." },
  { q: "Qui constitue l'audience ?", r: "2 400+ abonnés newsletter (juin 2026), majoritairement des Data Engineers, Analytics Engineers et Data Scientists en France. Profils mid-senior, actifs sur le marché ou en veille." },
  { q: "Puis-je cibler un type de profil spécifique ?", r: "Oui. Le formulaire permet de préciser le profil exact, le niveau d'expérience et la stack technique. L'offre sera catégorisée et filtrée côté candidat." },
];

export default function RecruteursPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #0B0F29 0%, #0F1B35 60%, #1A0B3B 100%)",
        padding: "80px 24px 72px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.2)",
      }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.12)", top: -140, right: -100, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(14,165,233,0.08)", bottom: -80, left: "10%", filter: "blur(60px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 100,
            background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 11, fontWeight: 700, color: "#A78BFA",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 22,
          }}>
            💼 Espace recruteurs
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800, color: "#fff",
            lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: 20,
          }}>
            Recrutez des profils data{" "}
            <span style={{ background: "linear-gradient(90deg, #A78BFA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              qualifiés en France
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.8, maxWidth: 640, marginBottom: 36 }}>
            Publiez votre offre et touchez 2 400 professionnels de la data francophones actifs : Data Engineers, Data Scientists, Analytics Engineers, ML Engineers.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/jobs/deposer" style={{
              padding: "14px 28px", borderRadius: 10,
              background: "#7C3AED", color: "#fff",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              fontFamily: "var(--font-display)",
            }}>
              Déposer une offre gratuitement →
            </Link>
            <Link href="/jobs" style={{
              padding: "14px 24px", borderRadius: 10,
              border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}>
              Voir le job board
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 40, marginTop: 52, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>
            {[
              { n: "2 400+", l: "professionnels abonnés" },
              { n: "Gratuit", l: "publication d'offre" },
              { n: "24h",    l: "délai de modération" },
              { n: "30j",    l: "durée de publication" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#A78BFA", lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Profils */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>L'audience</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
            Les profils que vous trouverez sur DataSphère
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", maxWidth: 560, margin: "12px auto 0", lineHeight: 1.7 }}>
            Des praticiens actifs en France, majoritairement mid-senior (3 à 8 ans d&apos;expérience), en veille ou en recherche active.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {PROFILS.map(({ emoji, titre, desc }) => (
            <div key={titre} style={{
              padding: "22px 24px", borderRadius: 16,
              border: "1px solid #E2E8F0", background: "#FAFBFF",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ fontSize: 28, flexShrink: 0 }}>{emoji}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{titre}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Comment ça marche</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Publiez en 3 minutes, recrutez en direct
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {PROCESS.map(({ n, titre, desc }) => (
              <div key={n} style={{ textAlign: "center", padding: "28px 20px" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, background: "#7C3AED",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#fff",
                  margin: "0 auto 16px",
                }}>
                  {n}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{titre}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA principal */}
      <section style={{ maxWidth: 740, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <div style={{
          padding: "48px 40px", borderRadius: 24,
          background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)",
          border: "1px solid #DDD6FE",
        }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
            Prêt à recruter votre prochain data profil ?
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.75, maxWidth: 480, margin: "0 auto 28px" }}>
            Publication gratuite. Audience qualifiée. Pas d&apos;intermédiaire.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/jobs/deposer" style={{
              padding: "13px 28px", borderRadius: 10,
              background: "#7C3AED", color: "#fff",
              fontSize: 14, fontWeight: 700, textDecoration: "none",
              fontFamily: "var(--font-display)",
            }}>
              Déposer une offre →
            </Link>
            <Link href="/jobs" style={{
              padding: "13px 24px", borderRadius: 10,
              border: "1.5px solid #DDD6FE", color: "#5B21B6",
              fontSize: 14, fontWeight: 600, textDecoration: "none",
            }}>
              Voir le job board
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Questions fréquentes</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Tout ce que vous devez savoir
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {FAQ.map(({ q, r }) => (
              <div key={q} style={{ padding: "24px 26px", borderRadius: 16, background: "#fff", border: "1px solid #E2E8F0" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{q}</h3>
                <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
