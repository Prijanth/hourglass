import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Design System — Data Universe",
  description: "Palette, typographie, composants et tokens du design system Data Universe.",
};

const COLORS = [
  {
    section: "Primaire — Violet électrique",
    tokens: [
      { name: "--indigo", value: "#7C3AED", label: "Accent principal" },
      { name: "--indigo-hover", value: "#6D28D9", label: "Hover" },
      { name: "--indigo-light", value: "#A78BFA", label: "Light" },
      { name: "--indigo-bright", value: "#8B5CF6", label: "Bright" },
    ],
  },
  {
    section: "Arrière-plans",
    tokens: [
      { name: "--bg", value: "#FFFFFF", label: "Background principal" },
      { name: "--bg-subtle", value: "#F8FAFC", label: "Subtle" },
      { name: "--bg-muted", value: "#F1F5F9", label: "Muted" },
      { name: "--lavender", value: "#F5F3FF", label: "Hero light" },
      { name: "--lavender-2", value: "#EDE9FE", label: "Lavender 2" },
    ],
  },
  {
    section: "Texte",
    tokens: [
      { name: "--text / --ink", value: "#0F172A", label: "Titre principal" },
      { name: "--text-2 / --ink-2", value: "#1E293B", label: "Corps" },
      { name: "--ink-3", value: "#334155", label: "Secondaire" },
      { name: "--muted", value: "#64748B", label: "Atténué" },
      { name: "--faint", value: "#94A3B8", label: "Fantôme" },
    ],
  },
  {
    section: "Utilitaires sémantiques",
    tokens: [
      { name: "--success", value: "#16A34A", label: "Succès" },
      { name: "--warning", value: "#D97706", label: "Avertissement" },
      { name: "--danger", value: "#DC2626", label: "Erreur" },
      { name: "--teal", value: "#0891B2", label: "Secondaire cyan" },
      { name: "--amber", value: "#D97706", label: "Amber" },
      { name: "--rose", value: "#E11D48", label: "Rose" },
    ],
  },
  {
    section: "Bordures & Surfaces",
    tokens: [
      { name: "--border", value: "#E2E8F0", label: "Bordure principale" },
      { name: "--border-2", value: "#CBD5E1", label: "Bordure forte" },
      { name: "--surface", value: "#FFFFFF", label: "Surface carte" },
      { name: "--surface-2", value: "#F8FAFC", label: "Surface 2" },
    ],
  },
];

const TYPE_SCALE = [
  { token: "--text-xs", px: "11px", usage: "Labels, badges, meta" },
  { token: "--text-sm", px: "13px", usage: "Corps secondaire, descriptions" },
  { token: "--text-base", px: "15px", usage: "Corps principal" },
  { token: "--text-lg", px: "17px", usage: "Sous-titres, intro" },
  { token: "--text-xl", px: "21px", usage: "H3, titres de section" },
  { token: "--text-2xl", px: "26px", usage: "H2" },
  { token: "--text-3xl", px: "32px", usage: "H1 sections" },
];

const RADII = [
  { token: "--r-xs", value: "4px", usage: "Tags, skill pills" },
  { token: "--r-sm", value: "8px", usage: "Petits composants" },
  { token: "--r-md", value: "12px", usage: "Boutons, inputs" },
  { token: "--r-lg", value: "18px", usage: "Cartes standard" },
  { token: "--r-xl", value: "24px", usage: "Grandes cartes, sections" },
];

const SHADOWS = [
  { token: "--shadow-xs", value: "0 1px 2px rgba(0,0,0,0.04)", usage: "Élément minimal" },
  { token: "--shadow-sm", value: "0 1px 3px rgba(0,0,0,0.08)", usage: "Composant basique" },
  { token: "--shadow-md", value: "0 4px 12px rgba(0,0,0,0.08)", usage: "Carte hover" },
  { token: "--shadow-blue", value: "0 8px 24px rgba(124,58,237,0.15)", usage: "CTA accent" },
  { token: "--shadow-card", value: "0 0 0 1px var(--border), 0 2px 8px rgba(0,0,0,0.06)", usage: "Carte par défaut" },
];

