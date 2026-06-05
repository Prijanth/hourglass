import type { Metadata } from "next";
import Link from "next/link";
import articles from "@/content/articles.json";

export const metadata: Metadata = {
  title: "Actualités Data & IA en français | DataSphère",
  description: "Les actualités data et intelligence artificielle les plus importantes chaque semaine. Machine Learning, Cloud, Gouvernance des données — analysées et expliquées pour les pros.",
};

const CATEGORY_COLORS: Record<string, string> = {
  indigo: "badge-indigo", teal: "badge-teal", amber: "badge-amber", rose: "badge-rose",
};

const CATEGORY_ACCENT: Record<string, string> = {
  indigo: "var(--indigo-light)",
  teal:   "#22D3EE",
  amber:  "#FCD34D",
  rose:   "#FB7185",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActualitesPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured || a.slug !== featured?.slug);

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 380, height: 380, background: "rgba(124,58,237,0.24)", top: -120, right: "3%", animationDelay: "2s" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(6,182,212,0.15)", bottom: -60, left: "8%", animationDelay: "9s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Toutes les publications</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Actualités</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Analyses, tutoriels et décryptages sur la data et l&apos;IA.
          </p>
        </div>
      </section>

      {/* ── CONTENU ───────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>

        {/* Article vedette */}
        {featured && (
          <Link href={`/actualites/${featured.slug}`} style={{ display: "block", marginBottom: 40, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.11)", transition: "box-shadow 0.2s, transform 0.2s" }}
            className="card"
          >
            <div style={{ height: 5, background: `linear-gradient(90deg, ${CATEGORY_ACCENT[featured.categoryColor] ?? "var(--indigo)"}, transparent)` }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, padding: "36px 40px", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: CATEGORY_ACCENT[featured.categoryColor] ?? "var(--indigo-light)" }}>
                    ★ Article vedette
                  </span>
                  <span className={`badge ${CATEGORY_COLORS[featured.categoryColor] ?? "badge-neutral"}`}>{featured.category}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: "-0.03em", marginBottom: 12, maxWidth: 620 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.65, maxWidth: 580, marginBottom: 20 }}>
                  {featured.excerpt}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{fmtDate(featured.date)}</span>
                  <span style={{ color: "var(--border)" }}>·</span>
                  <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{featured.readTime} de lecture</span>
                </div>
              </div>
              <div style={{ flexShrink: 0, padding: "16px 22px", background: "var(--indigo-tint)", borderRadius: 12, textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 13, color: "var(--indigo-light)" }}>Lire l&apos;article</div>
                <div style={{ fontSize: 20, marginTop: 4 }}>→</div>
              </div>
            </div>
          </Link>
        )}

        {/* Grille articles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {rest.map((a) => (
            <Link key={a.slug} href={`/actualites/${a.slug}`} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
              <div style={{ height: 4, background: CATEGORY_ACCENT[a.categoryColor] ?? "var(--indigo)" }} />
              <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className={`badge ${CATEGORY_COLORS[a.categoryColor] ?? "badge-neutral"}`}>{a.category}</span>
                  <span style={{ fontSize: 12, color: "var(--faint)" }}>{a.readTime}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{a.title}</h2>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, flex: 1 }}>{a.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, color: "var(--faint)" }}>{fmtDate(a.date)}</span>
                  <span style={{ fontSize: 13, color: CATEGORY_ACCENT[a.categoryColor] ?? "var(--indigo-light)", fontWeight: 700 }}>Lire →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
