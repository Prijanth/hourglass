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
            Chaque semaine, les actualités data & IA les plus importantes — triées, traduites et expliquées par des praticiens français. Zéro jargon inutile.
          </p>

          <div style={{ display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { icon: "👥", val: "2 400+", label: "abonnés" },
              { icon: "📖", val: "52",     label: "éditions" },
              { icon: "⭐", val: "4.8/5",  label: "satisfaction" },
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

      {/* Aperçu d'une édition */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#94A3B8" }}>Ce que tu reçois vraiment</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6 }}>
              Aperçu d&apos;une édition réelle
            </h2>
          </div>
          <div style={{
            borderRadius: 16, border: "1px solid #E2E8F0", background: "#fff",
            overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            {/* Header email */}
            <div style={{ background: "#0B0F29", padding: "20px 28px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED, #0EA5E9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12 }}>DS</span>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>DataSphère — Édition #47</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>Lundi 27 mai 2026 · 5 min de lecture</p>
              </div>
            </div>
            {/* Contenu aperçu */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#7C3AED", marginBottom: 10 }}>🤖 IA & LLMs — Cette semaine</p>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75 }}>
                  <strong>Anthropic publie Claude 4 Opus</strong> — plus rapide et moins cher que GPT-4o sur les tâches de raisonnement long. On a testé les cas d&apos;usage data (génération SQL, analyse de logs, extraction d&apos;entités) : résultats détaillés dans ce numéro.
                </p>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#0E7490", marginBottom: 10 }}>⚙️ Data Engineering</p>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75 }}>
                  <strong>dbt 1.9 sort en GA</strong> — le Semantic Layer est maintenant stable. Ce que ça change concrètement pour les Analytics Engineers qui utilisent encore des métriques ad hoc dans Looker ou Power BI.
                </p>
              </div>
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#B45309", marginBottom: 10 }}>💼 Marché data France</p>
                <p style={{ fontSize: 14, color: "#334155", lineHeight: 1.75 }}>
                  Les offres Data Engineer ont progressé de <strong>+12% en mai 2026</strong> sur Indeed France. LLM/RAG est mentionné dans 34% des offres senior — contre 8% il y a 18 mois. Détail par ville et niveau d&apos;expérience.
                </p>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", fontSize: 12, color: "#64748B", borderLeft: "3px solid #7C3AED" }}>
                Il ne s&apos;agit pas d&apos;un résumé générique — chaque édition est rédigée par un praticien data actif, avec du contexte et des avis, pas juste des liens.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ background: "var(--surface-2)", borderTop: "1px solid var(--border)", padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span className="section-label">Ils nous font confiance</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800 }}>Ce qu&apos;en disent les abonnés</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {[
              { texte: "La meilleure newsletter data en français. Concise, utile, sans bullshit. Je l'attends chaque lundi.", auteur: "Sarah M.", poste: "Data Engineer, BNP Paribas" },
              { texte: "En tant que consultant, DataSphère me permet de rester à jour sans passer des heures à lire des articles en anglais.", auteur: "Thomas R.", poste: "Consultant Senior Data, Capgemini" },
              { texte: "L'encyclopédie et la newsletter forment un duo parfait. Je retrouve toujours ce dont j'ai besoin.", auteur: "Amira K.", poste: "Data Analyst, SNCF" },
              { texte: "J'ai décroché mon premier poste de Data Analyst deux mois après m'être abonné. La section Métiers et les fiches certifications ont été déterminantes pour préparer mes entretiens.", auteur: "Julien F.", poste: "Data Analyst junior, PME e-commerce — abonné depuis 3 mois" },
              { texte: "Je viens du marketing et je ne comprenais rien au jargon de mon équipe data. Après 4 semaines de newsletter, je suis enfin dans la conversation.", auteur: "Margaux D.", poste: "Responsable Marketing digital — débutante en data" },
              { texte: "Le parcours Débuter en data m'a donné une feuille de route claire. J'ai suivi les 5 étapes dans l'ordre et obtenu ma certif Google Data Analytics en 3 mois.", auteur: "Romain T.", poste: "Étudiant reconverti, ex-gestionnaire de patrimoine" },
            ].map(t => (
              <div key={t.auteur} className="card-gradient" style={{ padding: 24, background: "white" }}>
                <div style={{ display: "flex", gap: 1, marginBottom: 14 }}>
                  {"★★★★★".split("").map((s, i) => <span key={i} style={{ color: "var(--amber)", fontSize: 15 }}>{s}</span>)}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: "var(--text-2)", marginBottom: 18, fontStyle: "italic" }}>&ldquo;{t.texte}&rdquo;</p>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700 }}>{t.auteur}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>{t.poste}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
