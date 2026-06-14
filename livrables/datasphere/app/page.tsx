import Link from "next/link";
import articles from "@/content/articles.json";
import metiers from "@/content/metiers.json";
import { SkillsChart } from "@/components/charts/skills-chart";
import { TrendsChart } from "@/components/charts/trends-chart";
import { fmtDate } from "@/lib/date-utils";

const CAT_COLORS: Record<string, string> = {
  indigo: "badge-indigo", teal: "badge-teal", amber: "badge-amber", rose: "badge-rose",
};

const SECTIONS = [
  { href: "/ia",             emoji: "🧠", title: "Intelligence IA", desc: "Modèles, risques, AI Act, enjeux — tout sur l'IA en français",  color: "#BE123C", bg: "#FFF1F2" },
  { href: "/concepts",       emoji: "📚", title: "Encyclopédie",   desc: "134 concepts ML, Cloud et Gouvernance expliqués simplement",   color: "#7C3AED", bg: "#EDE9FE" },
  { href: "/certifications", emoji: "🎓", title: "Certifications", desc: "166 certifications AWS, Azure, GCP, Databricks, Snowflake",   color: "#5B21B6", bg: "#F5F3FF" },
  { href: "/cas-usage",      emoji: "💼", title: "Cas d'usage",    desc: "104 projets réels avec stack, solution et résultats mesurés", color: "#C2410C", bg: "#FFF7ED" },
  { href: "/glossaire",      emoji: "📖", title: "Glossaire",      desc: "246 définitions précises avec exemples concrets",              color: "#0E7490", bg: "#ECFEFF" },
  { href: "/outils",         emoji: "🛠️", title: "Outils",         desc: "Comparatifs honnêtes des plateformes data du marché",          color: "#B45309", bg: "#FFFBEB" },
  { href: "/comparateur",   emoji: "⚖️", title: "Comparateur",    desc: "Compare jusqu'à 3 outils côte à côte en temps réel",           color: "#7C3AED", bg: "#EDE9FE" },
  { href: "/metiers",        emoji: "👤", title: "Métiers",        desc: "Salaires 2026, compétences requises et trajectoires",          color: "#BE123C", bg: "#FFF1F2" },
  { href: "/toolbox",        emoji: "🛠️", title: "Toolbox",        desc: "Snippets, checklists, tips par rôle et ressources d'apprentissage", color: "#15803D", bg: "#F0FDF4" },
  { href: "/communaute",     emoji: "💬", title: "Communauté",     desc: "Questions, réponses et retours d'expérience entre data pros",  color: "#7C3AED", bg: "#EDE9FE" },
  { href: "/formations",     emoji: "🎯", title: "Formations",     desc: "Les meilleures ressources pour progresser, triées par niveau", color: "#0E7490", bg: "#ECFEFF" },
];

