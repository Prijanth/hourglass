import type { Metadata } from "next";
import Link from "next/link";
import certData from "@/content/certifications.json";
import conceptsData from "@/content/concepts.json";
import glossaireData from "@/content/glossaire.json";
import casData from "@/content/cas-usage.json";

export const metadata: Metadata = {
  title: "À propos de Data Universe — La référence data & IA en français",
  description: "Data Universe est le hub francophone de référence pour les professionnels de la data et de l'IA en France. Encyclopédie, certifications, glossaire, métiers et communauté.",
};

const STATS = [
  { n: String(glossaireData.length),              l: "termes dans le glossaire" },
  { n: String(certData.certifications.length),    l: "certifications référencées" },
  { n: String(conceptsData.concepts.length),      l: "concepts expliqués" },
  { n: "2 400+",                                  l: "abonnés newsletter (juin 2026)" },
];

const VALEURS = [
  {
    emoji: "🇫🇷",
    titre: "En français, vraiment",
    desc: "Pas une traduction automatique. Chaque définition, chaque cas d'usage, chaque comparatif est rédigé en français par des praticiens qui exercent en France.",
  },
  {
    emoji: "✅",
    titre: "Honnêteté avant tout",
    desc: "Pas de contenu sponsorisé déguisé. Les comparatifs sont objectifs, les limites sont nommées. Quand un outil est cher ou complexe, on le dit.",
  },
  {
    emoji: "⚡",
    titre: "Pour les praticiens",
    desc: "Data Universe est construit par des gens qui travaillent en data au quotidien. Pas de théorie pure : chaque concept est ancré dans la pratique réelle des équipes en France.",
  },
  {
    emoji: "🔓",
    titre: "100% gratuit",
    desc: "L'encyclopédie, le glossaire, les fiches métiers, les comparatifs — tout est accessible librement, sans compte et sans abonnement payant.",
  },
];

const SECTIONS = [
  { href: "/concepts",       emoji: "📚", titre: "Encyclopédie",         desc: `${conceptsData.concepts.length} concepts ML, Cloud, Gouvernance expliqués en français` },
  { href: "/certifications", emoji: "🎓", titre: "Certifications",        desc: `${certData.certifications.length} fiches AWS, Azure, GCP, Databricks, Snowflake et plus` },
  { href: "/glossaire",      emoji: "📖", titre: "Glossaire",             desc: `${glossaireData.length} définitions précises avec exemples et cas d'usage` },
  { href: "/metiers",        emoji: "👤", titre: "Métiers",               desc: "Salaires 2026, compétences requises et trajectoires de carrière" },
  { href: "/outils",         emoji: "🛠️", titre: "Outils & plateformes",  desc: "Comparatifs honnêtes de Snowflake, Databricks, dbt et plus" },
  { href: "/cas-usage",      emoji: "💼", titre: "Cas d'usage",           desc: "104 projets réels avec stack technique et résultats mesurés" },
  { href: "/debuter",        emoji: "🚀", titre: "Débuter en data",       desc: "Parcours guidé pour entrer dans la data en partant de zéro" },
  { href: "/newsletter",     emoji: "📬", titre: "Newsletter",            desc: "L'essentiel data & IA chaque semaine, en français" },
];

