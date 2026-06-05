"use client";
import { useState, useMemo } from "react";
import data from "@/content/cas-usage.json";

const SECTEUR_CONFIG: Record<string, { bg: string; color: string; border: string; emoji: string }> = {
  "Finance":               { bg: "#EEF2FF", color: "#4338CA", border: "rgba(67,56,202,0.15)", emoji: "🏦" },
  "Retail / E-commerce":   { bg: "#F0FDF4", color: "#15803D", border: "rgba(21,128,61,0.15)",  emoji: "🛒" },
  "Industrie":             { bg: "#FFF7ED", color: "#C2410C", border: "rgba(194,65,12,0.15)",  emoji: "🏭" },
  "Santé":                 { bg: "#FFF1F2", color: "#BE123C", border: "rgba(190,18,60,0.15)",  emoji: "🏥" },
  "Télécommunications":    { bg: "#F0FDFA", color: "#0F766E", border: "rgba(15,118,110,0.15)", emoji: "📡" },
  "Transport / Logistique":{ bg: "#FFFBEB", color: "#B45309", border: "rgba(180,83,9,0.15)",   emoji: "🚛" },
  "Énergie":               { bg: "#FDF4FF", color: "#7E22CE", border: "rgba(126,34,206,0.15)", emoji: "⚡" },
  "Marketing":             { bg: "#FFF0F4", color: "#C01A58", border: "rgba(192,26,88,0.15)",  emoji: "📣" },
  "RH":                    { bg: "#EFF6FF", color: "#1D4ED8", border: "rgba(29,78,216,0.15)",  emoji: "👥" },
  "Tourisme":              { bg: "#ECFDF5", color: "#065F46", border: "rgba(6,95,70,0.15)",    emoji: "✈️" },
  "Assurance":             { bg: "#FEF9EE", color: "#92400E", border: "rgba(146,64,14,0.15)",  emoji: "🛡️" },
  "Médias":                { bg: "#FEFCE8", color: "#713F12", border: "rgba(113,63,18,0.15)",  emoji: "📺" },
  "Logistique":            { bg: "#FFF7ED", color: "#9A3412", border: "rgba(154,52,18,0.15)",  emoji: "📦" },
  "Sport":                 { bg: "#F0FDF4", color: "#166534", border: "rgba(22,101,52,0.15)",  emoji: "🏃" },
  "Environnement":         { bg: "#F0FDF4", color: "#065F46", border: "rgba(6,95,70,0.15)",    emoji: "🌍" },
  "Services professionnels":{ bg: "#EFF6FF", color: "#1E40AF", border: "rgba(30,64,175,0.15)", emoji: "⚖️" },
  "Restauration":          { bg: "#FFF7ED", color: "#9A3412", border: "rgba(154,52,18,0.15)",  emoji: "🍽️" },
};

function SecteurBadge({ secteur }: { secteur: string }) {
  const cfg = SECTEUR_CONFIG[secteur] || { bg: "var(--surface-2)", color: "var(--muted)", border: "var(--border)", emoji: "📊" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      <span>{cfg.emoji}</span>{secteur}
    </span>
  );
}

