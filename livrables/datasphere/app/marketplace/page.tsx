import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Data Universe Talent — Déposez votre CV Data & IA | Data Universe",
  description: "Mettez votre profil data en visibilité auprès de recruteurs et chasseurs de têtes spécialisés. Dépôt gratuit, commission uniquement en cas d'embauche validée.",
};

const ETAPES = [
  {
    n: "01",
    titre: "Tu déposes ton profil",
    desc: "CV + quelques informations sur ta recherche. Gratuit, aucune obligation, tu restes maître de ta visibilité.",
    emoji: "📄",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    n: "02",
    titre: "Nous sélectionnons les opportunités",
    desc: "Nous identifions les recruteurs et chasseurs de têtes dont les postes correspondent à ton profil. Aucun spam, des contacts qualifiés uniquement.",
    emoji: "🎯",
    color: "#0E7490",
    bg: "#ECFEFF",
  },
  {
    n: "03",
    titre: "Tu valides avant tout contact",
    desc: "Nous ne partageons ton profil qu'avec ton accord explicite. Tu restes décisionnaire à chaque étape.",
    emoji: "✅",
    color: "#15803D",
    bg: "#F0FDF4",
  },
  {
    n: "04",
    titre: "Commission en cas d'embauche",
    desc: "Si le contact aboutit à une embauche avec CDI validé, une commission est versée par le recruteur. Aucun frais pour toi, jamais.",
    emoji: "🤝",
    color: "#B45309",
    bg: "#FFFBEB",
  },
];

const PROFILS = [
  { titre: "Data Engineer", tags: ["Python", "Spark", "dbt", "SQL", "Airflow"], demande: "Très forte" },
  { titre: "Data Scientist", tags: ["Python", "ML", "PyTorch", "Statistics"], demande: "Forte" },
  { titre: "Analytics Engineer", tags: ["dbt", "SQL", "Looker", "Snowflake"], demande: "Très forte" },
  { titre: "ML Engineer / MLOps", tags: ["Python", "Docker", "MLflow", "CI/CD"], demande: "Très forte" },
  { titre: "Data Analyst", tags: ["SQL", "Power BI", "Excel", "Python"], demande: "Forte" },
  { titre: "Data Architect", tags: ["Architecture", "Databricks", "Cloud", "Gouvernance"], demande: "Forte" },
];

