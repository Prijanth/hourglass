"use client";
import { useState } from "react";

const THEMES = [
  { emoji: "🤖", titre: "IA & LLMs",         desc: "Les avancées concrètes en IA générative, nouveaux modèles et cas d'usage réels chaque semaine." },
  { emoji: "⚙️", titre: "Data Engineering",   desc: "dbt, Spark, Kafka, Delta Lake, pipelines — ce que les Data Engineers doivent savoir." },
  { emoji: "☁️", titre: "Cloud Data",         desc: "AWS, Azure, GCP : nouveaux services, patterns d'architecture et comparatifs objectifs." },
  { emoji: "💼", titre: "Marché & Carrière",  desc: "Salaires, certifications, compétences demandées et conseils pour progresser." },
  { emoji: "🏛️", titre: "Gouvernance & Réglementation", desc: "RGPD, taxonomie ESG, Bâle IV — les obligations réglementaires expliquées simplement." },
];

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [prenom, setPrenom] = useState("");
  const [frequence, setFrequence] = useState("hebdo");
  const [niveau, setNiveau] = useState("pro");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) { setError("Adresse email invalide."); return; }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, prenom, frequence, niveau }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erreur. Réessaie."); return; }
      setSubmitted(true);
    } catch {
      setError("Erreur réseau. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      {/* Hero full-screen */}
      <section style={{
        background: "var(--navy)",
        padding: "90px 24px 80px",
        position: "relative", overflow: "hidden",
        textAlign: "center",
      }}>
        <div className="mesh-orb" style={{ width: 600, height: 600, background: "rgba(85,88,255,0.16)", top: -200, left: "50%", transform: "translateX(-50%)" }} />
        <div className="mesh-orb" style={{ width: 350, height: 350, background: "rgba(0,201,167,0.1)", bottom: -100, left: "10%", animationDelay: "5s" }} />
        <div className="mesh-orb" style={{ width: 250, height: 250, background: "rgba(255,107,53,0.08)", top: "20%", right: "8%", animationDelay: "9s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 100, background: "rgba(85,88,255,0.15)", border: "1px solid rgba(85,88,255,0.3)", marginBottom: 24 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--indigo-bright)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Newsletter gratuite</span>
          </div>

          <h1 className="display-xl" style={{ color: "#0F172A", marginBottom: 18 }}>
            La data & l&apos;IA<br />
            <span className="text-gradient">en français.</span>
          </h1>

          <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.8, maxWidth: 540, margin: "0 auto 44px" }}>
            Chaque semaine, les actualités data & IA les plus importantes — triées, traduites et expliquées par des praticiens français. Chaque terme technique est accompagné d&apos;un exemple concret.
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "🎓", val: "166",   label: "certifications référencées" },
              { icon: "📖", val: "246",   label: "termes dans le glossaire" },
              { icon: "✅", val: "100%",  label: "gratuit, toujours" },
            ].map(({ icon, val, label }) => (
              <div key={label} className="card" style={{ padding: "14px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{icon}</div>
                <div className="stat-num" style={{ fontSize: "1.5rem" }}>{val}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
          {/* Formulaire */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>S&apos;abonner gratuitement</h2>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
              100% gratuit. Désabonnement en un clic. Aucun spam, jamais.
            </p>

            {submitted ? (
              <div style={{ background: "var(--teal-tint)", border: "1.5px solid rgba(0,201,167,0.25)", borderRadius: 20, padding: 36, textAlign: "center" }}>
                <div style={{ fontSize: 52, marginBottom: 16 }}>📬</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", marginBottom: 10 }}>
                  {prenom ? `Merci ${prenom} !` : "Un email t'attend !"}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>
                  Vérifie ta boîte email et clique sur le lien de confirmation. (Pense à vérifier tes spams.)
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 7 }}>Prénom</label>
                  <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Ton prénom" className="input-field" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 7 }}>
                    Email <span style={{ color: "var(--rose)" }}>*</span>
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="prenom@email.fr" required className="input-field" style={{ borderColor: error ? "var(--rose)" : undefined }} />
                  {error && <p style={{ fontSize: 12, color: "var(--rose)", marginTop: 5 }}>{error}</p>}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 10 }}>Mon niveau data</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { id: "debutant", label: "Je débute", sub: "Vocabulaire & bases" },
                      { id: "pro", label: "Professionnel", sub: "Actus & techniques" },
                    ].map(n => (
                      <button key={n.id} type="button" onClick={() => setNiveau(n.id)} style={{
                        flex: 1, padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${niveau === n.id ? "var(--indigo)" : "var(--border)"}`,
                        background: niveau === n.id ? "var(--indigo-tint)" : "white",
                        textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
                      }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: niveau === n.id ? "var(--indigo)" : "var(--text)", marginBottom: 2 }}>{n.label}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{n.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-2)", marginBottom: 10 }}>Fréquence</label>
                  <div style={{ display: "flex", gap: 10 }}>
                    {[
                      { id: "hebdo", label: "Hebdomadaire", sub: "Chaque lundi matin" },
                      { id: "mensuelle", label: "Mensuelle", sub: "Un récap approfondi" },
                    ].map(f => (
                      <button key={f.id} type="button" onClick={() => setFrequence(f.id)} style={{
                        flex: 1, padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${frequence === f.id ? "var(--indigo)" : "var(--border)"}`,
                        background: frequence === f.id ? "var(--indigo-tint)" : "white",
                        textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
                      }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: frequence === f.id ? "var(--indigo)" : "var(--text)", marginBottom: 2 }}>{f.label}</div>
                        <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{f.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ marginTop: 4, justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Inscription..." : "S'abonner gratuitement →"}
                </button>
                <p style={{ fontSize: 11.5, color: "var(--faint)", textAlign: "center", lineHeight: 1.6 }}>
                  Tes données ne seront jamais vendues ni partagées. Promis.
                </p>
              </form>
            )}
          </div>

          {/* Thèmes */}
          <div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, marginBottom: 24 }}>Ce que tu reçois chaque semaine</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {THEMES.map((t, i) => (
                <div key={t.titre} className="card-gradient" style={{ padding: "18px 22px", background: "white", display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--indigo-tint)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                    {t.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 700, marginBottom: 4 }}>{t.titre}</h3>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.65 }}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Aperçu d'une édition complète */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Ce que tu reçois vraiment</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 6 }}>
              Aperçu d&apos;une édition type
            </h2>
            <p style={{ fontSize: 13.5, color: "#64748B" }}>Format hebdomadaire · 4 min de lecture</p>
          </div>

          {/* Email simulé */}
          <div style={{ borderRadius: 20, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>

            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #0B0F29, #1e0a3c)", padding: "28px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(124,58,237,0.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 800, color: "#fff" }}>Data Universe Weekly</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Format hebdomadaire · 4 min de lecture</div>
                </div>
              </div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                📬 dbt expliqué, un pipeline automatisé et 2 actus clés
              </h3>
            </div>

            <div style={{ padding: "28px 32px", background: "#fff", display: "flex", flexDirection: "column", gap: 0 }}>

              {/* Outil de la semaine */}
              <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7C3AED", marginBottom: 14 }}>🔧 Outil de la semaine</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 26 }}>🔧</span>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", marginBottom: 2 }}>dbt Core</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>L&apos;outil qui transforme SQL en pipelines professionnels</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 14 }}>
                  {["SQL versionné avec Git — fini les scripts perdus sur des SharePoints", "Tests automatiques : unicité, non-nullité, cohérence référentielle", "Documentation générée depuis le code — toujours à jour", "Compatible Snowflake, BigQuery, Databricks, PostgreSQL"].map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "#334155" }}>
                      <span style={{ color: "#7C3AED", fontWeight: 700, flexShrink: 0 }}>✓</span>{p}
                    </div>
                  ))}
                </div>
                <div style={{ background: "#F5F3FF", borderRadius: 8, padding: "8px 12px", display: "inline-block", fontSize: 12.5, color: "#6D28D9", marginBottom: 10 }}>
                  🎓 Certification disponible : <strong>dbt Analytics Engineering</strong>
                </div>
                <div><a href="/outils/dbt-core" style={{ fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>Voir la fiche complète →</a></div>
              </div>

              {/* Cas d'usage */}
              <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#0E7490", marginBottom: 14 }}>💡 Cas d&apos;usage</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 14, lineHeight: 1.3 }}>Automatiser le reporting mensuel avec dbt + Airflow</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {[
                    { label: "Contexte", t: "Une équipe finance passe 3 jours/mois à consolider des fichiers Excel éparpillés dans 4 SharePoints.", c: "#64748B" },
                    { label: "Solution", t: "Un modèle dbt agrège toutes les sources en 15 min, déclenché par Airflow le 1er du mois à 7h.", c: "#0E7490" },
                    { label: "Résultat", t: "Le rapport est disponible à 7h15. L'équipe économise 3 jours de travail manuel chaque mois.", c: "#15803D" },
                  ].map(({ label, t, c }) => (
                    <div key={label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: c, minWidth: 58, paddingTop: 2 }}>{label}</span>
                      <span style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6 }}>{t}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#0F1629", borderRadius: 10, padding: "14px 16px", overflow: "auto" }}>
                  <pre style={{ margin: 0, fontSize: 11, color: "#A5B4FC", fontFamily: "monospace", lineHeight: 1.7 }}>{`{{ config(materialized='table', tags=['finance','monthly']) }}

WITH ventes AS (
  SELECT * FROM {{ ref('stg_ventes') }}
  WHERE date_trunc('month', date) = date_trunc('month', current_date - interval '1 month')
)
SELECT region, SUM(montant) AS ca_reel FROM ventes GROUP BY 1`}</pre>
                </div>
              </div>

              {/* Actualités */}
              <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#B45309", marginBottom: 14 }}>📰 Actualités de la semaine</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

                  {/* Actu 1 */}
                  <div style={{ padding: "16px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "3px solid #7C3AED" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 15 }}>🆕</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Databricks lance le Context Engineer Associate</p>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
                      Databricks vient d&apos;ouvrir les inscriptions à une toute nouvelle certification : le <strong>Context Engineer Associate</strong>. Elle valide la capacité à concevoir des systèmes de contexte pour les agents IA — autrement dit, comment alimenter correctement un LLM avec les bonnes données au bon moment pour qu&apos;il prenne de meilleures décisions.
                    </p>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 10 }}>
                      C&apos;est un signal fort : le métier de &ldquo;Context Engineer&rdquo; est en train de s&apos;institutionnaliser. Si tu travailles sur des pipelines RAG ou des agents IA, cette certification va rapidement devenir un marqueur de crédibilité sur le marché.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>Source : Databricks Blog · 6 juin 2026</span>
                      <a href="/outils/databricks" style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>Voir la fiche Databricks →</a>
                    </div>
                  </div>

                  {/* Actu 2 */}
                  <div style={{ padding: "16px 18px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "3px solid #0E7490" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 15 }}>📅</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Snowflake MLOps Engineer Beta — lancement le 15 juin</p>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
                      Dans 6 jours, <strong>SnowPro Advanced : MLOps Engineer</strong> quitte son statut bêta et devient une certification officielle. C&apos;est la 9ème certification du catalogue Snowflake et la première entièrement dédiée au déploiement et monitoring de modèles ML directement dans Snowpark.
                    </p>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 10 }}>
                      Bonne nouvelle pour ceux qui ont passé la bêta : les résultats sont maintenus et la certification sera rétroactivement convertie. Si tu hésitais, c&apos;est le bon moment pour t&apos;inscrire avant que le prix monte.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>Source : Snowflake Training · 5 juin 2026</span>
                      <a href="/outils/snowflake" style={{ fontSize: 12, fontWeight: 600, color: "#0E7490" }}>Voir la fiche Snowflake →</a>
                    </div>
                  </div>

                  {/* Actu 3 */}
                  <div style={{ padding: "16px 18px", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A", borderLeft: "3px solid #D97706" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 15 }}>⚠️</span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>AWS ML Specialty retiré depuis le 31 mars — alternatives</p>
                    </div>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
                      Pour ceux qui n&apos;ont pas encore eu l&apos;info : l&apos;<strong>AWS Certified Machine Learning – Specialty</strong> a officiellement été retiré le 31 mars 2026. AWS le remplace par deux certifications plus précises : <strong>ML Engineer Associate</strong> (déploiement et opérations MLOps) et <strong>AI Practitioner</strong> (fondamentaux IA/ML).
                    </p>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 10 }}>
                      Si tu préparais le ML Specialty, réoriente-toi vers le ML Engineer Associate qui est plus opérationnel et mieux aligné avec les besoins du marché en 2026.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>Source : AWS Certification · mars 2026</span>
                      <a href="/outils/aws" style={{ fontSize: 12, fontWeight: 600, color: "#D97706" }}>Voir les certifs AWS →</a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Définitions */}
              <div style={{ paddingBottom: 24, marginBottom: 24, borderBottom: "1px solid #F1F5F9" }}>
                <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6D28D9", marginBottom: 14 }}>📖 2 définitions à connaître</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                  <div style={{ padding: "14px 16px", background: "#F5F3FF", borderRadius: 12, border: "1px solid #DDD6FE" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#4C1D95", marginBottom: 6 }}>Data Lineage</p>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
                      Le <strong>data lineage</strong> (ou lignée de données) désigne la capacité à tracer le chemin d&apos;une donnée depuis sa source jusqu&apos;à son utilisation finale : d&apos;où vient-elle ? Quelles transformations a-t-elle subies ? Dans quels rapports est-elle utilisée ?
                    </p>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>
                      <strong>Exemple concret :</strong> Si le chiffre d&apos;affaires dans ton dashboard Tableau est faux, le lineage te permet de remonter : Tableau → modèle dbt mart_sales → staging Snowflake → source Salesforce → pour trouver exactement où l&apos;erreur s&apos;est glissée.
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <a href="/glossaire?q=lineage" style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED" }}>Voir dans le glossaire →</a>
                    </div>
                  </div>

                  <div style={{ padding: "14px 16px", background: "#F0FDF4", borderRadius: 12, border: "1px solid #BBF7D0" }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#14532D", marginBottom: 6 }}>Slowly Changing Dimension (SCD)</p>
                    <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 8 }}>
                      Une <strong>Slowly Changing Dimension</strong> est une dimension d&apos;un data warehouse dont les attributs changent lentement dans le temps — par opposition aux faits qui changent en continu. La question centrale : quand un client déménage, garde-t-on l&apos;ancienne adresse pour les ventes passées, ou écrasons-nous la valeur ?
                    </p>
                    <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.65 }}>
                      <strong>Les 3 types principaux :</strong> SCD Type 1 (on écrase — simple mais perte d&apos;historique), SCD Type 2 (on crée une nouvelle ligne avec date de début/fin — le standard), SCD Type 3 (on ajoute une colonne &ldquo;ancienne valeur&rdquo; — compromis).
                    </p>
                    <div style={{ marginTop: 8 }}>
                      <a href="/concepts" style={{ fontSize: 12, fontWeight: 600, color: "#15803D" }}>Explorer les concepts →</a>
                    </div>
                  </div>

                </div>
              </div>

              {/* Tip */}
              <div>
                <p style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: "#0E7490", marginBottom: 12 }}>⚡ Tip de la semaine</p>
                <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, marginBottom: 14 }}>
                  Dans dbt, utilise <code style={{ background: "#F5F3FF", padding: "1px 6px", borderRadius: 4, fontSize: 12, color: "#6D28D9" }}>{"{{ this }}"}</code> dans un modèle incrémental pour référencer la table elle-même. Ça marche quel que soit l&apos;environnement (dev/prod) et tu n&apos;as jamais à écrire le nom de la table en dur. Indispensable pour les modèles qui tournent en production.
                </p>
                <div style={{ background: "#0F1629", borderRadius: 10, padding: "12px 16px" }}>
                  <pre style={{ margin: 0, fontSize: 11, color: "#A5B4FC", fontFamily: "monospace", lineHeight: 1.7 }}>{`{{ config(materialized='incremental', unique_key='event_id') }}

SELECT * FROM {{ ref('stg_events') }}
{% if is_incremental() %}
  -- {{ this }} = la table elle-même, quel que soit l'environnement
  WHERE created_at > (SELECT MAX(created_at) FROM {{ this }})
{% endif %}`}</pre>
                </div>
              </div>

              {/* Footer email */}
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#7C3AED" }}>Data Universe</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>
                  data-universe.fr &nbsp;·&nbsp;
                  <a href="/newsletter/desabonnement" style={{ color: "#94A3B8", textDecoration: "underline" }}>Se désabonner</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA lancement */}
      <section style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <span className="section-label">Lancement en cours</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, margin: "12px 0 16px" }}>
            Sois parmi les premiers abonnés
          </h2>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.75, marginBottom: 32, maxWidth: 480, margin: "0 auto 32px" }}>
            Data Universe vient de lancer. L&apos;encyclopédie, le glossaire et les fiches métiers sont déjà disponibles — la newsletter hebdomadaire arrive juste après. Inscris-toi maintenant et reçois la première édition dès sa publication.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#abonner" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--indigo)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              S&apos;inscrire maintenant →
            </a>
            <a href="mailto:contact@data-universe.fr" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "var(--surface-2)", color: "var(--text-1)", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid var(--border)" }}>
              Partager un retour
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
