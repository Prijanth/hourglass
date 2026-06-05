"use client";
import { useState, useMemo } from "react";
import ia from "@/content/ia.json";

/* ─── TYPES ────────────────────────────────────────────── */
interface Modele {
  id: string; nom: string; editeur: string; logo_color: string;
  type: string; acces: string; date_sortie: string; description: string;
  points_forts: string[]; points_faibles: string[];
  context_window?: string; cout_approx?: string;
  cas_usage_phares: string[];
  benchmark_mmlu?: number | null; benchmark_humaneval?: number | null; benchmark_math?: number | null;
  lien: string; tags: string[];
}
interface Risque {
  id: string; titre: string; emoji: string; niveau_risque: string;
  couleur: string; description: string;
  exemples_concrets: string[]; secteurs_exposes: string[];
  bonnes_pratiques: string[]; sources?: string[];
}
interface Enjeu {
  id: string; titre: string; emoji: string; sous_titre: string;
  description: string;
  chiffres_cles: { valeur: string; label: string; source: string }[];
  metiers_menaces?: string[]; metiers_crees?: string[];
  perspective: string; tags: string[];
}
interface UsageIA {
  id: string; titre: string; type_ia: string; secteur: string;
  maturite: string; description: string;
  outils_typiques: string[]; gains_typiques: string[];
  limites: string[]; exemple_concret: string;
}

/* ─── CONSTANTES ──────────────────────────────────────── */
const TABS = [
  { id: "modeles",         label: "Modèles IA",          emoji: "🧠" },
  { id: "usages",          label: "Cas d'usage",          emoji: "💼" },
  { id: "risques",         label: "Risques & Limites",    emoji: "⚠️" },
  { id: "reglementations", label: "Réglementations",      emoji: "📋" },
  { id: "enjeux",          label: "Enjeux & Perspectives", emoji: "🌍" },
];

const MODEL_TYPES = ["Tous", "LLM", "Image", "Code", "Audio", "Vidéo", "Multimodal", "Embarqué"];
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
  const [modelSearch, setModelSearch] = useState("");
  const [usageSecteur, setUsageSecteur] = useState("Tous");
  const [usageType, setUsageType] = useState("Tous");

  const modeles: Modele[] = (ia as { modeles: Modele[] }).modeles || [];
  const risques: Risque[] = (ia as { risques: Risque[] }).risques || [];
  const enjeux: Enjeu[] = (ia as { enjeux: Enjeu[] }).enjeux || [];
  const usages: UsageIA[] = (ia as { usages_ia: UsageIA[] }).usages_ia || [];
  const reglements = (ia as { reglementations: { eu_ai_act: { description: string; timeline: { date: string; etape: string; detail: string }[]; tiers_risque: { niveau: string; couleur: string; description: string; exemples: string[]; consequences: string }[]; obligations_entreprises: string[] }; autres_reglementations: { pays: string; nom: string; description: string; lien?: string }[] } }).reglementations;

  const filteredModeles = useMemo(() =>
    modeles.filter(m => {
      const q = modelSearch.toLowerCase();
      if (modelType !== "Tous" && m.type !== modelType) return false;
      if (q && !m.nom.toLowerCase().includes(q) && !m.editeur.toLowerCase().includes(q) && !m.tags.some(t => t.toLowerCase().includes(q))) return false;
      return true;
    }), [modeles, modelType, modelSearch]);

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
              { n: "5", l: "tiers AI Act" },
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
            {/* Filtres */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap", alignItems: "center" }}>
              <input value={modelSearch} onChange={e => setModelSearch(e.target.value)}
                placeholder="🔍 Rechercher un modèle, éditeur..."
                className="input-field" style={{ flex: "0 1 280px" }} />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {MODEL_TYPES.map(t => (
                  <button key={t} onClick={() => setModelType(t)} className={`filter-chip ${modelType === t ? "active" : ""}`}>{t}</button>
                ))}
              </div>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>
                {filteredModeles.length} modèle{filteredModeles.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Grille */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
              {filteredModeles.map(m => {
                const ac = ACCES_COLORS[m.acces] || ACCES_COLORS["Hybride"];
                return (
                  <a key={m.id} href={m.lien} target="_blank" rel="noopener noreferrer"
                    className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, textDecoration: "none" }}>
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
                        <span style={{ padding: "3px 9px", borderRadius: 100, fontSize: 10.5, fontWeight: 600, background: ac.bg, color: ac.text, border: `1px solid ${ac.border}` }}>
                          {m.acces}
                        </span>
                        <span className="badge badge-neutral" style={{ fontSize: 10 }}>{m.type}</span>
                      </div>
                    </div>

                    {/* Titre + description */}
                    <div>
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

                    {/* Benchmarks */}
                    {(m.benchmark_mmlu || m.benchmark_humaneval || m.benchmark_math) && (
                      <div style={{ paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                        <BenchmarkBar label="MMLU (connaissances)" value={m.benchmark_mmlu} color={m.logo_color} />
                        <BenchmarkBar label="HumanEval (code)" value={m.benchmark_humaneval} color={m.logo_color} />
                        <BenchmarkBar label="MATH" value={m.benchmark_math} color={m.logo_color} />
                      </div>
                    )}

                    {/* Infos pratiques */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {m.context_window && (
                        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B" }}>
                          📐 {m.context_window}
                        </span>
                      )}
                      {m.cout_approx && (
                        <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 100, background: "#F8FAFC", border: "1px solid #E2E8F0", color: "#64748B" }}>
                          💰 {m.cout_approx}
                        </span>
                      )}
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

        {/* ── ENJEUX ──────────────────────────────────────── */}
        {activeTab === "enjeux" && (
          <div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 32, maxWidth: 680 }}>
              L&apos;IA soulève des enjeux stratégiques, économiques, éthiques et environnementaux majeurs. Une lecture nuancée et factuelle.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {enjeux.map(e => (
                <div key={e.id} className="card" style={{ padding: 30 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, alignItems: "start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 28 }}>{e.emoji}</span>
                        <div>
                          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "#0F172A" }}>{e.titre}</h2>
                          <p style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600 }}>{e.sous_titre}</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 14, color: "#1E293B", lineHeight: 1.75, marginBottom: 16 }}>{e.description}</p>
                      <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.7, fontStyle: "italic" }}>{e.perspective}</p>

                      {/* Métiers */}
                      {(e.metiers_menaces || e.metiers_crees) && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                          {e.metiers_menaces && (
                            <div style={{ background: "#FFF1F2", borderRadius: 10, padding: 14 }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: "#BE123C", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Métiers impactés</p>
                              {e.metiers_menaces.slice(0, 5).map((m, i) => <p key={i} style={{ fontSize: 12, color: "#1E293B", marginBottom: 3 }}>• {m}</p>)}
                            </div>
                          )}
                          {e.metiers_crees && (
                            <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 14 }}>
                              <p style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Métiers créés</p>
                              {e.metiers_crees.slice(0, 5).map((m, i) => <p key={i} style={{ fontSize: 12, color: "#1E293B", marginBottom: 3 }}>• {m}</p>)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Chiffres clés */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 200 }}>
                      {e.chiffres_cles.map((c, i) => (
                        <div key={i} style={{ background: "#F5F3FF", borderRadius: 12, padding: "14px 18px", border: "1px solid #DDD6FE" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#5B21B6", lineHeight: 1 }}>{c.valeur}</p>
                          <p style={{ fontSize: 12, color: "#64748B", marginTop: 3, lineHeight: 1.4 }}>{c.label}</p>
                          <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{c.source}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                    {e.tags.map(t => <span key={t} className="tag-pill">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