function CasModal({ cas, onClose }: { cas: typeof data.cas[0]; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(6,11,24,0.75)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div style={{ background: "white", borderRadius: 24, maxWidth: 700, width: "100%", maxHeight: "92vh", overflow: "auto", position: "relative" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ padding: "28px 32px 0", position: "sticky", top: 0, background: "white", borderBottom: "1px solid var(--border)", paddingBottom: 20, zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <SecteurBadge secteur={cas.secteur} />
              <span className="badge badge-neutral">{cas.type}</span>
              {cas.featured && <span className="badge badge-amber">⭐ Vedette</span>}
              <span className={`badge ${cas.difficulte === "Avancé" ? "badge-rose" : cas.difficulte === "Intermédiaire" ? "badge-amber" : "badge-teal"}`}>{cas.difficulte}</span>
            </div>
            <button onClick={onClose} style={{ background: "var(--surface-2)", border: "none", width: 32, height: 32, borderRadius: "50%", cursor: "pointer", fontSize: 16, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✕</button>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 800, marginTop: 16, lineHeight: 1.25 }}>{cas.titre}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
            {cas.stack.map(s => <span key={s} className="skill-pill" style={{ fontSize: 11.5 }}>{s}</span>)}
          </div>
        </div>

        <div style={{ padding: "24px 32px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            { icon: "🔍", label: "LE PROBLÈME", content: cas.probleme, bg: "var(--surface-2)", border: "var(--border)", color: "var(--text-2)" },
            { icon: "⚙️", label: "LA SOLUTION", content: cas.solution, bg: "#EEF2FF", border: "rgba(85,88,255,0.15)", color: "var(--text-2)" },
          ].map(({ icon, label, content, bg, border, color }) => (
            <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span>{icon}</span>{label}
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.75, color }}>{content}</p>
            </div>
          ))}

          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span>📊</span>RÉSULTATS MESURABLES
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {cas.resultats.map(r => (
                <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "var(--teal-tint)", border: "1px solid rgba(0,201,167,0.15)", borderRadius: 12 }}>
                  <span style={{ color: "var(--teal)", fontWeight: 700, flexShrink: 0, fontSize: 15 }}>✓</span>
                  <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span>💡</span>POINTS CLÉS
            </p>
            {cas.points_cles.map(p => (
              <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "var(--indigo-tint)", border: "1px solid rgba(85,88,255,0.12)", borderRadius: 12, marginBottom: 8 }}>
                <span style={{ color: "var(--indigo)", fontWeight: 700, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CasUsagePage() {
  const [search, setSearch] = useState("");
  const [secteur, setSecteur] = useState("Tous");
  const [type, setType] = useState("Tous");
  const [difficulte, setDifficulte] = useState("Toutes");
  const [selected, setSelected] = useState<typeof data.cas[0] | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.cas.filter(c => {
      if (q && !c.titre.toLowerCase().includes(q) && !c.secteur.toLowerCase().includes(q) && !c.type.toLowerCase().includes(q) && !c.stack.some(s => s.toLowerCase().includes(q))) return false;
      if (secteur !== "Tous" && c.secteur !== secteur) return false;
      if (type !== "Tous" && c.type !== type) return false;
      if (difficulte !== "Toutes" && c.difficulte !== difficulte) return false;
      return true;
    });
  }, [search, secteur, type, difficulte]);

  const featured = useMemo(() => data.cas.filter(c => c.featured), []);
  const isFiltering = search || secteur !== "Tous" || type !== "Tous" || difficulte !== "Toutes";

  return (
    <main>
      {/* Hero */}
      <section style={{ background: "var(--navy)", padding: "72px 24px 56px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 500, height: 500, background: "rgba(0,201,167,0.12)", top: -150, right: -80 }} />
        <div className="mesh-orb" style={{ width: 400, height: 400, background: "rgba(85,88,255,0.1)", bottom: -100, left: "20%", animationDelay: "4s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>💼 Bibliothèque terrain</span>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 14, maxWidth: 700 }}>
            Cas d&apos;usage <span className="text-gradient">data réels</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
            {data.cas.length} projets documentés avec le problème réel, la solution technique complète, la stack utilisée et les résultats mesurables.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { n: data.cas.length, l: "cas documentés" },
              { n: data.secteurs.length, l: "secteurs couverts" },
              { n: data.types.length, l: "types de projets" },
            ].map(({ n, l }) => (
              <div key={l} className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <span className="stat-num" style={{ fontSize: "1.7rem" }}>{n}</span>
                <span style={{ color: "#94A3B8", fontSize: 12 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres */}
      <div style={{ position: "sticky", top: 58, zIndex: 40, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher par secteur, techno, type..."
            className="input-field" style={{ flex: "1 1 280px", maxWidth: 420 }} />
          {[
            { v: secteur, s: setSecteur, opts: ["Tous", ...data.secteurs] },
            { v: type, s: setType, opts: ["Tous", ...data.types] },
            { v: difficulte, s: setDifficulte, opts: ["Toutes", ...data.niveaux] },
          ].map(({ v, s, opts }, i) => (
            <select key={i} value={v} onChange={e => s(e.target.value)} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13.5, background: "white", cursor: "pointer", fontFamily: "inherit" }}>
              {opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {isFiltering && <button onClick={() => { setSearch(""); setSecteur("Tous"); setType("Tous"); setDifficulte("Toutes"); }} style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}>✕ Réinitialiser</button>}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Contenu */}
      <section style={{ padding: "44px 24px", maxWidth: 1240, margin: "0 auto" }}>
        {/* Vedettes */}
        {!isFiltering && (
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span className="section-label" style={{ marginBottom: 0 }}>Cas vedettes</span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
              {featured.slice(0, 4).map(cas => (
                <button key={cas.id} onClick={() => setSelected(cas)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                  <div className="card-gradient" style={{ padding: 26, background: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      <SecteurBadge secteur={cas.secteur} />
                      <span className="badge badge-amber">⭐ Vedette</span>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, lineHeight: 1.35, marginBottom: 10 }}>{cas.titre}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14 }}>{cas.probleme.substring(0, 120)}...</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                      {cas.stack.slice(0, 4).map(s => <span key={s} className="skill-pill" style={{ fontSize: 11 }}>{s}</span>)}
                    </div>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>Résultats clés</p>
                      {cas.resultats.slice(0, 2).map(r => (
                        <p key={r} style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5, marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}>
                          <span style={{ color: "var(--teal)", fontWeight: 700, flexShrink: 0 }}>✓</span>{r}
                        </p>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tous les cas */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>{isFiltering ? `${filtered.length} résultat${filtered.length > 1 ? "s" : ""}` : "Tous les cas d'usage"}</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {filtered.map(cas => (
              <button key={cas.id} onClick={() => setSelected(cas)} style={{ display: "block", width: "100%", textAlign: "left", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                <div className="card" style={{ padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                    <SecteurBadge secteur={cas.secteur} />
                    <span className={`badge ${cas.difficulte === "Avancé" ? "badge-rose" : cas.difficulte === "Intermédiaire" ? "badge-amber" : "badge-teal"}`} style={{ fontSize: 10 }}>{cas.difficulte}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, lineHeight: 1.35, marginBottom: 8 }}>{cas.titre}</h3>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>{cas.probleme.substring(0, 90)}...</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    {cas.stack.slice(0, 3).map(s => <span key={s} className="skill-pill" style={{ fontSize: 10.5 }}>{s}</span>)}
                    {cas.stack.length > 3 && <span className="skill-pill" style={{ fontSize: 10.5, opacity: 0.5 }}>+{cas.stack.length - 3}</span>}
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "var(--indigo)", display: "flex", alignItems: "center", gap: 4 }}>
                    Voir le cas complet <span>→</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 16 }}>Aucun cas ne correspond à ta recherche.</p>
            </div>
          )}
        </div>
      </section>

      {selected && <CasModal cas={selected} onClose={() => setSelected(null)} />}

      {/* CTA */}
      <section style={{ background: "var(--navy)", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 300, height: 300, background: "rgba(85,88,255,0.15)", top: -80, right: 80 }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="display-md" style={{ color: "#0F172A", marginBottom: 12 }}>Tu as un cas à partager ?</h2>
          <p style={{ color: "#64748B", marginBottom: 28, fontSize: 16 }}>Partage ton projet avec la communauté et inspire d&apos;autres data professionals.</p>
          <a href="/communaute" className="btn-primary" style={{ display: "inline-flex" }}>Partager dans la communauté →</a>
        </div>
      </section>
    </main>
  );
}
