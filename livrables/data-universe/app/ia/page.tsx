"use client";
import { useState, useMemo } from "react";
import ia from "@/content/ia.json";

/* ─── TYPES ────────────────────────────────────────────── */
interface Modele {
  id: string; nom: string; editeur: string; logo_color: string;
  type: string; acces: string; date_sortie: string; description: string;
  statut?: string;
  points_forts: string[]; points_faibles: string[];
  context_window?: string; cout_approx?: string;
  cas_usage_phares: string[];
  benchmark_mmlu?: number | null; benchmark_humaneval?: number | null; benchmark_math?: number | null;
  benchmark_swebench_pro?: number | null; benchmark_osworld?: number | null; benchmark_hle?: number | null;
  lien: string; tags: string[];
}
interface Risque {
  id: string; titre: string; emoji: string; niveau_risque: string;
  couleur: string; description: string;
  exemples_concrets: string[]; secteurs_exposes: string[];
  bonnes_pratiques: string[]; sources?: string[];
}
interface UsageIA {
  id: string; titre: string; type_ia: string; secteur: string;
  maturite: string; description: string;
  outils_typiques: string[]; gains_typiques: string[];
  limites: string[]; exemple_concret: string;
}

/* ─── CONSTANTES ──────────────────────────────────────── */
const TABS = [
  { id: "modeles",         label: "Modèles IA",       emoji: "🧠" },
  { id: "usages",          label: "Cas d'usage",       emoji: "💼" },
  { id: "risques",         label: "Risques & Limites", emoji: "⚠️" },
  { id: "reglementations", label: "Réglementations",   emoji: "📋" },
];

const MODEL_TYPES = ["Tous", "LLM", "Image", "Code", "Audio", "Vidéo", "Multimodal", "Embarqué"];

const PRICING_URLS: Record<string, string> = {
  "OpenAI":             "https://openai.com/pricing",
  "Anthropic":          "https://www.anthropic.com/pricing",
  "Google DeepMind":    "https://ai.google.dev/pricing",
  "Mistral AI":         "https://mistral.ai/technology/#pricing",
  "Cohere":             "https://cohere.com/pricing",
  "Alibaba Cloud":      "https://www.alibabacloud.com/help/en/model-studio/",
  "DeepSeek":           "https://platform.deepseek.com/api-docs/pricing",
  "Microsoft":          "https://azure.microsoft.com/fr-fr/pricing/details/cognitive-services/",
  "Black Forest Labs":  "https://docs.bfl.ai/",
  "Stability AI":       "https://platform.stability.ai/pricing",
  "Ideogram":           "https://ideogram.ai/pricing",
  "Adobe":              "https://www.adobe.com/fr/creativecloud/plans.html",
  "Microsoft / GitHub": "https://github.com/features/copilot#pricing",
  "Cursor AI":          "https://cursor.sh/pricing",
  "ElevenLabs":         "https://elevenlabs.io/pricing",
  "Suno":               "https://suno.com/pricing",
  "Kuaishou":           "https://kling.kuaishou.com/",
  "Midjourney":         "https://www.midjourney.com/account",
  "Runway":             "https://runwayml.com/pricing",
  "xAI":                "https://x.ai/api",
};

