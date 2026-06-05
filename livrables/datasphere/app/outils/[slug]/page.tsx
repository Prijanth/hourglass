import Link from "next/link";
import { notFound } from "next/navigation";
import outils from "@/content/outils.json";
import { ScoreChart } from "@/components/charts/score-chart";

type Outil = typeof outils[number];

function OverallScore(scores: Record<string, number>) {
  const vals = Object.values(scores);
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

export function generateStaticParams() {
  return outils.map((o) => ({ slug: o.slug }));
}

export default async function OutilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const outil = outils.find((o) => o.slug === slug) as Outil | undefined;
  if (!outil) notFound();

  const overall = OverallScore(outil.score);
  const overallColor = overall >= 80 ? "#14B8A6" : overall >= 70 ? "#6366F1" : "#F59E0B";

  const alternatives = outils.filter((o) => outil.alternatives.some(a => o.slug.includes(a))).slice(0, 3);

  const scoreData = Object.entries(outil.score).map(([key, val]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "),
    value: val,
  }));

  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", padding: "44px 24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: "var(--muted)" }}>
            <Link href="/" style={{ color: "var(--muted)" }}>Accueil</Link>
            <span>›</span>
            <Link href="/outils" style={{ color: "var(--muted)" }}>Outils</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{outil.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
                  {outil.emoji}
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{outil.name}</h1>
                  <span className="badge badge-indigo" style={{ marginTop: 6, display: "inline-flex" }}>{outil.category}</span>
                </div>
              </div>
              <p style={{ fontSize: 16.5, color: "var(--muted)", lineHeight: 1.65, maxWidth: 600 }}>{outil.tagline}</p>
            </div>

            {/* Score global */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 28px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 48, color: overallColor, letterSpacing: "-0.05em", lineHeight: 1 }}>{overall}</div>
              <div style={{ fontSize: 12, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Score global</div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {outil.open_source && <span className="badge badge-teal">Open source</span>}
                {outil.free_tier && <span className="badge badge-neutral">Free tier</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start" }}>

        {/* Contenu principal */}
        <div>
          {/* Description */}
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Présentation</span>
            <p style={{ fontSize: 16, color: "#334155", lineHeight: 1.8 }}>{outil.description}</p>
          </div>

          {/* Fonctionnalités */}
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Fonctionnalités clés</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {outil.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10 }}>
                  <span style={{ color: "var(--teal)", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pros / Cons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0F766E", marginBottom: 14 }}>✓ Points forts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {outil.pros.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
                    <span style={{ color: "#0F766E", flexShrink: 0, fontWeight: 700 }}>+</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#BE123C", marginBottom: 14 }}>✗ Limites</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {outil.cons.map((c) => (
                  <div key={c} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
                    <span style={{ color: "#BE123C", flexShrink: 0, fontWeight: 700 }}>−</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pièges en production */}
          {"pieges_prod" in outil && Array.isArray((outil as { pieges_prod?: string[] }).pieges_prod) && (
            <div style={{ marginBottom: 36, padding: "22px 24px", borderRadius: 14, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#C2410C", marginBottom: 14 }}>
                ⚠️ Pièges connus en production
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {((outil as { pieges_prod: string[] }).pieges_prod).map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, fontSize: 13.5, color: "#7C2D12", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, flexShrink: 0, color: "#EA580C" }}>{i + 1}.</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best for / Not for */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
            <div style={{ padding: "18px 20px", background: "#F0FDFA", borderRadius: 12, border: "1px solid #CCFBF1" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0F766E", marginBottom: 8 }}>✓ Fait pour vous si…</p>
              <p style={{ fontSize: 14, color: "#0F766E", lineHeight: 1.6 }}>{outil.best_for}</p>
            </div>
            <div style={{ padding: "18px 20px", background: "#FFF1F2", borderRadius: 12, border: "1px solid #FFE4E6" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#BE123C", marginBottom: 8 }}>✗ Pas fait pour vous si…</p>
              <p style={{ fontSize: 14, color: "#BE123C", lineHeight: 1.6 }}>{outil.not_for}</p>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {outil.tags.map((t) => (
              <span key={t} className="badge badge-neutral">{t}</span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Score chart */}
          <div className="card" style={{ padding: "22px 24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 16 }}>Scores détaillés</p>
            <ScoreChart data={scoreData} />
            <p style={{ fontSize: 11, color: "var(--faint)", lineHeight: 1.5, marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
              Scores éditoriaux basés sur les benchmarks publics, la documentation officielle et les retours de praticiens en France — évaluation mai 2026.
            </p>
          </div>

          {/* Infos pratiques */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)" }}>Infos pratiques</p>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontWeight: 600 }}>✓ Mai 2026</span>
            </div>
            {[
              { label: "Tarif", value: outil.pricing },
              { label: "Courbe d'apprentissage", value: outil.learning_curve },
              { label: "Lancé en", value: outil.launched },
              { label: "Open source", value: outil.open_source ? "Oui" : "Non" },
              { label: "Free tier", value: outil.free_tier ? "Disponible" : "Non" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid var(--border)", fontSize: 13.5 }}>
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <a href={outil.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "10px 0", textAlign: "center", background: "var(--indigo)", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", marginTop: 6 }}>
              Site officiel →
            </a>
          </div>

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="card" style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 14 }}>Alternatives</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {alternatives.map((alt) => (
                  <Link key={alt.slug} href={`/outils/${alt.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8, transition: "background 0.15s" }}>
                    <span style={{ fontSize: 18 }}>{alt.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{alt.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{alt.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/outils" style={{ display: "block", textAlign: "center", fontSize: 13.5, fontWeight: 600, color: "var(--muted)", padding: "10px", border: "1px solid var(--border)", borderRadius: 8 }}>
            ← Tous les outils
          </Link>
        </aside>
      </div>
    </>
  );
}
