"use client";
import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import data from "@/content/certifications.json";

const ALL_PROFILS = Array.from(
  new Set(data.certifications.flatMap(c => c.recommandee_pour))
).sort();

const NIVEAU_STYLE: Record<string, { cls: string; dot: string }> = {
  "Débutant":       { cls: "badge-teal",   dot: "var(--teal)" },
  "Intermédiaire":  { cls: "badge-amber",  dot: "var(--amber)" },
  "Avancé":         { cls: "badge-rose",   dot: "var(--rose)" },
};

const OUTIL_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  AWS:         { text: "#FF9900", bg: "rgba(255,153,0,0.08)",  border: "rgba(255,153,0,0.2)" },
  Azure:       { text: "#0078D4", bg: "rgba(0,120,212,0.08)",  border: "rgba(0,120,212,0.2)" },
  GCP:         { text: "#4285F4", bg: "rgba(66,133,244,0.08)", border: "rgba(66,133,244,0.2)" },
  Databricks:  { text: "#FF3621", bg: "rgba(255,54,33,0.08)",  border: "rgba(255,54,33,0.2)" },
  Snowflake:   { text: "#29B5E8", bg: "rgba(41,181,232,0.08)", border: "rgba(41,181,232,0.2)" },
  dbt:         { text: "#FF694A", bg: "rgba(255,105,74,0.08)", border: "rgba(255,105,74,0.2)" },
  Dataiku:     { text: "#2AB1AC", bg: "rgba(42,177,172,0.08)", border: "rgba(42,177,172,0.2)" },
  SAS:         { text: "#007CC2", bg: "rgba(0,124,194,0.08)",  border: "rgba(0,124,194,0.2)" },
  "SAS Viya":  { text: "#007CC2", bg: "rgba(0,124,194,0.08)",  border: "rgba(0,124,194,0.2)" },
  Tableau:     { text: "#E97627", bg: "rgba(233,118,39,0.08)", border: "rgba(233,118,39,0.2)" },
  TensorFlow:  { text: "#FF6F00", bg: "rgba(255,111,0,0.08)",  border: "rgba(255,111,0,0.2)" },
};

function DotRating({ value, max = 5, color = "var(--indigo)" }: { value: number; max?: number; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: i < value ? color : "var(--border)",
          transition: "background 0.2s",
        }} />
      ))}
    </div>
  );
}

function CertificationsContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [categorie, setCategorie] = useState("Toutes");
  const [outil, setOutil] = useState("Tous");
  const [niveau, setNiveau] = useState("Tous");
  const [profil, setProfil] = useState("Tous");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data.certifications.filter(c => {
      if (q && !c.nom.toLowerCase().includes(q) && !c.organisme.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q) && !c.competences.some(k => k.toLowerCase().includes(q))) return false;
      if (categorie !== "Toutes" && c.categorie !== categorie) return false;
      if (outil !== "Tous" && c.outil !== outil) return false;
      if (niveau !== "Tous" && c.niveau !== niveau) return false;
      if (profil !== "Tous" && !c.recommandee_pour.includes(profil)) return false;
      return true;
    });
  }, [search, categorie, outil, niveau, profil]);

  const isFiltering = search || categorie !== "Toutes" || outil !== "Tous" || niveau !== "Tous" || profil !== "Tous";

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "var(--navy)",
        padding: "72px 24px 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div className="mesh-orb" style={{ width: 500, height: 500, background: "rgba(85,88,255,0.15)", top: -150, right: -100 }} />
        <div className="mesh-orb" style={{ width: 350, height: 350, background: "rgba(0,201,167,0.1)", bottom: -100, left: "15%", animationDelay: "5s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span className="badge badge-indigo">🎓 Certifications</span>
          </div>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 14, maxWidth: 700 }}>
            Toutes les certifications{" "}
            <span className="text-gradient">data & IA</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
            {data.certifications.length} certifications répertoriées — AWS, Azure, GCP, Databricks, Snowflake, SAS, Dataiku et plus. Avec niveau, durée, coût et popularité marché.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { n: data.certifications.length, l: "certifications" },
              { n: data.outils.length, l: "outils couverts" },
              { n: data.certifications.filter(c => c.cout === "Gratuit").length, l: "gratuites" },
              { n: data.certifications.filter(c => c.niveau === "Débutant").length, l: "niveau débutant" },
            ].map(({ n, l }) => (
              <div key={l} className="card" style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                <span className="stat-num" style={{ fontSize: "1.7rem" }}>{n}</span>
                <span style={{ color: "#94A3B8", fontSize: 12 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres sticky */}
      <div style={{
        position: "sticky", top: 58, zIndex: 40,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 24px",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher une certification, compétence, outil..."
            className="input-field"
            style={{ flex: "1 1 280px", maxWidth: 420 }}
          />
          {[
            { label: "Profil", value: profil, setter: setProfil, options: ["Tous", ...ALL_PROFILS] },
            { label: "Catégorie", value: categorie, setter: setCategorie, options: ["Toutes", ...data.categories] },
            { label: "Outil", value: outil, setter: setOutil, options: ["Tous", ...data.outils] },
            { label: "Niveau", value: niveau, setter: setNiveau, options: ["Tous", ...data.niveaux] },
          ].map(({ label, value, setter, options }) => (
            <select key={label} value={value} onChange={e => setter(e.target.value)} style={{
              padding: "10px 12px", borderRadius: 10, border: "1.5px solid var(--border)",
              fontSize: 13.5, background: "white", cursor: "pointer", fontFamily: "inherit",
              color: value === options[0] ? "var(--muted)" : "var(--text)",
            }}>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
          {isFiltering && (
            <button
              onClick={() => { setSearch(""); setCategorie("Toutes"); setOutil("Tous"); setNiveau("Tous"); setProfil("Tous"); }}
              style={{ padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "white", fontSize: 13, cursor: "pointer", color: "var(--muted)", fontFamily: "inherit" }}
            >
              ✕ Réinitialiser
            </button>
          )}
          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
            {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grille */}
      <section style={{ padding: "44px 24px", maxWidth: 1240, margin: "0 auto" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: 8 }}>Aucune certification trouvée</h3>
            <p style={{ fontSize: 14 }}>Essaie de modifier tes filtres.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
            {filtered.map(cert => {
              const oc = OUTIL_COLORS[cert.outil] || { text: "var(--indigo)", bg: "var(--indigo-tint)", border: "rgba(85,88,255,0.15)" };
              const ns = NIVEAU_STYLE[cert.niveau] || { cls: "badge-neutral", dot: "var(--muted)" };
              return (
                <div key={cert.id} className="card-gradient" style={{ padding: 26, background: "white", display: "flex", flexDirection: "column" }}>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: oc.bg, border: `1.5px solid ${oc.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 800, color: oc.text, fontFamily: "var(--font-mono)" }}>{cert.outil.substring(0, 3)}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 11.5, fontWeight: 600, color: oc.text }}>{cert.organisme}</p>
                        <p style={{ fontSize: 10.5, color: "var(--faint)" }}>{cert.categorie}</p>
                      </div>
                    </div>
                    <span className={`badge ${ns.cls}`}>{cert.niveau}</span>
                  </div>

                  {/* Titre */}
                  <h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.35, marginBottom: 10, color: "var(--text)" }}>
                    {cert.nom}
                  </h3>

                  <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 14, flex: 1 }}>
                    {cert.description}
                  </p>

                  {/* Infos pratiques */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {[
                      { i: "⏱️", v: cert.duree_prep },
                      { i: "💰", v: cert.cout },
                      { i: "📅", v: cert.validite },
                    ].map(({ i, v }) => (
                      <span key={v} style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", background: "var(--surface-2)", borderRadius: 100,
                        fontSize: 11.5, color: "var(--muted)", border: "1px solid var(--border)",
                      }}>
                        <span>{i}</span>{v}
                      </span>
                    ))}
                  </div>

                  {/* Compétences */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
                    {cert.competences.slice(0, 4).map(comp => (
                      <span key={comp} className="skill-pill" style={{ fontSize: 11 }}>{comp}</span>
                    ))}
                    {cert.competences.length > 4 && (
                      <span className="skill-pill" style={{ fontSize: 11, opacity: 0.5 }}>+{cert.competences.length - 4}</span>
                    )}
                  </div>

                  {/* Métriques */}
                  <div style={{ paddingTop: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Popularité marché</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className="progress-fill" style={{ width: `${cert.popularite}%` }} />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--faint)", fontFamily: "var(--font-mono)", minWidth: 28 }}>{cert.popularite}%</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Difficulté</span>
                      <DotRating value={cert.difficulte} color={ns.dot} />
                    </div>
                  </div>

                  {/* Pour qui */}
                  <p style={{ fontSize: 11, color: "var(--faint)", marginBottom: 14, lineHeight: 1.5 }}>
                    <span style={{ fontWeight: 600, color: "var(--text-2)" }}>Recommandée pour :</span> {cert.recommandee_pour.join(", ")}
                  </p>

                  {/* Date vérification */}
                  <p style={{ fontSize: 12, color: "#64748B", marginBottom: 10, display: "flex", alignItems: "center", gap: 5, padding: "5px 8px", background: "#F0FDF4", borderRadius: 8, border: "1px solid #BBF7D0" }}>
                    <span>✅</span> <span style={{ fontWeight: 600, color: "#15803D" }}>Vérifié juin 2026</span> — <a href={cert.lien_officiel} target="_blank" rel="noopener noreferrer" style={{ color: "var(--indigo)", fontWeight: 500 }}>site officiel {cert.organisme}</a>
                  </p>

                  {/* CTA */}
                  <a
                    href={cert.lien_officiel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-lift"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 16px", borderRadius: 10,
                      background: oc.bg, color: oc.text, border: `1.5px solid ${oc.border}`,
                      fontSize: 13, fontWeight: 700,
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    Voir la certification officielle →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA communauté */}
      <section style={{ background: "var(--navy)", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 300, height: 300, background: "rgba(85,88,255,0.15)", top: -80, right: 80 }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="display-md" style={{ color: "#0F172A", marginBottom: 12 }}>
            Tu prépares une certification ?
          </h2>
          <p style={{ color: "#64748B", marginBottom: 28, fontSize: 16, lineHeight: 1.7 }}>
            Rejoins la communauté DataSphère pour partager tes ressources, poser tes questions et te motiver avec d&apos;autres apprenants.
          </p>
          <a href="/communaute" className="btn-primary" style={{ display: "inline-flex" }}>
            Rejoindre la communauté →
          </a>
        </div>
      </section>
    </main>
  );
}

export default function CertificationsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 24px", textAlign: "center", color: "#94A3B8" }}>Chargement…</div>}>
      <CertificationsContent />
    </Suspense>
  );
}