export default function Home() {
  const featured = articles.filter(a => a.featured).slice(0, 2);
  const recent   = articles.filter(a => !a.featured).slice(0, 4);

  return (
    <>
      {/* ── HERO — fond lavande clair ─────────────────── */}
      <section className="hero-section" style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "52px 24px 52px",
        position: "relative",
        overflow: "hidden",
        display: "flex", alignItems: "flex-start",
      }}>
        {/* Orbs lumineux (soft) */}
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(124,58,237,0.1)", top: -160, right: -100 }} />
        <div className="orb" style={{ width: 420, height: 420, background: "rgba(14,165,233,0.07)", bottom: -120, left: "8%", animationDelay: "6s" }} />
        <div className="orb" style={{ width: 280, height: 280, background: "rgba(124,58,237,0.07)", top: "30%", left: "15%", animationDelay: "12s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", width: "100%", position: "relative" }}>
          <div className="hero-grid">
            {/* Texte */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px", borderRadius: 100,
                background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
                marginBottom: 24,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7C3AED", display: "inline-block", animation: "pulse-glow 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" }}>Hub data &amp; IA francophone</span>
              </div>

              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.8rem, 5.5vw, 5.5rem)",
                fontWeight: 800, color: "#0F172A",
                lineHeight: 1.05, letterSpacing: "-0.04em",
                marginBottom: 20,
              }}>
                La référence data &amp; IA<br />
                <span className="text-gradient">en français.</span>
              </h1>

              <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.75, marginBottom: 36, maxWidth: 500 }}>
                Encyclopédie, certifications, cas d&apos;usage, glossaire et communauté. Que tu démarres de zéro ou que tu sois praticien confirmé, DataSphère couvre toute la data en français.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/debuter" className="btn-primary">
                  🚀 Commencer le parcours débutant
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                </Link>
                <Link href="/concepts" className="btn-secondary">
                  Explorer l&apos;encyclopédie →
                </Link>
                <Link href="/certifications" style={{ padding: "12px 20px", borderRadius: 10, border: "1.5px solid #E2E8F0", color: "#64748B", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  Certifications →
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 36, marginTop: 48, paddingTop: 36, borderTop: "1px solid #DDD6FE" }}>
                {[
                  { n: "166",  l: "certifications" },
                  { n: "134",  l: "concepts" },
                  { n: "104",  l: "cas d'usage" },
                  { n: "246",  l: "termes" },
                ].map(({ n, l }) => (
                  <div key={l}>
                    <div className="stat-num" style={{ fontSize: "1.8rem" }}>{n}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats visuelles unifiées */}
            <div style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              borderRadius: 20,
              padding: "26px 24px",
              boxShadow: "0 4px 32px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            }}>

              {/* Header */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--indigo)", marginBottom: 5 }}>
                  Ce que contient DataSphère
                </p>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.5 }}>
                  Toute la data &amp; l&apos;IA en français, au même endroit.
                </p>
              </div>

              {/* Grille 2×3 — chaque cellule est un lien */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderRadius: 14, overflow: "hidden", border: "1px solid #F1F5F9", marginBottom: 18 }}>
                {[
                  { n: "166",  l: "certifications", emoji: "🎓", href: "/certifications", color: "#7C3AED" },
                  { n: "134",  l: "concepts",        emoji: "🧠", href: "/concepts",       color: "#0891B2" },
                  { n: "88",   l: "outils",          emoji: "🛠️", href: "/outils",         color: "#B45309" },
                  { n: "47",   l: "agents IA",       emoji: "🤖", href: "/agents",         color: "#6D28D9" },
                  { n: "246",  l: "termes",          emoji: "📖", href: "/glossaire",      color: "#0F766E" },
                  { n: "104",  l: "cas d'usage",     emoji: "💼", href: "/cas-usage",      color: "#C2410C" },
                ].map((s, i) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="stat-cell"
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "16px 18px",
                      borderBottom: i < 4 ? "1px solid #F1F5F9" : "none",
                      borderRight: i % 2 === 0 ? "1px solid #F1F5F9" : "none",
                      textDecoration: "none",
                    }}
                  >
                    <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{s.emoji}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {s.n}
                      </div>
                      <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }}>
                        {s.l}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* CTA principal */}
              <Link href="/actualites" className="btn-primary" style={{ display: "flex", justifyContent: "center", padding: "11px", fontSize: 13.5, borderRadius: 12 }}>
                Dernières actualités data &amp; IA →
              </Link>

              {/* Pulse marché */}
              <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#7C3AED", animation: "pulse-glow 2s ease-in-out infinite", flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.4 }}>
                  Mis à jour chaque matin · 2 400 pros abonnés
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────── */}
      <div style={{ background: "#FAFBFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", padding: "10px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex" }}>
              {["Machine Learning", "Data Engineering", "LLM et IA Générative", "Cloud AWS", "Cloud Azure", "Cloud GCP", "Data Gouvernance", "Databricks", "Apache Spark", "Analytics Engineering", "Snowflake", "MLOps", "NLP", "Feature Engineering"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 18, padding: "0 24px", borderRight: "1px solid #F1F5F9" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#A78BFA", display: "inline-block", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA DOUBLES — DÉBUTANT + RECRUTEUR ───────────── */}
      <section style={{ padding: "52px 24px", background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }} className="cta-grid">
          {/* Débutant */}
          <div style={{
            borderRadius: 20, padding: "32px 36px",
            background: "linear-gradient(135deg, #EDE9FE 0%, #F0F9FF 100%)",
            border: "1px solid #DDD6FE",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.12)", width: "fit-content" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" }}>🚀 Nouveau dans la data</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>
              Tu veux te lancer dans la data ?
            </p>
            <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.7 }}>
              Parcours guidé en 5 étapes : de zéro à employable en 3 à 6 mois. SQL, Python, première certification, premier projet.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/debuter" style={{
                padding: "10px 22px", borderRadius: 10,
                background: "#7C3AED", color: "#fff",
                fontSize: 13.5, fontWeight: 700, textDecoration: "none",
                fontFamily: "var(--font-display)",
              }}>
                Commencer le parcours →
              </Link>
              <Link href="/metiers" style={{
                padding: "10px 18px", borderRadius: 10,
                border: "1.5px solid #DDD6FE", color: "#5B21B6",
                fontSize: 13.5, fontWeight: 600, textDecoration: "none",
              }}>
                Explorer les métiers
              </Link>
            </div>
          </div>

          {/* Recruteur */}
          <div style={{
            borderRadius: 20, padding: "32px 36px",
            background: "linear-gradient(135deg, #0B0F29 0%, #0F1B35 100%)",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "rgba(255,255,255,0.08)", width: "fit-content" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>💼 Recruteurs</span>
            </div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2vw, 1.7rem)", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Tu recrutes des profils data ?
            </p>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.7 }}>
              Publie ton offre gratuitement et touche 2 400 data professionnels francophones — Data Engineers, Data Scientists, Analytics Engineers.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/jobs/deposer" style={{
                padding: "10px 22px", borderRadius: 10,
                background: "#7C3AED", color: "#fff",
                fontSize: 13.5, fontWeight: 700, textDecoration: "none",
                fontFamily: "var(--font-display)",
              }}>
                Publier une offre →
              </Link>
              <Link href="/jobs" style={{
                padding: "10px 18px", borderRadius: 10,
                border: "1.5px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)",
                fontSize: 13.5, fontWeight: 600, textDecoration: "none",
              }}>
                Voir le job board
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTIONS EXPLORER ─────────────────────────────── */}
      <section style={{ padding: "72px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Explorer DataSphère</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 800, color: "#0F172A" }}>
              Tout ce dont tu as besoin pour progresser en data
            </h2>
          </div>
          <div className="sections-grid">
            {SECTIONS.map(({ href, emoji, title, desc, color, bg }) => (
              <Link key={href} href={href} className="card" style={{ padding: 22, display: "block" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 }}>
                  {emoji}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, marginBottom: 6, color }}>{title}</h3>
                <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ARTICLES ─────────────────────────────── */}
      <section style={{ padding: "72px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <span className="section-label">Actualités</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A" }}>Articles à la une</h2>
            </div>
            <Link href="/actualites" style={{ fontSize: 13, fontWeight: 600, color: "var(--indigo)", display: "flex", alignItems: "center", gap: 4 }}>
              Tout voir →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {featured.map(a => (
              <Link key={a.slug} href={`/actualites/${a.slug}`} className="card-elevated" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className={`badge ${CAT_COLORS[a.categoryColor] ?? "badge-neutral"}`}>{a.category}</span>
                  <span style={{ fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>{a.readTime}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, lineHeight: 1.3, color: "#0F172A" }}>{a.title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7, flex: 1 }}>{a.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: 14 }}>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{fmtDate(a.date, true)}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)" }}>Lire →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS + RECENT ───────────────────────────────── */}
      <section style={{ padding: "72px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 24 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card" style={{ padding: "28px 26px" }}>
              <span className="section-label">Marché data 2026</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, marginBottom: 4, color: "#0F172A" }}>Compétences les plus demandées</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>D&apos;après dbt Labs State of Data Engineering 2025, 365 Data Science et Dataquest — tendances marché France</p>
              <SkillsChart />
            </div>
            <div className="card" style={{ padding: "28px 26px" }}>
              <span className="section-label">Tendances</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, marginBottom: 4, color: "#0F172A" }}>Évolution des technologies data</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Progression relative sur les offres d&apos;emploi data — Jan 2024 → Avr 2025</p>
              <TrendsChart />
            </div>
          </div>

          <div className="card" style={{ padding: "28px 26px", display: "flex", flexDirection: "column" }}>
            <span className="section-label">Fil d&apos;actualité</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 800, marginBottom: 20, color: "#0F172A" }}>Derniers articles</h2>
            <div style={{ flex: 1 }}>
              {recent.map((a, i) => (
                <Link key={a.slug} href={`/actualites/${a.slug}`} className="article-row" style={{ display: "flex", flexDirection: "column", gap: 5, padding: "13px 0", borderBottom: i < recent.length - 1 ? "1px solid #E2E8F0" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className={`badge ${CAT_COLORS[a.categoryColor] ?? "badge-neutral"}`}>{a.category}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>{fmtDate(a.date, true)}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "#0F172A" }}>{a.title}</p>
                </Link>
              ))}
            </div>
            <Link href="/actualites" style={{ marginTop: 16, textAlign: "center", display: "block", padding: "10px", background: "#EDE9FE", color: "var(--indigo)", fontSize: 13.5, fontWeight: 700, borderRadius: "var(--r-md)" }}>
              Voir tous les articles →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SALAIRES — fond clair ──────────────────────────── */}
      <section style={{ background: "#F8FAFC", padding: "72px 24px", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <span className="section-label">Marché de l&apos;emploi</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)", fontWeight: 800, color: "#0F172A" }}>
                Salaires data en France <span style={{ color: "var(--indigo)" }}>2026</span>
              </h2>
            </div>
            <Link href="/metiers" style={{ fontSize: 13, fontWeight: 600, color: "#64748B" }}>Fiches complètes →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {metiers.slice(0, 6).map(m => (
              <Link key={m.slug} href={`/metiers/${m.slug}`} className="card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#0F172A", marginBottom: 3 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{m.category}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--indigo)" }}>{m.salaryMin}-{m.salaryMax}k€</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em" }}>brut/an</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA NEWSLETTER ────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <span className="badge badge-indigo" style={{ marginBottom: 18 }}>Newsletter gratuite</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, marginBottom: 14, lineHeight: 1.2, color: "#0F172A" }}>
            La data &amp; l&apos;IA,<br />chaque semaine en <span style={{ color: "var(--indigo)" }}>français</span>
          </h2>
          <p style={{ fontSize: 16, color: "#64748B", marginBottom: 28, lineHeight: 1.7 }}>
            Actualités filtrées, concepts expliqués, nouvelles certifications. 2 400 pros abonnés.
          </p>
          <Link href="/newsletter" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>
            S&apos;abonner gratuitement →
          </Link>
          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 14 }}>100% gratuit · Désabonnement en 1 clic</p>
        </div>
      </section>
    </>
  );
}
