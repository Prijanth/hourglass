import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import data from "@/content/concepts.json";
import ConceptExportButton from "@/components/concept-export-button";

export function generateStaticParams() {
  return data.concepts.map(c => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const concept = data.concepts.find(c => c.id === slug);
  if (!concept) return { title: "Concept — Data Universe" };
  return {
    title: `${concept.titre} — ${concept.categorie} | Data Universe`,
    description: concept.description_courte,
  };
}

const CAT_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string; gradient: string }> = {
  "Machine Learning":       { emoji: "🤖", color: "#5558FF", bg: "#EEEEFF", border: "rgba(85,88,255,0.2)",  gradient: "linear-gradient(135deg, #5558FF, #00C9A7)" },
  "Techniques Analytics":   { emoji: "📊", color: "#0F766E", bg: "#E6FAF7", border: "rgba(0,201,167,0.2)",  gradient: "linear-gradient(135deg, #00C9A7, #0F766E)" },
  "Cloud":                  { emoji: "☁️", color: "#C2410C", bg: "#FFF7ED", border: "rgba(255,107,53,0.2)", gradient: "linear-gradient(135deg, #FF6B35, #FF9500)" },
  "Gouvernance & Qualité":  { emoji: "🏛️", color: "#7E22CE", bg: "#F5F3FF", border: "rgba(126,34,206,0.2)", gradient: "linear-gradient(135deg, #7E22CE, #5558FF)" },
};

