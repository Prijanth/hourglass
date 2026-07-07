import Link from "next/link";
import { notFound } from "next/navigation";
import comparatifs from "@/content/comparatifs.json";
import outils from "@/content/outils.json";
import { ComparisonChart } from "@/components/charts/comparison-chart";

type Comparatif = typeof comparatifs[number];

function getOutil(slug: string) {
  return outils.find((o) => o.slug === slug);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "var(--surface-3)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 10 }} />
      </div>
      <span style={{ fontSize: 12.5, fontWeight: 700, color, minWidth: 26 }}>{value}</span>
    </div>
  );
}

export function generateStaticParams() {
  return comparatifs.map((c) => ({ slug: c.slug }));
}

export default async function ComparatifPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comparatif = comparatifs.find((c) => c.slug === slug) as Comparatif | undefined;
  if (!comparatif) notFound();

  const isThreeWay = (comparatif as { three_way?: boolean }).three_way === true;
  const toolA = getOutil(comparatif.tools[0]);
  const toolB = getOutil(comparatif.tools[1]);
  const toolC = comparatif.tools[2] ? getOutil(comparatif.tools[2]) : undefined;

  const radarData = comparatif.criteria.map((c) => ({
    criterion: c.name.length > 22 ? c.name.slice(0, 22) + "…" : c.name,
    a: c.a,
    b: c.b,
    c: (c as { c?: number }).c,
  }));

  const COLORS = ["#6366F1", "#14B8A6", "#F59E0B"];

  return (
    <>
      {/* Hero */}
      <div style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px 44px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.4)" }}>Accueil</Link>
            <span>›</span>
            <Link href="/comparatifs" style={{ color: "rgba(255,255,255,0.4)" }}>Comparatifs</Link>
            <span>›</span>
            <span style={{ color: "rgba(255,255,255,0.7)" }}>{comparatif.title}</span>
          </div>

          <span className="badge badge-dark" style={{ marginBottom: 20, display: "inline-flex" }}>{comparatif.category}</span>

          {/* Outils côte à côte */}
          <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
            {[toolA, toolB, toolC].filter(Boolean).map((tool, i) => tool && (
              <div key={tool.slug} style={{ display: "flex", alignItems: "center", gap: i > 0 ? 24 : 0 }}>
                {i > 0 && <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "rgba(255,255,255,0.25)", margin: "0 4px" }}>vs</span>}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                    {tool.emoji}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, color: "#fff" }}>{tool.name}</div>
                    <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>{tool.category}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 14, maxWidth: 700 }}>
            {comparatif.title}
          </h1>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 620, marginBottom: 16 }}>{comparatif.subtitle}</p>
          <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>Mis à jour le {fmtDate(comparatif.date)} · {comparatif.criteria.length} critères</div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>

        {/* Résumé */}
        <div style={{ padding: "24px 28px", background: "var(--indigo-tint)", borderRadius: 14, border: "1px solid rgba(99,102,241,0.2)", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--indigo)", marginBottom: 10 }}>Synthèse</p>
          <p style={{ fontSize: 15.5, color: "#334155", lineHeight: 1.7 }}>{comparatif.summary}</p>
        </div>

        {/* Chart + Scores côte à côte */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 48 }}>
          {/* Radar */}
          <div className="card" style={{ padding: "24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 16 }}>Radar comparatif</p>
            <ComparisonChart
              data={radarData}
              nameA={toolA?.name ?? "A"}
              nameB={toolB?.name ?? "B"}
              nameC={isThreeWay ? toolC?.name : undefined}
            />
          </div>

          {/* Scores globaux */}
          <div className="card" style={{ padding: "24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 20 }}>Score global</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { tool: toolA, score: comparatif.score_a, color: COLORS[0] },
                { tool: toolB, score: comparatif.score_b, color: COLORS[1] },
                ...(isThreeWay && toolC ? [{ tool: toolC, score: (comparatif as { score_c?: number }).score_c ?? 0, color: COLORS[2] }] : []),
              ].map(({ tool, score, color }) => tool && (
                <div key={tool.slug}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{tool.emoji}</span>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15 }}>{tool.name}</span>
                    <span style={{ marginLeft: "auto", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color }}>{score}</span>
                  </div>
                  <ScoreBar value={score} color={color} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau critères */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-label">Analyse critère par critère</span>
          <div style={{ border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: `2fr ${isThreeWay ? "1fr 1fr 1fr" : "1fr 1fr"}`, background: "var(--surface-2)", padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--faint)" }}>Critère</span>
              {[toolA, toolB, ...(isThreeWay && toolC ? [toolC] : [])].map((t) => t && (
                <span key={t.slug} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text)", textAlign: "center" }}>{t.emoji} {t.name}</span>
              ))}
            </div>

            {comparatif.criteria.map((criterion, i) => (
              <div key={i} style={{ borderBottom: i < comparatif.criteria.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display: "grid", gridTemplateColumns: `2fr ${isThreeWay ? "1fr 1fr 1fr" : "1fr 1fr"}`, padding: "14px 20px", alignItems: "center", background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)" }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{criterion.name}</span>
                  {[criterion.a, criterion.b, ...(isThreeWay && (criterion as { c?: number }).c !== undefined ? [(criterion as { c?: number }).c!] : [])].map((score, j) => (
                    <div key={j} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: COLORS[j] }}>{score}</div>
                      <div style={{ width: 36, height: 4, background: "var(--surface-3)", borderRadius: 10, margin: "4px auto 0", overflow: "hidden" }}>
                        <div style={{ width: `${score}%`, height: "100%", background: COLORS[j], borderRadius: 10 }} />
                      </div>
                    </div>
                  ))}
                </div>
                {criterion.note && (
                  <div style={{ padding: "8px 20px 12px", background: i % 2 === 0 ? "var(--surface)" : "var(--surface-2)" }}>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic" }}>💡 {criterion.note}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Verdicts */}
        <div style={{ marginBottom: 48 }}>
          <span className="section-label">Notre verdict</span>
          <div style={{ display: "grid", gridTemplateColumns: isThreeWay ? "1fr 1fr 1fr" : "1fr 1fr", gap: 20 }}>
            {[
              { tool: toolA, verdict: comparatif.verdict_a, color: COLORS[0] },
              { tool: toolB, verdict: comparatif.verdict_b, color: COLORS[1] },
              ...(isThreeWay && toolC ? [{ tool: toolC, verdict: (comparatif as { verdict_c?: string }).verdict_c ?? "", color: COLORS[2] }] : []),
            ].map(({ tool, verdict, color }) => tool && (
              <div key={tool.slug} className="card" style={{ padding: "22px 24px", borderTop: `3px solid ${color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span style={{ fontSize: 22 }}>{tool.emoji}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color }}>{tool.name}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7 }}>{verdict}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage combiné */}
        {comparatif.shared_use && (
          <div style={{ padding: "22px 28px", background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 36 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 10 }}>Usage combiné possible ?</p>
            <p style={{ fontSize: 14.5, color: "var(--text)", lineHeight: 1.7 }}>{comparatif.shared_use}</p>
          </div>
        )}

        {/* Méthodologie */}
        <div style={{ margin: "36px 0 28px", padding: "22px 28px", background: "var(--surface-2)", borderRadius: 14, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 16 }}>📐</span>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)" }}>Méthodologie de notation</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 16 }}>
            {[
              { icon: "📄", label: "Documentation officielle", desc: "Docs, changelogs et benchmarks publiés par les éditeurs." },
              { icon: "👥", label: "Communauté data", desc: "Retours de praticiens sur Reddit (r/dataengineering), Stack Overflow, GitHub Issues." },
              { icon: "📊", label: "Benchmarks publics", desc: "TPC-H, TPC-DS, ClickBench et comparaisons indépendantes publiées depuis 2023." },
              { icon: "🏭", label: "Expérience terrain", desc: "Témoignages et post-mortems d'équipes data en production (blogs tech, conférences)." },
            ].map(({ icon, label, desc }) => (
              <div key={label} style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 16px", background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)", fontSize: 12.5, color: "var(--muted)", lineHeight: 1.65 }}>
            <strong style={{ color: "var(--text)" }}>Grille de notation :</strong> chaque critère est noté de 0 à 100.
            Le score global est une moyenne pondérée ajustée selon l&apos;importance relative de chaque critère dans les cas d&apos;usage les plus fréquents — il ne résulte pas d&apos;une moyenne arithmétique simple.
            Les scores sont des <strong style={{ color: "var(--text)" }}>évaluations éditoriales</strong> de l&apos;équipe Data Universe, non sponsorisées. Dernière révision : {new Date(comparatif.date).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}.
          </div>
        </div>

        <Link href="/comparatifs" style={{ fontSize: 14, fontWeight: 600, color: "var(--indigo)" }}>← Tous les comparatifs</Link>
      </div>
    </>
  );
}
