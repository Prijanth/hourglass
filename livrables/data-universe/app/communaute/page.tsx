import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Communauté Data Universe — Le hub data francophone",
  description: "La communauté Data Universe pour les professionnels de la data en France. Questions, retours d'expérience, partage de ressources.",
};

const THEMES = [
  { emoji: "⚙️", label: "Data Engineering",   desc: "Pipelines, orchestration, lakehouse" },
  { emoji: "🤖", label: "IA & LLMs",           desc: "RAG, agents, fine-tuning, évaluation" },
  { emoji: "☁️", label: "Cloud & Infra",       desc: "AWS, Azure, GCP, architecture data" },
  { emoji: "📊", label: "Analytics & BI",      desc: "Power BI, Tableau, dbt, SQL avancé" },
  { emoji: "💼", label: "Carrière & Salaires", desc: "Certifications, reconversion, négociation" },
  { emoji: "🏛️", label: "Gouvernance & RGPD",  desc: "AI Act, taxonomie ESG, Pilier 3" },
];

const FACONS = [
  {
    emoji: "📬",
    titre: "Newsletter hebdomadaire",
    desc: "Reçois chaque semaine les actualités data, les nouvelles certifications, les retours d'expérience et les opportunités d'emploi. Gratuit, en français.",
    cta: "S'abonner gratuitement",
    href: "/newsletter",
    color: "#7C3AED",
    bg: "#F5F3FF",
    border: "#DDD6FE",
  },
  {
    emoji: "💬",
    titre: "Discord — bientôt",
    desc: "Un serveur Discord pour poser tes questions en temps réel, partager tes projets et te connecter avec d'autres data professionals francophones.",
    cta: "Être notifié à l'ouverture",
    href: "/newsletter",
    color: "#5865F2",
    bg: "#EEF0FF",
    border: "#C5C8FF",
  },
  {
    emoji: "🤝",
    titre: "Contribuer au contenu",
    desc: "Tu travailles en data et tu veux partager ton expertise ? Propose un cas d'usage, un comparatif ou un retour d'expérience via la newsletter.",
    cta: "Proposer une contribution",
    href: "/newsletter",
    color: "#0E7490",
    bg: "#ECFEFF",
    border: "#A5F3FC",
  },
];

export default function CommunautePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #0B0F29 0%, #0F1B35 100%)",
        padding: "80px 24px 72px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(124,58,237,0.12)", top: -150, right: -80, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(88,101,242,0.08)", bottom: -80, left: "20%", filter: "blur(60px)" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "5px 14px", borderRadius: 100,
            background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)",
            fontSize: 11, fontWeight: 700, color: "#A78BFA",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 24,
          }}>
            💬 Communauté data francophone
          </span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800, color: "#FFFFFF",
            lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20,
          }}>
            La communauté data<br />
            <span style={{ background: "linear-gradient(90deg, #A78BFA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              en français
            </span>
          </h1>

          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, maxWidth: 580, margin: "0 auto 36px" }}>
            La communauté Data Universe est en cours de construction. En attendant le lancement du Discord et du forum, rejoins la newsletter pour rester connecté.
          </p>

          <Link href="/newsletter" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>
            Rejoindre la newsletter →
          </Link>
        </div>
      </section>

      {/* Thèmes de discussion */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Sujets couverts</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A" }}>
            De quoi parle-t-on ?
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", marginTop: 8, maxWidth: 480, margin: "8px auto 0" }}>
            La communauté couvrira l'ensemble de l'écosystème data & IA — du débutant au praticien senior.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {THEMES.map(t => (
            <div key={t.label} className="card" style={{ padding: "20px 22px", display: "flex", alignItems: "flex-start", gap: 14 }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{t.emoji}</span>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{t.label}</p>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comment participer */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Comment participer</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A" }}>
            Rejoins la communauté dès maintenant
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {FACONS.map(f => (
            <div key={f.titre} style={{ background: f.bg, border: `1.5px solid ${f.border}`, borderRadius: 18, padding: "28px 26px", display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 32, marginBottom: 14 }}>{f.emoji}</span>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 800, color: f.color, marginBottom: 10 }}>{f.titre}</h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, flex: 1, marginBottom: 20 }}>{f.desc}</p>
              <Link href={f.href} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                background: f.color, color: "#fff", textDecoration: "none",
                fontFamily: "var(--font-display)", width: "fit-content",
              }}>
                {f.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Tu veux contribuer au site ?
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 24 }}>
            Cas d&apos;usage, retour d&apos;expérience, comparatif, agent IA — si tu travailles en data et que tu veux partager ton expertise, contacte-nous via la newsletter.
          </p>
          <Link href="/newsletter" className="btn-primary">
            Rejoindre et contribuer →
          </Link>
        </div>
      </section>
    </main>
  );
}