export default function AProposPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "80px 24px 72px",
        borderBottom: "1px solid #E2E8F0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 480, height: 480, borderRadius: "50%", background: "rgba(124,58,237,0.07)", top: -120, right: -80, filter: "blur(60px)" }} />
        <div style={{ maxWidth: 840, margin: "0 auto", position: "relative" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 100,
            background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)",
            fontSize: 11, fontWeight: 700, color: "#7C3AED",
            letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 22,
          }}>
            À propos de Data Universe
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
            fontWeight: 800, color: "#0F172A",
            lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: 20,
          }}>
            La data et l&apos;IA,{" "}
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              enfin expliquées en français
            </span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, maxWidth: 640, marginBottom: 32 }}>
            Data Universe est une encyclopédie indépendante dédiée aux professionnels de la data en France.
            Un seul objectif : rendre la connaissance data accessible en français, par quelqu&apos;un qui travaille dans ce domaine au quotidien.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 22px", background: "rgba(124,58,237,0.06)", borderRadius: 14, border: "1px solid rgba(124,58,237,0.15)", maxWidth: 540 }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff", fontSize: 20, flexShrink: 0 }}>
              P
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#0F172A" }}>Prijanth Seevaratnam</div>
              <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Consultant Senior en Data · TNP Consultants</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Product Owner ESG · La Banque Postale · Paris</div>
            </div>
            <a
              href="https://www.linkedin.com/in/prijanth-seevaratnam/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", borderRadius: 8, flexShrink: 0,
                background: "#0A66C2", color: "#fff",
                fontSize: 12, fontWeight: 700, textDecoration: "none",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "flex", gap: 48, flexWrap: "wrap" }}>
          {STATS.map(({ n, l }) => (
            <div key={l}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, color: "#7C3AED", lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "72px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Notre mission</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 20 }}>
            Pourquoi Data Universe ?
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 15.5, color: "#475569", lineHeight: 1.8 }}>
            <p>
              La data et l&apos;IA sont devenues des compétences incontournables dans presque tous les secteurs.
              Pourtant, la quasi-totalité des ressources de qualité sont en anglais — articles, documentations, formations, certifications.
            </p>
            <p>
              Les professionnels français doivent constamment jongler entre des sources disparates, des traductions approximatives et des contenus déconnectés de la réalité du marché français.
            </p>
            <p>
              Data Universe est né de ce constat. L&apos;objectif est simple : construire la référence francophone que l&apos;on aurait voulu avoir soi-même — précise, honnête, et ancrée dans la pratique réelle des équipes data en France.
            </p>
          </div>

          {/* Différenciation vs alternatives */}
          <div style={{ marginTop: 40, padding: "24px 28px", borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8", marginBottom: 16 }}>Pourquoi pas LinkedIn, Medium ou ChatGPT ?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "🔗", label: "LinkedIn", diff: "Les posts disparaissent. Aucune cohérence entre les sources. Data Universe est structuré et consultable comme une encyclopédie." },
                { icon: "📝", label: "Medium / blogs", diff: "Contenu souvent daté, non vérifié, sans ancrage marché français. Chaque fiche Data Universe est vérifiée et datée." },
                { icon: "🤖", label: "ChatGPT / IA", diff: "Les LLMs hallucinent sur les prix, dates et disponibilités. Data Universe est une source de faits vérifiables, pas de génération." },
              ].map(({ icon, label, diff }) => (
                <div key={label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                  <div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{label} : </span>
                    <span style={{ fontSize: 13.5, color: "#64748B" }}>{diff}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Nos valeurs</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>
            Comment on travaille
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {VALEURS.map(v => (
              <div key={v.titre} style={{
                padding: "24px 26px", borderRadius: 16,
                border: "1px solid #E2E8F0", background: "#FAFBFF",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{v.titre}</h3>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que contient Data Universe */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Le contenu</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Tout ce que tu trouveras sur Data Universe
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {SECTIONS.map(({ href, emoji, titre, desc }) => (
              <Link key={href} href={href} className="card" style={{ padding: "22px 22px", display: "block" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{titre}</h3>
                <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Newsletter */}
      <section style={{ maxWidth: 840, margin: "0 auto", padding: "72px 24px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
          Envie de suivre Data Universe ?
        </h2>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, maxWidth: 520, margin: "0 auto 28px" }}>
          La newsletter hebdomadaire regroupe les actualités data & IA les plus importantes, filtrées et expliquées en français. Gratuit, sans spam.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/newsletter" style={{
            padding: "12px 28px", borderRadius: 10,
            background: "#7C3AED", color: "#fff",
            fontSize: 14, fontWeight: 700, textDecoration: "none",
            fontFamily: "var(--font-display)",
          }}>
            S&apos;abonner gratuitement →
          </Link>
          <Link href="/concepts" style={{
            padding: "12px 28px", borderRadius: 10,
            border: "1.5px solid #E2E8F0", color: "#64748B",
            fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            Explorer l&apos;encyclopédie →
          </Link>
        </div>
      </section>
    </main>
  );
}