const NIVEAU_CLS: Record<string, string> = { "Débutant": "badge-teal", "Intermédiaire": "badge-amber", "Avancé": "badge-rose" };

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = data.concepts.find(c => c.id === slug);
  if (!concept) notFound();

  const cfg = CAT_CONFIG[concept.categorie] || { emoji: "📁", color: "var(--indigo)", bg: "var(--indigo-tint)", border: "rgba(85,88,255,0.15)", gradient: "linear-gradient(135deg, var(--indigo), var(--teal))" };
  const related = data.concepts.filter(c => c.id !== concept.id && (c.categorie === concept.categorie || c.sous_categorie === concept.sous_categorie)).slice(0, 4);

  return (
    <main>
      {/* Breadcrumb */}
      <div style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", padding: "12px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)" }}>
          <Link href="/" style={{ color: "var(--faint)" }}>Accueil</Link>
          <span style={{ color: "var(--ghost)" }}>/</span>
          <Link href="/concepts" style={{ color: "var(--faint)" }}>Encyclopédie</Link>
          <span style={{ color: "var(--ghost)" }}>/</span>
          <span style={{ color: "var(--text)" }}>{concept.titre}</span>
        </div>
      </div>

      {/* Hero concept */}
      <section style={{ background: "var(--navy)", padding: "52px 24px 48px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 350, height: 350, background: `${cfg.color}18`, top: -100, right: -80 }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, alignItems: "center" }}>
            <span style={{ fontSize: 40 }}>{concept.emoji}</span>
            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}35` }}>{concept.categorie}</span>
            <span className={`badge ${NIVEAU_CLS[concept.niveau] || "badge-neutral"}`}>{concept.niveau}</span>
            <span style={{ fontSize: 11, color: "var(--muted)", background: "rgba(124,58,237,0.08)", padding: "3px 10px", borderRadius: 100 }}>{concept.sous_categorie}</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, lineHeight: 1.12, color: "#0F172A", marginBottom: 14 }}>{concept.titre}</h1>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <p style={{ fontSize: 16.5, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 640 }}>{concept.description_courte}</p>
            <ConceptExportButton concept={concept} />
          </div>
        </div>
      </section>

      {/* Corps */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {/* Explication simple */}
        <div style={{ background: cfg.gradient, borderRadius: 20, padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", borderRadius: 20 }} />
          <div style={{ position: "relative" }}>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#64748B", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <span>💡</span>Explication simple
            </p>
            <p style={{ fontSize: 15.5, lineHeight: 1.8, color: "rgba(255,255,255,0.88)" }}>{concept.explication_simple}</p>
          </div>
        </div>

        {/* Exemple concret */}
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 18, padding: 26, marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🏗️</span>Exemple concret
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--text-2)" }}>{concept.exemple_concret}</p>
        </div>

        {/* Exemple de code */}
        {(concept as { code_example?: { language: string; code: string } }).code_example && (() => {
          const ex = (concept as { code_example: { language: string; code: string } }).code_example;
          const LANG_LABELS: Record<string, string> = { sql: "SQL", python: "Python", yaml: "YAML", bash: "Bash" };
          const LANG_COLORS: Record<string, string> = { sql: "#06B6D4", python: "#F59E0B", yaml: "#A78BFA", bash: "#4ADE80" };
          return (
            <div style={{ marginBottom: 24, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(85,88,255,0.18)" }}>
              <div style={{ background: "#0F1629", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: LANG_COLORS[ex.language] ?? "#A5B4FC", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {LANG_LABELS[ex.language] ?? ex.language}
                </span>
                <span style={{ fontSize: 10, color: "rgba(165,180,252,0.4)", fontFamily: "var(--font-mono)" }}>exemple</span>
              </div>
              <pre style={{
                margin: 0,
                padding: "20px 24px",
                background: "#0B0F23",
                overflowX: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                lineHeight: 1.75,
                color: "#CBD5E1",
                whiteSpace: "pre",
              }}>
                <code>{ex.code}</code>
              </pre>
            </div>
          );
        })()}

        {/* Formule */}
        {concept.formule && (
          <div style={{ background: "#0F1629", borderRadius: 16, padding: "20px 24px", marginBottom: 24, border: "1px solid rgba(85,88,255,0.25)" }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(170,173,255,0.6)", marginBottom: 10 }}>∑ Concept clé</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 13.5, lineHeight: 1.85, color: "#A5B4FC" }}>{concept.formule}</p>
          </div>
        )}

        {/* Quand utiliser */}
        {"quand_utiliser" in concept && Array.isArray((concept as {quand_utiliser?: string[]}).quand_utiliser) && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <span>🎯</span> Quand l&apos;utiliser ?
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {((concept as {quand_utiliser?: string[]}).quand_utiliser || []).map(q => (
                <div key={q} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "var(--surface-2)", borderRadius: 12, border: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--teal)", flexShrink: 0, fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--text-2)" }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Avantages / Limites */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0", borderRadius: 16, padding: 22 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#15803D", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              ✅ Avantages
            </h3>
            {concept.avantages.map(a => (
              <div key={a} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <span style={{ color: "#15803D", fontWeight: 700, flexShrink: 0 }}>+</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.6, color: "#166534" }}>{a}</span>
              </div>
            ))}
          </div>
          <div style={{ background: "#FFF1F2", border: "1.5px solid #FECDD3", borderRadius: 16, padding: 22 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#BE123C", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              ⚠️ Limites
            </h3>
            {concept.inconvenients.map(i => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                <span style={{ color: "#BE123C", fontWeight: 700, flexShrink: 0 }}>−</span>
                <span style={{ fontSize: 13.5, lineHeight: 1.6, color: "#9F1239" }}>{i}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outils */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 800, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span>🛠️</span> Outils principaux
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {concept.outils.map(o => (
              <div key={o} style={{ padding: "9px 18px", borderRadius: 10, background: "var(--surface)", border: "1.5px solid var(--border)", fontSize: 13.5, fontWeight: 500, color: "var(--text-2)", fontFamily: "var(--font-mono)" }}>
                {o}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {concept.tags.map(tag => (
              <span key={tag} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Concepts liés */}
        {related.length > 0 && (
          <>
            <div style={{ height: 1, background: "var(--border)", marginBottom: 32 }} />
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, marginBottom: 20 }}>Concepts liés</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              {related.map(rel => (
                <Link key={rel.id} href={`/concepts/${rel.id}`}>
                  <div className="card" style={{ padding: 18, display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{rel.emoji}</span>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, marginBottom: 3 }}>{rel.titre}</p>
                      <p style={{ fontSize: 11, color: "var(--faint)" }}>{rel.sous_categorie}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Retour */}
        <div style={{ marginTop: 48, display: "flex", justifyContent: "center" }}>
          <Link href="/concepts" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: 10, border: "1.5px solid var(--border)", color: "var(--muted)", fontSize: 14, fontWeight: 500 }}>
            ← Retour à l&apos;encyclopédie
          </Link>
        </div>
      </div>
    </main>
  );
}
