import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "À propos de DataSphère — La référence data & IA en français",
  description: "DataSphère est le hub francophone de référence pour les professionnels de la data et de l'IA en France. Encyclopédie, certifications, glossaire, métiers et communauté.",
};

const STATS = [
  { n: "137",   l: "termes dans le glossaire" },
  { n: "100+",  l: "certifications référencées" },
  { n: "60+",   l: "concepts expliqués" },
  { n: "2 400+", l: "abonnés newsletter (juin 2026)" },
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
    desc: "DataSphère est construit par des gens qui travaillent en data au quotidien. Pas de théorie pure : chaque concept est ancré dans la pratique réelle des équipes en France.",
  },
  {
    emoji: "🔓",
    titre: "100% gratuit",
    desc: "L'encyclopédie, le glossaire, les fiches métiers, les comparatifs — tout est accessible librement, sans compte et sans abonnement payant.",
  },
];

const SECTIONS = [
  { href: "/concepts",       emoji: "📚", titre: "Encyclopédie",         desc: "60+ concepts ML, Cloud, Gouvernance expliqués en français" },
  { href: "/certifications", emoji: "🎓", titre: "Certifications",        desc: "100+ fiches AWS, Azure, GCP, Databricks, Snowflake et plus" },
  { href: "/glossaire",      emoji: "📖", titre: "Glossaire",             desc: "137 définitions précises avec exemples et cas d'usage" },
  { href: "/metiers",        emoji: "👤", titre: "Métiers",               desc: "Salaires 2025, compétences requises et trajectoires de carrière" },
  { href: "/outils",         emoji: "🛠️", titre: "Outils & plateformes",  desc: "Comparatifs honnêtes de Snowflake, Databricks, dbt et plus" },
  { href: "/cas-usage",      emoji: "💼", titre: "Cas d'usage",           desc: "50+ projets réels avec stack technique et résultats mesurés" },
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
            À propos de DataSphère
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
          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, maxWidth: 640 }}>
            DataSphère est une encyclopédie indépendante dédiée aux professionnels de la data en France.
            Créée par Prijanth S., Consultant Senior en Data — avec un seul objectif : rendre la connaissance data accessible en français.
          </p>
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
            Pourquoi DataSphère ?
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
              DataSphère est né de ce constat. L&apos;objectif est simple : construire la référence francophone que l&apos;on aurait voulu avoir soi-même — précise, honnête, et ancrée dans la pratique réelle des équipes data en France.
            </p>
          </div>

          {/* Différenciation vs alternatives */}
          <div style={{ marginTop: 40, padding: "24px 28px", borderRadius: 16, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8", marginBottom: 16 }}>Pourquoi pas LinkedIn, Medium ou ChatGPT ?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: "🔗", label: "LinkedIn", diff: "Les posts disparaissent. Aucune cohérence entre les sources. DataSphère est structuré et consultable comme une encyclopédie." },
                { icon: "📝", label: "Medium / blogs", diff: "Contenu souvent daté, non vérifié, sans ancrage marché français. Chaque fiche DataSphère est vérifiée et datée." },
                { icon: "🤖", label: "ChatGPT / IA", diff: "Les LLMs hallucinent sur les prix, dates et disponibilités. DataSphère est une source de faits vérifiables, pas de génération." },
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

      {/* Ce que contient DataSphère */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Le contenu</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Tout ce que tu trouveras sur DataSphère
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
          Envie de suivre DataSphère ?
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