const BENCHMARK_SOURCES: Record<string, "officiel" | "estimé"> = {
  // OpenAI
  "gpt-4o":           "officiel",
  "o3":               "officiel",
  "o4-mini":          "officiel",
  "gpt-41":           "officiel",
  "gpt-5":            "estimé",   // en bordure de cutoff août 2025
  "gpt-55":           "estimé",   // post cutoff (avril 2026)
  // Anthropic
  "claude-3-5-sonnet":"officiel",
  "claude-37-sonnet": "officiel",
  "claude-sonnet-46": "officiel",
  "claude-haiku-45":  "officiel",
  "claude-opus-47":   "officiel",
  "claude-opus-48":   "officiel",
  // Google DeepMind
  "gemini-1-5-pro":   "officiel",
  "gemini-2-0-flash": "officiel",
  "gemini-2-0-pro":   "estimé",
  "gemini-25-pro":    "officiel",
  "gemini-25-flash":  "officiel",
  "gemini-31-pro":    "estimé",   // post cutoff (fév 2026)
  "gemini-35-flash":  "estimé",   // post cutoff (mai 2026)
  // Meta
  "llama-3-1-405b":   "officiel",
  "llama-3-3-70b":    "officiel",
  "llama-4-scout":    "officiel",
  "llama-4-maverick": "officiel",
  // Mistral AI
  "mistral-large-2":  "officiel",
  "mistral-small-3":  "officiel",
  "mistral-medium-3": "officiel",
  "mixtral-8x22b":    "officiel",
  "pixtral-large":    "estimé",
  // Autres
  "command-r-plus":   "officiel",
  "qwen-2-5-72b":     "officiel",
  "deepseek-v3":      "officiel",
  "deepseek-r1":      "officiel",
  "phi-4":            "officiel",
  "grok-3":           "officiel",
};
const ACCES_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Propriétaire": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Open Source":  { bg: "#F0FDF4", text: "#15803D", border: "#86EFAC" },
  "Hybride":      { bg: "#EDE9FE", text: "#5B21B6", border: "#C4B5FD" },
};
const RISQUE_COLORS: Record<string, string> = {
  "Critique": "#DC2626", "Élevé": "#EA580C", "Modéré": "#D97706", "Faible": "#16A34A",
};
const MATURITE_COLORS: Record<string, { bg: string; text: string }> = {
  "Production":    { bg: "#F0FDF4", text: "#15803D" },
  "Émergent":      { bg: "#FFFBEB", text: "#B45309" },
  "Expérimental":  { bg: "#FFF1F2", text: "#BE123C" },
};

/* ─── SOUS-COMPOSANTS ─────────────────────────────────── */
function BenchmarkBar({ label, value, max = 100, color = "#7C3AED" }: { label: string; value?: number | null; max?: number; color?: string }) {
  if (!value) return null;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 10.5, color: "#64748B" }}>{label}</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color, fontFamily: "var(--font-mono)" }}>{value}</span>
      </div>
      <div style={{ height: 4, background: "#F1F5F9", borderRadius: 100 }}>
        <div style={{ height: "100%", width: `${(value / max) * 100}%`, background: color, borderRadius: 100, transition: "width 0.5s" }} />
      </div>
    </div>
  );
}

function tokenToPages(ctx: string): string | null {
  const m = ctx.match(/^([\d.]+)\s*(K|M)?/i);
  if (!m) return null;
  const num = parseFloat(m[1]);
  const mult = m[2]?.toUpperCase() === "M" ? 1_000_000 : m[2]?.toUpperCase() === "K" ? 1_000 : 1;
  const pages = Math.round((num * mult * 0.75) / 350);
  if (pages >= 10_000) return `~${Math.round(pages / 1000)}k pages A4`;
  if (pages >= 1_000) return `~${(pages / 1000).toFixed(1)}k pages A4`;
  return `~${pages} pages A4`;
}

function RisqueBadge({ niveau }: { niveau: string }) {
  const color = RISQUE_COLORS[niveau] || "#94A3B8";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: color, display: "inline-block" }} />
      {niveau}
    </span>
  );
}