function ColorSwatch({ name, value, label }: { name: string; value: string; label: string }) {
  const isDark = ["#0F172A", "#1E293B", "#334155", "#0B0F29"].includes(value);
  const isLight = ["#FFFFFF", "#F8FAFC", "#F1F5F9", "#F5F3FF", "#EDE9FE"].includes(value);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{
        width: "100%", height: 56, borderRadius: 10, background: value,
        border: isLight ? "1px solid #E2E8F0" : "none",
        boxShadow: isDark ? "none" : "0 2px 6px rgba(0,0,0,0.08)",
      }} />
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-mono)" }}>{value}</p>
        <p style={{ fontSize: 10, color: "#64748B", marginTop: 1 }}>{label}</p>
        <p style={{ fontSize: 10, color: "#94A3B8", fontFamily: "var(--font-mono)", marginTop: 1 }}>{name}</p>
      </div>
    </div>
  );
}

export default function DesignPage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
        padding: "64px 24px 52px", borderBottom: "1px solid #E2E8F0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(124,58,237,0.06)", top: -100, right: -80, filter: "blur(80px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, fontSize: 13, color: "#94A3B8" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Design System</span>
          </div>
          <span style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)", fontSize: 11, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: 20 }}>
            Référence interne
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Design System<br />
            <span style={{ background: "linear-gradient(90deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Data Universe</span>
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, maxWidth: 540 }}>
            Palette de couleurs, tokens typographiques, composants et utilitaires CSS. Source de vérité unique pour la cohérence visuelle du site.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "52px 24px" }}>

        {/* Sommaire */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 52, display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Couleurs", "Typographie", "Rayons", "Ombres", "Boutons", "Badges", "Cartes", "Inputs"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ fontSize: 13, color: "#7C3AED", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "#F5F3FF", border: "1px solid #DDD6FE", textDecoration: "none" }}>{s}</a>
          ))}
        </div>

        {/* === COULEURS === */}
        <div id="couleurs" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Tokens</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Couleurs</h2>

          {COLORS.map(group => (
            <div key={group.section} style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 14 }}>{group.section}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 16 }}>
                {group.tokens.map(t => (
                  <ColorSwatch key={t.name} {...t} />
                ))}
              </div>
            </div>
          ))}

          {/* Palette complète en bande */}
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 14 }}>Dégradés actifs</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Primaire", css: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
                { name: "Accent violet → cyan", css: "linear-gradient(130deg, #7C3AED 0%, #6D28D9 45%, #0EA5E9 100%)" },
                { name: "Hero light", css: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)" },
                { name: "Progress / timeline", css: "linear-gradient(90deg, #7C3AED, #06B6D4)" },
                { name: "Dark navy", css: "linear-gradient(135deg, #0B0F29, #1E1B4B)" },
              ].map(g => (
                <div key={g.name} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 80, height: 28, borderRadius: 6, background: g.css, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A" }}>{g.name}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "var(--font-mono)", marginLeft: 10 }}>{g.css.slice(0, 50)}…</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === TYPOGRAPHIE === */}
        <div id="typographie" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Tokens</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Typographie</h2>

          {/* Polices */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 36 }}>
            {[
              { var: "--font-display", name: "Syne", role: "Titres, labels, stats", sample: "Data Universe" },
              { var: "--font-body", name: "DM Sans", role: "Corps de texte", sample: "Le meilleur endroit pour apprendre la data en français." },
              { var: "--font-mono", name: "SF Mono / Fira Code", role: "Code, tokens, badges", sample: "SELECT * FROM concepts" },
            ].map(f => (
              <div key={f.var} className="card" style={{ padding: "20px 22px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#94A3B8", marginBottom: 6 }}>{f.var}</p>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 4, fontFamily: f.var === "--font-display" ? "var(--font-display)" : f.var === "--font-mono" ? "var(--font-mono)" : "var(--font-body)" }}>{f.sample}</p>
                <p style={{ fontSize: 12, color: "#64748B" }}>{f.name} — {f.role}</p>
              </div>
            ))}
          </div>

          {/* Échelle */}
          <div className="card" style={{ padding: "24px 28px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 18 }}>Échelle typographique</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TYPE_SCALE.map(t => (
                <div key={t.token} style={{ display: "flex", alignItems: "baseline", gap: 16, paddingBottom: 14, borderBottom: "1px solid #F1F5F9" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#94A3B8", width: 80, flexShrink: 0 }}>{t.token}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "#7C3AED", width: 30, flexShrink: 0 }}>{t.px}</span>
                  <span style={{ fontSize: parseInt(t.px), color: "#0F172A", lineHeight: 1.2, flex: 1 }}>Texte exemple</span>
                  <span style={{ fontSize: 11, color: "#94A3B8", flexShrink: 0 }}>{t.usage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Classes display */}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 14 }}>Classes display responsive</p>
            {[
              { cls: ".display-xl", size: "clamp(2.6rem, 5vw, 4.2rem)", sample: "Display XL" },
              { cls: ".display-lg", size: "clamp(2.1rem, 4vw, 3.4rem)", sample: "Display LG" },
              { cls: ".display-md", size: "clamp(1.6rem, 3vw, 2.4rem)", sample: "Display MD" },
            ].map(d => (
              <div key={d.cls} style={{ marginBottom: 12 }}>
                <p className={d.cls.slice(1)} style={{ color: "#0F172A" }}>{d.sample}</p>
                <p style={{ fontSize: 11, color: "#94A3B8", fontFamily: "var(--font-mono)" }}>{d.cls} — {d.size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === RAYONS === */}
        <div id="rayons" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Tokens</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Rayons de bordure</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
            {RADII.map(r => (
              <div key={r.token} className="card" style={{ padding: "18px 18px" }}>
                <div style={{ width: 48, height: 48, background: "linear-gradient(135deg, #7C3AED, #0EA5E9)", borderRadius: r.value, marginBottom: 12 }} />
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{r.token}</p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#0F172A", marginTop: 2 }}>{r.value}</p>
                <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{r.usage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === OMBRES === */}
        <div id="ombres" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Tokens</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Ombres</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SHADOWS.map(s => (
              <div key={s.token} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 20px", background: "#FAFBFF", borderRadius: 12, border: "1px solid #F1F5F9" }}>
                <div style={{ width: 48, height: 48, background: "#fff", borderRadius: 10, boxShadow: s.value, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>{s.token}</p>
                  <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 3, fontFamily: "var(--font-mono)" }}>{s.value.slice(0, 50)}{s.value.length > 50 ? "…" : ""}</p>
                  <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{s.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === BOUTONS === */}
        <div id="boutons" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Composants</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Boutons</h2>
          <div className="card" style={{ padding: "28px 28px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <button className="btn-primary">Primaire</button>
              <button className="btn-secondary">Secondaire</button>
              <button className="btn-outline">Outline</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { cls: ".btn-primary", desc: "Fond violet dégradé — CTA principal, newsletter, actions majeures" },
                { cls: ".btn-secondary", desc: "Fond blanc, bordure — Action secondaire, lien de retour" },
                { cls: ".btn-outline", desc: "Transparent, bordure indigo — Tertiary, actions contextuelles" },
              ].map(b => (
                <div key={b.cls} style={{ display: "flex", gap: 10, fontSize: 12 }}>
                  <code style={{ color: "#7C3AED", fontFamily: "var(--font-mono)", width: 130, flexShrink: 0 }}>{b.cls}</code>
                  <span style={{ color: "#64748B" }}>{b.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === BADGES === */}
        <div id="badges" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Composants</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Badges & Pills</h2>
          <div className="card" style={{ padding: "28px 28px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              <span className="badge badge-indigo">Indigo</span>
              <span className="badge badge-teal">Teal</span>
              <span className="badge badge-amber">Amber</span>
              <span className="badge badge-success">Succès</span>
              <span className="badge badge-danger">Danger</span>
              <span className="badge badge-rose">Rose</span>
              <span className="badge badge-neutral">Neutre</span>
              <span className="badge badge-dark">Dark</span>
              <span className="badge badge-orange">Orange</span>
              <span className="badge badge-neon">Neon</span>
              <span className="badge badge-neon-indigo">Neon Indigo</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              <span className="skill-pill">Python</span>
              <span className="skill-pill">SQL</span>
              <span className="skill-pill">dbt</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              <span className="tag-pill">ML</span>
              <span className="tag-pill">Data Eng</span>
              <span className="tag-pill">Gouvernance</span>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                { cls: ".badge + variante", desc: "Labels courts, niveaux, catégories" },
                { cls: ".skill-pill", desc: "Compétences techniques, stack" },
                { cls: ".tag-pill", desc: "Tags articles, filtres" },
              ].map(b => (
                <div key={b.cls} style={{ display: "flex", gap: 10, fontSize: 12 }}>
                  <code style={{ color: "#7C3AED", fontFamily: "var(--font-mono)", width: 160, flexShrink: 0 }}>{b.cls}</code>
                  <span style={{ color: "#64748B" }}>{b.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* === CARTES === */}
        <div id="cartes" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Composants</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Cartes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { cls: "card", desc: "Carte standard — hover lift + indigo border" },
              { cls: "card-raised", desc: "Ombre plus marquée — mise en avant" },
              { cls: "card-elevated", desc: "Transition douce — liste d'items" },
              { cls: "card-feature", desc: "Bordure 1.5px, rayon xl — features hero" },
              { cls: "card-gradient", desc: "Alias card — cartes interactives" },
              { cls: "card-accent", desc: "Fond lavande — highlight contextuel" },
            ].map(c => (
              <div key={c.cls} className={c.cls} style={{ padding: "18px 18px" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#7C3AED", marginBottom: 6 }}>.{c.cls}</p>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Section sombre */}
          <div style={{ marginTop: 16, padding: "28px 28px", background: "#0B0F29", borderRadius: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="card-dark" style={{ padding: "18px 18px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#A78BFA", marginBottom: 6 }}>.card-dark</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Glassmorphisme léger sur fond sombre — footer, sections CTA</p>
            </div>
            <div className="card-glass" style={{ padding: "18px 18px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#A78BFA", marginBottom: 6 }}>.card-glass</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>Glassmorphisme fort — overlay modales, highlights sur dark</p>
            </div>
          </div>
        </div>

        {/* === INPUTS === */}
        <div id="inputs" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Composants</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Formulaires</h2>
          <div className="card" style={{ padding: "28px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 6 }}>Champ texte (.input-field)</label>
              <input className="input-field" placeholder="Placeholder exemple…" style={{ maxWidth: 360 }} />
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button className="filter-chip">Tous</button>
              <button className="filter-chip active">Filtré</button>
              <button className="filter-chip">Autre</button>
            </div>
            <p style={{ fontSize: 12, color: "#64748B" }}>.filter-chip / .filter-chip.active — Filtres, tabs, sélecteurs</p>
            <div style={{ height: 1, background: "#F1F5F9" }} />
            <div>
              <div className="progress-bar" style={{ maxWidth: 300 }}>
                <div className="progress-fill" style={{ width: "65%" }} />
              </div>
              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 6 }}>.progress-bar / .progress-fill — Jauge de compétence, progression</p>
            </div>
          </div>
        </div>

        {/* Patterns décoratifs */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Décoratif</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 28 }}>Patterns & utilitaires</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="grid-bg" style={{ height: 80, borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: 4 }}>.grid-bg</span>
            </div>
            <div className="dot-pattern" style={{ height: 80, borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", background: "rgba(255,255,255,0.8)", padding: "2px 8px", borderRadius: 4 }}>.dot-pattern</span>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ padding: "10px 16px", background: "#F5F3FF", borderLeft: "3px solid #7C3AED", borderRadius: "0 10px 10px 0" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#5B21B6" }}>.highlight-box</span>
            </div>
            <div className="sep-gradient" style={{ flex: 1, alignSelf: "center", height: 1 }} />
            <span style={{ fontSize: 12, color: "#94A3B8", alignSelf: "center" }}>.sep-gradient</span>
          </div>
        </div>

        {/* Footer note */}
        <div style={{ padding: "20px 24px", borderRadius: 12, background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
          <p style={{ fontSize: 13, color: "#5B21B6", lineHeight: 1.65 }}>
            <strong>Source of truth :</strong> Tous les tokens sont définis dans{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>app/globals.css</code>.
            Les classes globales (.card, .badge, .btn-primary…) sont consommables directement par className.
            Les styles inline en TSX utilisent les valeurs brutes pour les cas dynamiques (couleurs conditionnelles, calculs JS).
          </p>
        </div>

      </div>
    </main>
  );
}
