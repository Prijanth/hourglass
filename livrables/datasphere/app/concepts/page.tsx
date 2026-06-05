"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import data from "@/content/concepts.json";

const CAT_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string; gradient: string }> = {
  "Machine Learning":       { emoji: "🤖", color: "#5558FF", bg: "#EEEEFF", border: "rgba(85,88,255,0.2)", gradient: "linear-gradient(135deg, #5558FF, #00C9A7)" },
  "Techniques Analytics":   { emoji: "📊", color: "#0F766E", bg: "#E6FAF7", border: "rgba(0,201,167,0.2)", gradient: "linear-gradient(135deg, #00C9A7, #0F766E)" },
  "Cloud":                  { emoji: "☁️", color: "#C2410C", bg: "#FFF7ED", border: "rgba(255,107,53,0.2)", gradient: "linear-gradient(135deg, #FF6B35, #FF9500)" },
  "Gouvernance & Qualité":  { emoji: "🏛️", color: "#7E22CE", bg: "#F5F3FF", border: "rgba(126,34,206,0.2)", gradient: "linear-gradient(135deg, #7E22CE, #5558FF)" },
};

const NIVEAU_CLS: Record<string, string> = {
  "Débutant": "badge-teal",
  "Intermédiaire": "badge-amber",
  "Avancé": "badge-rose",
};

export default function ConceptsPage() {
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Toutes");
  const [niveau, setNiveau] = useState("Tous");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.concepts.filter(c => {
      if (q && !c.titre.toLowerCase().includes(q) && !c.description_courte.toLowerCase().includes(q) && !c.categorie.toLowerCase().includes(q) && !c.tags.some(t => t.toLowerCase().includes(q))) return false;
      if (categorie !== "Toutes" && c.categorie !== categorie) return false;
      if (niveau !== "Tous" && c.niveau !== niveau) return false;
      return true;
    });
  }, [search, categorie, niveau]);

  const grouped = useMemo(() => {
    const g: Record<string, typeof data.concepts> = {};
    filtered.forEach(c => { if (!g[c.categorie]) g[c.categorie] = []; g[c.categorie].push(c); });
    return g;
  }, [filtered]);

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "var(--navy)", padding: "72px 24px 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div className="mesh-orb" style={{ width: 600, height: 600, background: "rgba(85,88,255,0.14)", top: -200, left: -100 }} />
        <div className="mesh-orb" style={{ width: 400, height: 400, background: "rgba(0,201,167,0.09)", bottom: -100, right: "10%", animationDelay: "6s" }} />
        <div className="mesh-orb" style={{ width: 200, height: 200, background: "rgba(255,107,53,0.07)", top: "30%", right: "30%", animationDelay: "3s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>📚 Encyclopédie Data</span>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 14, maxWidth: 740 }}>
            Tous les concepts data<br />
            <span className="text-gradient">expliqués simplement</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 580, lineHeight: 1.7, marginBottom: 36 }}>
            {data.concepts.length} concepts couverts — Machine Learning, Cloud, Techniques Analytics, Gouvernance. Des explications avec des exemples que tout le monde peut comprendre.
          </p>

          {/* Catégories rapides */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[{ id: "Toutes", label: "Tout", emoji: "✦" }, ...Object.entries(CAT_CONFIG).map(([cat, cfg]) => ({ id: cat, label: cat, emoji: cfg.emoji }))].map(({ id, label, emoji }) => (
              <button key={id} onClick={() => setCategorie(id)} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
                borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "inherit",
                background: categorie === id ? "rgba(85,88,255,0.3)" : "rgba(255,255,255,0.07)",
                color: categorie === id ? "var(--indigo-bright)" : "rgba(255,255,255,0.55)",
                fontSize: 13, fontWeight: categorie === id ? 700 : 400,
                borderWidth: "1.5px", borderStyle: "solid",
                borderColor: categorie === id ? "rgba(85,88,255,0.5)" : "rgba(255,255,255,0.1)",
                transition: "all 0.15s",
              }}>
                <span>{emoji}</span>
                <span>{label}</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>
                  ({id === "Toutes" ? data.concepts.length : data.concepts.filter(c => c.categorie === id).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres */}
      <div style={{
        position: "sticky", top: 58, zIndex: 40,
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)", padding: "14px 24px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un concept, technique, outil..."
            className="input-field" style={{ flex: "1 1 300px", maxWidth: 480 }} />
          <select value={niveau} onChange={e => setNiveau(e.target.value)} style={{
            padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)",
            fontSize: 13.5, background: "white", cursor: "pointer", fontFamily: "inherit",
          }}>
            {["Tous", ...data.niveaux].map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          {(search || categorie !== "Toutes" || niveau !== "Tous") && (
            <button onClick={() => { setSearch(""); setCategorie("Toutes"); setNiveau("Tous"); }}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}>
              ✕ Réinitialiser
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
            {filtered.length} concept{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <section style={{ padding: "48px 24px", maxWidth: 1240, margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Aucun concept trouvé</h3>
            <p style={{ fontSize: 14 }}>Propose-le dans la communauté et on l&apos;ajoutera.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 56 }}>
            {Object.entries(grouped).map(([cat, concepts]) => {
              const cfg = CAT_CONFIG[cat] || { emoji: "📁", color: "var(--indigo)", bg: "var(--indigo-tint)", border: "rgba(85,88,255,0.15)", gradient: "linear-gradient(135deg, var(--indigo), var(--teal))" };
              return (
                <div key={cat}>
                  {/* En-tête catégorie */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: cfg.gradient,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 20, flexShrink: 0,
                      boxShadow: `0 4px 20px ${cfg.border}`,
                    }}>
                      {cfg.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800, color: cfg.color }}>{cat}</h2>
                      <p style={{ fontSize: 12, color: "var(--faint)" }}>{concepts.length} concept{concepts.length > 1 ? "s" : ""}</p>
                    </div>
                    <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${cfg.border}, transparent)` }} />
                  </div>

                  {/* Grille */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16 }}>
                    {concepts.map(concept => (
                      <Link key={concept.id} href={`/concepts/${concept.id}`} style={{ display: "block" }}>
                        <div className="card-gradient" style={{ padding: 22, background: "white", height: "100%", display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 24 }}>{concept.emoji}</span>
                              <span className={`badge ${NIVEAU_CLS[concept.niveau] || "badge-neutral"}`} style={{ fontSize: 10 }}>{concept.niveau}</span>
                            </div>
                            <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 100, fontWeight: 500, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: "nowrap" }}>
                              {concept.sous_categorie}
                            </span>
                          </div>
                          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3, marginBottom: 8, color: "var(--text)" }}>{concept.titre}</h3>
                          <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>{concept.description_courte}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {concept.tags.slice(0, 3).map(tag => (
                              <span key={tag} style={{ padding: "3px 8px", borderRadius: 100, fontSize: 10.5, background: "var(--surface-2)", color: "var(--muted)", border: "1px solid var(--border)" }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ background: "var(--navy)", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 300, height: 300, background: "rgba(0,201,167,0.12)", top: -80, left: 100 }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="display-md" style={{ color: "#0F172A", marginBottom: 12 }}>
            Un concept manque dans l&apos;encyclopédie ?
          </h2>
          <p style={{ color: "#64748B", marginBottom: 28, fontSize: 16, lineHeight: 1.7 }}>
            L&apos;encyclopédie grandit en continu. Propose un concept dans la communauté.
          </p>
          <a href="/communaute" className="btn-primary" style={{ display: "inline-flex" }}>
            Proposer un concept →
          </a>
        </div>
      </section>
    </main>
  );
}
