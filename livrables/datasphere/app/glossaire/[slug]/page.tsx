import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import glossaire from "@/content/glossaire.json";

function toSlug(term: string): string {
  return term
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "badge-teal",
  Engineering: "badge-indigo",
  "IA Générative": "badge-rose",
  Transformation: "badge-amber",
  Architecture: "badge-neutral",
  Analytics: "badge-indigo",
  Processing: "badge-teal",
  Qualité: "badge-amber",
  DataOps: "badge-neutral",
  Gouvernance: "badge-neutral",
  "Machine Learning": "badge-indigo",
  "Deep Learning": "badge-indigo",
  MLOps: "badge-rose",
  Statistiques: "badge-teal",
  "Data Engineering": "badge-indigo",
};

export async function generateStaticParams() {
  return glossaire.map((term) => ({ slug: toSlug(term.term) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = glossaire.find((t) => toSlug(t.term) === slug);
  if (!term) return { title: "Terme introuvable | Data Universe" };
  return {
    title: `${term.term} — Définition data & IA | Data Universe`,
    description: term.definition.slice(0, 155) + (term.definition.length > 155 ? "…" : ""),
    openGraph: {
      title: `${term.term} — Définition | Data Universe`,
      description: term.definition.slice(0, 155),
    },
  };
}

export default async function GlossaireTermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = glossaire.find((t) => toSlug(t.term) === slug);
  if (!term) notFound();

  const firstLetter = term.term.normalize("NFD").replace(/[̀-ͯ]/g, "")[0].toUpperCase();
  const sameCategory = glossaire
    .filter((t) => t.category === term.category && t.term !== term.term)
    .slice(0, 5);

  const schema = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "name": term.term,
    "description": term.definition,
    "inDefinedTermSet": "https://Data Universe.fr/glossaire",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "52px 24px 44px",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
        position: "relative", overflow: "hidden",
      }}>
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "var(--muted)" }}>
            <Link href="/glossaire" style={{ color: "var(--muted)", textDecoration: "none" }}>Glossaire</Link>
            <span style={{ color: "var(--faint)" }}>›</span>
            <Link href={`/glossaire#letter-${firstLetter}`} style={{ color: "var(--muted)", textDecoration: "none" }}>{firstLetter}</Link>
            <span style={{ color: "var(--faint)" }}>›</span>
            <span style={{ color: "var(--text)", fontWeight: 600 }}>{term.term}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span className={`badge ${CATEGORY_COLORS[term.category] ?? "badge-neutral"}`} style={{ fontSize: 13 }}>
              {term.category}
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, color: "#0F172A",
            lineHeight: 1.1, letterSpacing: "-0.03em",
            marginBottom: 0,
          }}>
            {term.term}
          </h1>
        </div>
      </section>

      {/* ── CONTENU ──────────────────────────────────── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 40, alignItems: "start" }}>

          {/* Colonne principale */}
          <div>
            {/* Définition */}
            <div className="card" style={{ padding: "28px 32px", marginBottom: 28 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 16, color: "var(--indigo)" }}>
                Définition
              </h2>
              <p style={{ fontSize: 15.5, color: "var(--text)", lineHeight: 1.8 }}>
                {term.definition}
              </p>
            </div>

            {/* Exemples */}
            {term.examples && term.examples.length > 0 && (
              <div className="card" style={{ padding: "24px 32px", marginBottom: 28 }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
                  Exemples concrets
                </h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {term.examples.map((ex) => (
                    <span key={ex} style={{
                      padding: "6px 14px",
                      background: "var(--indigo-tint)",
                      border: "1px solid var(--indigo-border)",
                      borderRadius: 8,
                      fontSize: 13.5,
                      color: "var(--indigo)",
                      fontWeight: 500,
                    }}>{ex}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation entre termes */}
            <div style={{ display: "flex", gap: 12 }}>
              <Link href="/glossaire" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 8,
                background: "var(--surface)", border: "1px solid var(--border)",
                fontSize: 13.5, color: "var(--muted)", textDecoration: "none", fontWeight: 500,
              }}>
                ← Retour au glossaire
              </Link>
              <Link href={`/glossaire#letter-${firstLetter}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 8,
                background: "var(--surface)", border: "1px solid var(--border)",
                fontSize: 13.5, color: "var(--muted)", textDecoration: "none", fontWeight: 500,
              }}>
                Termes en &ldquo;{firstLetter}&rdquo;
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Fiche rapide */}
            <div className="card" style={{ padding: "22px 24px", marginBottom: 20 }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text)" }}>
                Fiche rapide
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--faint)", display: "block", marginBottom: 4 }}>Catégorie</span>
                  <span className={`badge ${CATEGORY_COLORS[term.category] ?? "badge-neutral"}`}>{term.category}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--faint)", display: "block", marginBottom: 4 }}>Exemples</span>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{term.examples?.length ?? 0} outil{(term.examples?.length ?? 0) > 1 ? "s" : ""} / technologie{(term.examples?.length ?? 0) > 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>

            {/* Termes liés */}
            {sameCategory.length > 0 && (
              <div className="card" style={{ padding: "22px 24px" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, marginBottom: 14, color: "var(--text)" }}>
                  Autres termes en {term.category}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {sameCategory.map((t) => (
                    <Link key={t.term} href={`/glossaire/${toSlug(t.term)}`} style={{
                      fontSize: 13.5, color: "var(--indigo)", textDecoration: "none", fontWeight: 500,
                      padding: "6px 0", borderBottom: "1px solid var(--border)",
                    }}>
                      {t.term} →
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