export default function MarketplacePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #0B0F29 0%, #1a0a3c 60%, #0f1a3c 100%)",
        padding: "72px 24px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(124,58,237,0.25)", top: -150, right: "0%" }} />
        <div className="orb" style={{ width: 350, height: 350, background: "rgba(14,116,144,0.15)", bottom: -100, left: "5%", animationDelay: "6s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#A78BFA", display: "inline-block", animation: "pulse-glow 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase" }}>Data Universe Talent · Bêta</span>
              </div>

              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", fontWeight: 800, color: "#fff", lineHeight: 1.08, letterSpacing: "-0.03em", marginBottom: 18 }}>
                Ton prochain poste data<br />
                <span style={{ background: "linear-gradient(135deg, #A78BFA, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  vient à toi.
                </span>
              </h1>

              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
                Dépose ton profil une fois. Nous le mettons en visibilité auprès de recruteurs spécialisés data & IA. Gratuit pour toi — commission uniquement si embauche validée.
              </p>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="#deposer" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 28px", borderRadius: 10,
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  color: "#fff", fontSize: 15, fontWeight: 700,
                  textDecoration: "none", fontFamily: "var(--font-display)",
                  boxShadow: "0 4px 20px rgba(124,58,237,0.45)",
                }}>
                  Déposer mon CV gratuitement →
                </a>
                <a href="#comment-ca-marche" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 22px", borderRadius: 10,
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.75)", fontSize: 14.5, fontWeight: 600,
                  textDecoration: "none",
                }}>
                  Comment ça marche ?
                </a>
              </div>

              <div style={{ display: "flex", gap: 32, marginTop: 40, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {[
                  { n: "100%", l: "gratuit pour le candidat" },
                  { n: "48h", l: "délai de mise en relation" },
                  { n: "0€", l: "de frais si pas d'embauche" },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "#A78BFA" }}>{s.n}</div>
                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profils en demande */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Profils les plus recherchés</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PROFILS.map(p => (
                  <div key={p.titre} style={{ padding: "14px 18px", background: "rgba(255,255,255,0.06)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{p.titre}</p>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {p.tags.map(t => (
                          <span key={t} style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, background: "rgba(124,58,237,0.25)", color: "#C4B5FD", fontFamily: "var(--font-mono)" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{
                      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0,
                      background: p.demande === "Très forte" ? "rgba(190,18,60,0.2)" : "rgba(14,116,144,0.2)",
                      color: p.demande === "Très forte" ? "#FDA4AF" : "#67E8F9",
                      border: `1px solid ${p.demande === "Très forte" ? "rgba(190,18,60,0.3)" : "rgba(14,116,144,0.3)"}`,
                    }}>
                      {p.demande}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" style={{ padding: "72px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="section-label">Processus</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 10 }}>Comment ça marche ?</h2>
            <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 520, margin: "0 auto" }}>Simple, transparent, sans engagement de ta part.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {ETAPES.map(e => (
              <div key={e.n} style={{ padding: "28px 24px", background: e.bg, borderRadius: 18, border: `1px solid ${e.color}20` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: `${e.color}40` }}>{e.n}</span>
                  <span style={{ fontSize: 26 }}>{e.emoji}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 800, color: "#0F172A", marginBottom: 8, lineHeight: 1.3 }}>{e.titre}</h3>
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de dépôt */}
      <section id="deposer" style={{ padding: "72px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span className="section-label">Dépôt de profil</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, marginBottom: 10 }}>Déposer mon profil</h2>
            <p style={{ fontSize: 14.5, color: "var(--muted)" }}>Gratuit · Sans engagement · Supprimable à tout moment</p>
          </div>

          <div className="card" style={{ padding: "36px 40px" }}>
            <form style={{ display: "flex", flexDirection: "column", gap: 22 }}>

              {/* Identité */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                    Prénom <span style={{ color: "var(--rose)" }}>*</span>
                  </label>
                  <input type="text" placeholder="Prijan" required style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                    Nom <span style={{ color: "var(--rose)" }}>*</span>
                  </label>
                  <input type="text" placeholder="Dupont" required style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Email + LinkedIn */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                  Email professionnel <span style={{ color: "var(--rose)" }}>*</span>
                </label>
                <input type="email" placeholder="prenom.nom@email.fr" required style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                  URL LinkedIn
                </label>
                <input type="url" placeholder="https://linkedin.com/in/..." style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Métier + XP */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                    Métier visé <span style={{ color: "var(--rose)" }}>*</span>
                  </label>
                  <select required style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                    <option value="">Choisir…</option>
                    <option>Data Engineer</option>
                    <option>Data Scientist</option>
                    <option>Analytics Engineer</option>
                    <option>ML Engineer / MLOps</option>
                    <option>Data Analyst</option>
                    <option>Data Architect</option>
                    <option>Chief Data Officer</option>
                    <option>Product Owner Data</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                    Années d&apos;expérience
                  </label>
                  <select style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                    <option>Moins de 2 ans</option>
                    <option>2 à 5 ans</option>
                    <option>5 à 10 ans</option>
                    <option>Plus de 10 ans</option>
                  </select>
                </div>
              </div>

              {/* Localisation + Remote */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>Ville</label>
                  <input type="text" placeholder="Paris, Lyon, Bordeaux…" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>Remote</label>
                  <select style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                    <option>Hybride (2-3j/semaine)</option>
                    <option>Full remote</option>
                    <option>Présentiel uniquement</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>

              {/* Disponibilité */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>
                  Disponibilité
                </label>
                <select style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}>
                  <option>Immédiate</option>
                  <option>Dans 1 mois</option>
                  <option>Dans 2 à 3 mois</option>
                  <option>Je suis en veille passive</option>
                </select>
              </div>

              {/* Message libre */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 8 }}>Ce que tu recherches</label>
                <textarea rows={3} placeholder="Type de poste, secteur préféré, contraintes particulières…" style={{ width: "100%", padding: "11px 16px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, background: "var(--surface)", color: "var(--text)", fontFamily: "inherit", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              {/* Séparateur RGPD */}
              <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.09em", color: "var(--muted)" }}>Consentement &amp; confidentialité (RGPD)</p>

              {/* Consentements */}
              {[
                {
                  id: "consent-storage",
                  required: true,
                  label: "J'accepte que Data Universe conserve mes données personnelles (nom, email, profil) pendant une durée maximale de 2 ans, dans le but de faciliter la mise en relation avec des recruteurs spécialisés data. *",
                },
                {
                  id: "consent-share",
                  required: true,
                  label: "J'accepte que Data Universe partage mon profil (avec mon accord préalable à chaque partage) avec des recruteurs ou chasseurs de têtes partenaires, dans le cadre d'une mise en relation ciblée. *",
                },
                {
                  id: "consent-model",
                  required: true,
                  label: "Je comprends que Data Universe perçoit une commission auprès du recruteur en cas d'embauche validée (CDI signé). Cette commission n'est jamais à ma charge. *",
                },
                {
                  id: "consent-rights",
                  required: false,
                  label: "Je reconnais avoir pris connaissance de mes droits RGPD : accès, rectification, suppression, portabilité et opposition, exerc,ables à tout moment via Data Universe.fr/confidentialite ou par email à contact@Data Universe.fr.",
                },
              ].map(c => (
                <label key={c.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" required={c.required} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, accentColor: "var(--indigo)", cursor: "pointer" }} />
                  <span style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{c.label}</span>
                </label>
              ))}

              {/* Note légale */}
              <div style={{ padding: "14px 16px", background: "var(--indigo-tint)", borderRadius: 10, border: "1px solid var(--indigo-border)" }}>
                <p style={{ fontSize: 12.5, color: "#4C1D95", lineHeight: 1.65 }}>
                  <strong>Vos données ne seront jamais vendues.</strong> Conformément au RGPD, vous pouvez exercer vos droits (accès, rectification, suppression) à tout moment. Durée de conservation : 2 ans. Responsable du traitement : Data Universe · contact@Data Universe.fr
                </p>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: "center", fontSize: 15, padding: "14px 0" }}>
                Soumettre mon profil gratuitement →
              </button>

              <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", lineHeight: 1.5 }}>
                En soumettant ce formulaire, vous n&apos;avez aucune obligation de répondre aux mises en relation proposées. Suppression possible à tout moment en nous contactant.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ légale */}
      <section style={{ padding: "64px 24px", background: "var(--bg)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 28, textAlign: "center" }}>Questions fréquentes</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                q: "Est-ce vraiment gratuit pour le candidat ?",
                r: "Oui, à 100%. Data Universe ne facture jamais le candidat. Notre rémunération provient uniquement d'une commission versée par le recruteur en cas d'embauche validée (CDI signé après période d'essai).",
              },
              {
                q: "Qui peut voir mon CV ?",
                r: "Personne sans votre accord. Nous vous soumettons d'abord la description du poste et de l'entreprise. Vous décidez si vous voulez que votre profil soit transmis. Pas de diffusion en masse.",
              },
              {
                q: "Combien de temps mes données sont-elles conservées ?",
                r: "2 ans maximum. Au-delà, nous vous envoyons un email pour renouveler votre consentement ou supprimer vos données. Vous pouvez demander la suppression à tout moment sans attendre.",
              },
              {
                q: "Je suis en poste. Puis-je rester en veille discrète ?",
                r: "Oui. Choisissez la disponibilité « Je suis en veille passive ». Votre profil ne sera partagé que pour des opportunités particulièrement pertinentes. Votre employeur actuel ne peut pas consulter votre profil.",
              },
              {
                q: "Comment fonctionne la commission en cas d'embauche ?",
                r: "Si vous êtes embauché via Data Universe Talent, le recruteur nous verse une commission standard de placement (payée par lui, pas par vous). Cela ne change rien à votre salaire ni aux conditions du contrat.",
              },
            ].map(({ q, r }) => (
              <div key={q} className="card" style={{ padding: "20px 24px" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>❓ {q}</p>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7 }}>{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA recruteurs */}
      <section style={{ padding: "56px 24px", background: "var(--surface-2)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>Vous êtes recruteur ?</p>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Accédez aux meilleurs profils data</h3>
          <p style={{ fontSize: 14.5, color: "var(--muted)", marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
            Candidats pré-qualifiés, disponibles et motivés. Commission uniquement en cas de succès. Contactez-nous pour en savoir plus.
          </p>
          <a href="mailto:talent@Data Universe.fr" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Contacter l&apos;équipe Talent →
          </a>
        </div>
      </section>
    </main>
  );
}