/* ─── PAGE ────────────────────────────────────────────── */
export default function IAPage() {
  const [activeTab, setActiveTab] = useState("modeles");
  const [modelType, setModelType] = useState("Tous");
  const [modelEditeur, setModelEditeur] = useState("Tous");
  const [modelSearch, setModelSearch] = useState("");
  const [showLegacy, setShowLegacy] = useState(false);
  const [usageSecteur, setUsageSecteur] = useState("Tous");
  const [usageType, setUsageType] = useState("Tous");

  const modeles: Modele[] = (ia as { modeles: Modele[] }).modeles || [];
  const risques: Risque[] = (ia as { risques: Risque[] }).risques || [];
  const usages: UsageIA[] = (ia as { usages_ia: UsageIA[] }).usages_ia || [];
  const reglements = (ia as { reglementations: { eu_ai_act: { description: string; timeline: { date: string; etape: string; detail: string }[]; tiers_risque: { niveau: string; couleur: string; description: string; exemples: string[]; consequences: string }[]; obligations_entreprises: string[] }; autres_reglementations: { pays: string; nom: string; description: string; lien?: string }[] } }).reglementations;

  const editeurs = useMemo(() =>
    ["Tous", ...Array.from(new Set(modeles.map(m => m.editeur))).sort()],
  [modeles]);

  const filteredModeles = useMemo(() => {
    const q = modelSearch.toLowerCase();
    return modeles
      .filter(m => {
        if (!showLegacy && m.statut === "legacy") return false;
        if (modelType !== "Tous" && m.type !== modelType) return false;
        if (modelEditeur !== "Tous" && m.editeur !== modelEditeur) return false;
        if (q && !m.nom.toLowerCase().includes(q) && !m.editeur.toLowerCase().includes(q) && !m.tags.some(t => t.toLowerCase().includes(q))) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.statut === "legacy" && b.statut !== "legacy") return 1;
        if (a.statut !== "legacy" && b.statut === "legacy") return -1;
        return b.date_sortie.localeCompare(a.date_sortie);
      });
  }, [modeles, modelType, modelEditeur, modelSearch, showLegacy]);

  const secteurs = useMemo(() => ["Tous", ...Array.from(new Set(usages.map(u => u.secteur)))], [usages]);
  const types = useMemo(() => ["Tous", ...Array.from(new Set(usages.map(u => u.type_ia)))], [usages]);

  const filteredUsages = useMemo(() =>
    usages.filter(u =>
      (usageSecteur === "Tous" || u.secteur === usageSecteur) &&
      (usageType === "Tous" || u.type_ia === usageType)
    ), [usages, usageSecteur, usageType]);

  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 40%, #EDE9FE 100%)",
        padding: "72px 24px 56px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid #DDD6FE",
      }}>
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(124,58,237,0.09)", top: -180, right: -120 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(14,165,233,0.07)", bottom: -100, left: "5%", animationDelay: "7s" }} />
        <div className="orb" style={{ width: 250, height: 250, background: "rgba(244,63,94,0.05)", top: "25%", left: "30%", animationDelay: "14s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-indigo" style={{ marginBottom: 20 }}>🧠 Intelligence Artificielle</span>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 16, maxWidth: 780 }}>
            Tout comprendre sur l&apos;IA —
            <span className="text-gradient"> modèles, risques, réglementations</span>
          </h1>
          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.75, maxWidth: 600, marginBottom: 40 }}>
            Panorama des modèles 2026, cas d&apos;usage en entreprise, risques documentés, AI Act européen et enjeux stratégiques. La référence IA en français.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { n: modeles.length + "+", l: "modèles référencés" },
              { n: risques.length, l: "risques documentés" },
              { n: usages.length + "+", l: "cas d'usage" },
            ].map(({ n, l }) => (
              <div key={l} className="card" style={{ padding: "10px 18px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span className="stat-num" style={{ fontSize: "1.4rem" }}>{n}</span>
                <span style={{ color: "#64748B", fontSize: 12 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TABS ──────────────────────────────────────────── */}
      <div style={{
        position: "sticky", top: 58, zIndex: 40,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 2, overflowX: "auto" }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "14px 20px",
              background: "transparent", border: "none", cursor: "pointer",
              fontSize: 13.5, fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? "#7C3AED" : "#64748B",
              borderBottom: activeTab === tab.id ? "2.5px solid #7C3AED" : "2.5px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap", fontFamily: "inherit",
            }}>
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ───────────────────────────────────────── */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── MODÈLES ─────────────────────────────────────── */}
        {activeTab === "modeles" && (
          <div>
            {/* Note sourçage benchmarks */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 14px", marginBottom: 16, background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A" }}>
              <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
              <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
                <strong>Note sur les benchmarks :</strong> Les scores affichés proviennent des annonces officielles des éditeurs. Les méthodologies varient (pass@1, avec/sans outils, prompts différents) — les comparaisons inter-éditeurs sont indicatives. Les prix sont vérifiés mais évoluent fréquemment ; consultez les pages tarifaires officielles pour les valeurs actuelles.
              </p>
            </div>
            {/* Filtres */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {/* Ligne 1 : recherche + toggle legacy + count */}
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input value={modelSearch} onChange={e => setModelSearch(e.target.value)}
                  placeholder="🔍 Rechercher un modèle, éditeur..."
                  className="input-field" style={{ flex: "0 1 300px" }} />
                <button
                  onClick={() => setShowLegacy(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "7px 13px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12.5, fontWeight: 600, transition: "all 0.15s",
                    border: showLegacy ? "1.5px solid #7C3AED" : "1.5px solid #E2E8F0",
                    background: showLegacy ? "#EDE9FE" : "#F8FAFC",
                    color: showLegacy ? "#7C3AED" : "#94A3B8",
                  }}>
                  <span style={{ fontSize: 11 }}>{showLegacy ? "✓" : "○"}</span>
                  Inclure les archivés
                </button>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>
                  {filteredModeles.length} modèle{filteredModeles.length > 1 ? "s" : ""}
                </span>
              </div>

              {/* Ligne 2 : filtre par type */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 2, whiteSpace: "nowrap" }}>Type</span>
                {MODEL_TYPES.map(t => (
                  <button key={t} onClick={() => setModelType(t)} className={`filter-chip ${modelType === t ? "active" : ""}`}>{t}</button>
                ))}
              </div>

              {/* Ligne 3 : filtre par éditeur */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 2, whiteSpace: "nowrap" }}>Éditeur</span>
                {editeurs.map(e => (
                  <button key={e} onClick={() => setModelEditeur(e)} className={`filter-chip ${modelEditeur === e ? "active" : ""}`}>{e}</button>
                ))}
              </div>
            </div>

            {/* Grille */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
              {filteredModeles.map(m => {
                const ac = ACCES_COLORS[m.acces] || ACCES_COLORS["Hybride"];
                return (
                  <a key={m.id} href={m.lien} target="_blank" rel="noopener noreferrer"
                    className="card" style={{
                      padding: 24, display: "flex", flexDirection: "column", gap: 14, textDecoration: "none",
                      opacity: m.statut === "legacy" ? 0.72 : 1,
                    }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          background: `${m.logo_color}18`, border: `1.5px solid ${m.logo_color}30`,
                        }}>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: m.logo_color, fontFamily: "var(--font-mono)" }}>
                            {m.nom.substring(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: m.logo_color }}>{m.editeur}</p>
                          <p style={{ fontSize: 10.5, color: "#94A3B8" }}>{m.date_sortie}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        {m.statut === "legacy" && (
                          <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 10, fontWeight: 700, background: "#F1F5F9", color: "#64748B", border: "1px solid #CBD5E1", letterSpacing: "0.04em" }}>
                            ARCHIVÉ
                          </span>
                        )}
                        <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 10.5, fontWeight: 600, background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
                          {m.acces}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>{m.type}</span>
                      </div>
                    </div>

                    {/* Titre + description */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>{m.nom}</h3>
                      <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>{m.description}</p>
                    </div>

                    {/* Points forts */}
                    <div>
                      {m.points_forts.slice(0, 3).map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 4 }}>
                          <span style={{ color: "#7C3AED", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.4 }}>{p}</span>
                        </div>
                      ))}
                    </div>

                    {/* Benchmarks classiques MMLU / HumanEval / MATH */}
                    {(m.benchmark_mmlu || m.benchmark_humaneval || m.benchmark_math) && (
                      <div style={{ paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Benchmarks</span>
                          {BENCHMARK_SOURCES[m.id] && (
                            <span style={{
                              fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 100,
                              background: BENCHMARK_SOURCES[m.id] === "officiel" ? "#F0FDF4" : "#FFFBEB",
                              color: BENCHMARK_SOURCES[m.id] === "officiel" ? "#15803D" : "#B45309",
                              border: `1px solid ${BENCHMARK_SOURCES[m.id] === "officiel" ? "#86EFAC" : "#FCD34D"}`,
                            }}>
                              {BENCHMARK_SOURCES[m.id] === "officiel" ? "✓ Officiel" : "~ Estimé"}
                            </span>
                          )}
                        </div>
                        <BenchmarkBar label="MMLU (connaissances)" value={m.benchmark_mmlu} color={m.logo_color} />
                        <BenchmarkBar label="HumanEval (code)" value={m.benchmark_humaneval} color={m.logo_color} />
                        <BenchmarkBar label="MATH" value={m.benchmark_math} color={m.logo_color} />
                      </div>
                    )}
                    {/* Benchmarks agentiques (modèles frontier sans MMLU/HumanEval) */}
                    {!m.benchmark_mmlu && !m.benchmark_humaneval && !m.benchmark_math &&
                     (m.benchmark_swebench_pro || m.benchmark_osworld || m.benchmark_hle) && (
                      <div style={{ paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Benchmarks agentiques</span>
                          <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", border: "1px solid #86EFAC" }}>
                            ✓ Officiel
                          </span>
                        </div>
                        <BenchmarkBar label="SWE-bench Pro (code autonome)" value={m.benchmark_swebench_pro} color={m.logo_color} />
                        <BenchmarkBar label="OSWorld (computer use)" value={m.benchmark_osworld} color={m.logo_color} />
                        <BenchmarkBar label="HLE (raisonnement expert)" value={m.benchmark_hle} color={m.logo_color} />
                      </div>
                    )}

                    {/* Infos pratiques */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {m.context_window && (
                        <div
                          title="Quantité maximale de texte (messages + documents + réponse) traitable en une seule requête. 1 token ≈ 0,75 mot."
                          style={{ fontSize: 11, padding: "6px 10px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", cursor: "help" }}
                        >
                          <div style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>
                            Fenêtre de contexte
                          </div>
                          <span style={{ fontWeight: 700, color: "#0F172A" }}>{m.context_window}</span>
                          {tokenToPages(m.context_window) && (
                            <span style={{ color: "#64748B", marginLeft: 6 }}>— {tokenToPages(m.context_window)}</span>
                          )}
                        </div>
                      )}
                      {m.acces === "Open Source" ? (
                        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: "#F0FDF4", border: "1px solid #86EFAC", color: "#15803D", fontWeight: 600 }}>
                          Gratuit · Open source
                        </span>
                      ) : PRICING_URLS[m.editeur] ? (
                        <a
                          href={PRICING_URLS[m.editeur]}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#7C3AED", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          💰 Tarifs officiels
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      ) : null}
                    </div>
                  </a>
                );
              })}
            </div>

            {filteredModeles.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: "#64748B" }}>
                <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
                <p>Aucun modèle ne correspond à ta recherche.</p>
              </div>
            )}
          </div>
        )}

        {/* ── CAS D'USAGE ─────────────────────────────────── */}
        {activeTab === "usages" && (
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <select value={usageSecteur} onChange={e => setUsageSecteur(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13.5, background: "white", cursor: "pointer", fontFamily: "inherit" }}>
                {secteurs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={usageType} onChange={e => setUsageType(e.target.value)}
                style={{ padding: "9px 12px", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: 13.5, background: "white", cursor: "pointer", fontFamily: "inherit" }}>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>
                {filteredUsages.length} cas
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {filteredUsages.map(u => {
                const mat = MATURITE_COLORS[u.maturite] || MATURITE_COLORS["Émergent"];
                return (
                  <div key={u.id} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className="badge badge-indigo">{u.type_ia}</span>
                        <span className="badge badge-neutral">{u.secteur}</span>
                      </div>
                      <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 10.5, fontWeight: 600, background: mat.bg, color: mat.text, border: `1px solid ${mat.text}30`, flexShrink: 0 }}>
                        {u.maturite}
                      </span>
                    </div>

                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, color: "#0F172A" }}>{u.titre}</h3>
                    <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{u.description}</p>

                    <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 14px", border: "1px solid #DDD6FE" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#5B21B6", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Gains typiques</p>
                      {u.gains_typiques.map((g, i) => (
                        <div key={i} style={{ display: "flex", gap: 6, marginBottom: 3 }}>
                          <span style={{ color: "#7C3AED", fontSize: 11 }}>▸</span>
                          <span style={{ fontSize: 12, color: "#1E293B" }}>{g}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: 11.5, color: "#64748B" }}>
                      <span style={{ fontWeight: 600, color: "#0F172A" }}>Outils : </span>
                      {u.outils_typiques.join(", ")}
                    </div>

                    <p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic", lineHeight: 1.5 }}>{u.exemple_concret}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RISQUES ─────────────────────────────────────── */}
        {activeTab === "risques" && (
          <div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32, maxWidth: 680 }}>
              Les risques liés à l&apos;IA sont réels et documentés. Les connaître est la première étape pour les atténuer.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: 20 }}>
              {risques.map(r => (
                <div key={r.id} className="card" style={{ padding: 26, borderLeft: `3px solid ${r.couleur}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 26 }}>{r.emoji}</span>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16.5, fontWeight: 700, color: "#0F172A" }}>{r.titre}</h3>
                    </div>
                    <RisqueBadge niveau={r.niveau_risque} />
                  </div>

                  <p style={{ fontSize: 13.5, color: "#1E293B", lineHeight: 1.65, marginBottom: 14 }}>{r.description}</p>

                  {/* Exemples concrets */}
                  <div style={{ background: "#FFF1F2", borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: "1px solid #FECDD3" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#BE123C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Exemples concrets</p>
                    {r.exemples_concrets.slice(0, 2).map((e, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                        <span style={{ color: "#E11D48", fontSize: 11, marginTop: 2, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.5 }}>{e}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bonnes pratiques */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Comment atténuer</p>
                    {r.bonnes_pratiques.slice(0, 3).map((bp, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                        <span style={{ color: "#16A34A", fontSize: 11, marginTop: 2, flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: 12, color: "#1E293B", lineHeight: 1.5 }}>{bp}</span>
                      </div>
                    ))}
                  </div>

                  {/* Secteurs exposés */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                    {r.secteurs_exposes.map(s => (
                      <span key={s} className="tag-pill">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RÉGLEMENTATIONS ─────────────────────────────── */}
        {activeTab === "reglementations" && reglements && (
          <div>
            {/* AI Act header */}
            <div className="card" style={{ padding: 32, marginBottom: 32, borderTop: "4px solid #7C3AED" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                <span style={{ fontSize: 36 }}>🇪🇺</span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                    AI Act européen
                  </h2>
                  <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, maxWidth: 700 }}>
                    {reglements.eu_ai_act?.description}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                  Calendrier d&apos;application
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {(reglements.eu_ai_act?.timeline || []).map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 16 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#7C3AED", border: "2px solid #EDE9FE", flexShrink: 0 }} />
                        {i < (reglements.eu_ai_act?.timeline?.length || 0) - 1 && (
                          <div style={{ width: 2, flex: 1, background: "#E2E8F0", margin: "4px 0" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", fontFamily: "var(--font-mono)" }}>{t.date}</span>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A", marginTop: 2 }}>{t.etape}</p>
                        <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5, marginTop: 2 }}>{t.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiers de risque */}
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Les 4 niveaux de risque
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                {(reglements.eu_ai_act?.tiers_risque || []).map((tier, i) => (
                  <div key={i} style={{ border: `2px solid ${tier.couleur}30`, borderRadius: 12, padding: 18, background: `${tier.couleur}08` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 13.5, fontWeight: 700, color: tier.couleur }}>{tier.niveau}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: `${tier.couleur}18`, color: tier.couleur }}>
                        {tier.consequences}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", marginBottom: 10, lineHeight: 1.5 }}>{tier.description}</p>
                    {tier.exemples.slice(0, 3).map((e, ei) => (
                      <div key={ei} style={{ fontSize: 11.5, color: "#1E293B", marginBottom: 3 }}>• {e}</div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Obligations */}
              {reglements.eu_ai_act?.obligations_entreprises && (
                <div style={{ marginTop: 24, background: "#F5F3FF", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#5B21B6", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Obligations pour les entreprises
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
                    {reglements.eu_ai_act.obligations_entreprises.map((o, i) => (
                      <div key={i} style={{ display: "flex", gap: 6, padding: "4px 0" }}>
                        <span style={{ color: "#7C3AED", fontSize: 11, marginTop: 2, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 12.5, color: "#1E293B", lineHeight: 1.4 }}>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Autres réglementations */}
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
              Initiatives mondiales
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
              {(reglements.autres_reglementations || []).map((r, i) => (
                <div key={i} className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span className="badge badge-neutral">{r.pays}</span>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "#0F172A" }}>{r.nom}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{r.description}</p>
                  {r.lien && (
                    <a href={r.lien} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12.5, color: "#7C3AED", fontWeight: 600 }}>
                      En savoir plus →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


      </section>
    </main>
  );
}
