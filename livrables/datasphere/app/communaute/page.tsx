"use client";
import { useState } from "react";
import Link from "next/link";

const CATEGORIES_FORUM = [
  { id: "ml", label: "Machine Learning", emoji: "🤖", count: null },
  { id: "data-eng", label: "Data Engineering", emoji: "⚙️", count: null },
  { id: "cloud", label: "Cloud & Infra", emoji: "☁️", count: null },
  { id: "carriere", label: "Carrière & Salaires", emoji: "💼", count: null },
  { id: "certifs", label: "Certifications", emoji: "🎓", count: null },
  { id: "outils", label: "Outils & Plateformes", emoji: "🛠️", count: null },
  { id: "gouvernance", label: "Gouvernance & RGPD", emoji: "🏛️", count: null },
  { id: "general", label: "Discussion générale", emoji: "💬", count: null },
];

const MOCK_QUESTIONS = [
  {
    id: "1",
    titre: "XGBoost vs LightGBM : lequel choisir pour un dataset de 5M de lignes ?",
    categorie: "Machine Learning",
    emoji: "🤖",
    auteur: "Marie C.",
    avatar: "MC",
    date: "Il y a 2h",
    vues: 234,
    reponses: 8,
    tags: ["XGBoost", "LightGBM", "Performance"],
    featured: true,
    extrait: "Je travaille sur un projet de scoring crédit avec 5 millions de lignes et 80 features. J'hésite entre XGBoost et LightGBM pour les performances..."
  },
  {
    id: "2",
    titre: "Comment obtenir la certification AWS Data Engineer en 2 mois ?",
    categorie: "Certifications",
    emoji: "🎓",
    auteur: "Karim B.",
    avatar: "KB",
    date: "Il y a 5h",
    vues: 189,
    reponses: 12,
    tags: ["AWS", "Certification", "Plan d'étude"],
    featured: true,
    extrait: "J'ai 2 mois pour préparer la certification AWS Data Engineer Associate. Quelqu'un a des ressources ou un plan d'étude à partager ?"
  },
  {
    id: "3",
    titre: "dbt + Snowflake : gestion des incremental models sur de grosses tables",
    categorie: "Data Engineering",
    emoji: "⚙️",
    auteur: "Sophie L.",
    avatar: "SL",
    date: "Il y a 1j",
    vues: 456,
    reponses: 6,
    tags: ["dbt", "Snowflake", "Incremental"],
    featured: false,
    extrait: "Je rencontre des problèmes de performance avec mes modèles incrementaux dbt sur une table de 2 milliards de lignes dans Snowflake..."
  },
  {
    id: "4",
    titre: "Quel salaire négocier pour un poste de ML Engineer à Paris (5 ans d'XP) ?",
    categorie: "Carrière & Salaires",
    emoji: "💼",
    auteur: "Alex T.",
    avatar: "AT",
    date: "Il y a 2j",
    vues: 892,
    reponses: 23,
    tags: ["Salaire", "ML Engineer", "Paris", "Négociation"],
    featured: false,
    extrait: "J'ai 5 ans d'expérience en ML (NLP, Computer Vision) et je reçois des offres entre 75k et 95k€. Est-ce que c'est le marché réel ?"
  },
  {
    id: "5",
    titre: "Dataiku vs Databricks : retour d'expérience après 6 mois",
    categorie: "Outils & Plateformes",
    emoji: "🛠️",
    auteur: "Nora M.",
    avatar: "NM",
    date: "Il y a 3j",
    vues: 612,
    reponses: 15,
    tags: ["Dataiku", "Databricks", "Comparatif"],
    featured: false,
    extrait: "Après avoir utilisé les deux plateformes sur deux projets différents, voici mon retour honnête sur les forces et faiblesses de chacun..."
  },
];

function AvatarCircle({ initiales, size = 36 }: { initiales: string; size?: number }) {
  const colors = ["#6366F1", "#14B8A6", "#F59E0B", "#F43F5E", "#8B5CF6"];
  const colorIndex = initiales.charCodeAt(0) % colors.length;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: colors[colorIndex],
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#0F172A", fontSize: size * 0.35, fontWeight: 700, flexShrink: 0,
    }}>
      {initiales}
    </div>
  );
}

export default function CommunautePage() {
  const [search, setSearch] = useState("");
  const [categorieActive, setCategorieActive] = useState("Toutes");
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ titre: "", categorie: "", contenu: "", email: "" });
  const [submitted, setSubmitted] = useState(false);

  const filtered = MOCK_QUESTIONS.filter(q => {
    const matchSearch = !search || q.titre.toLowerCase().includes(search.toLowerCase()) || q.extrait.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = categorieActive === "Toutes" || q.categorie === categorieActive;
    return matchSearch && matchCat;
  });

  async function handleSubmitQuestion(e: React.FormEvent) {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  }

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, var(--navy) 0%, #0F1B35 100%)",
        padding: "64px 24px 48px",
        position: "relative", overflow: "hidden",
      }}>
        <div className="mesh-orb" style={{ width: 350, height: 350, background: "var(--indigo)", opacity: 0.12, top: -100, right: -50 }} />
        <div className="mesh-orb" style={{ width: 250, height: 250, background: "var(--teal)", opacity: 0.08, bottom: -60, left: 100, animationDelay: "6s" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-dark" style={{ marginBottom: 16 }}>💬 Communauté</span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0F172A", marginBottom: 12 }}>
            La communauté{" "}
            <span style={{ background: "linear-gradient(90deg, var(--indigo-light), var(--teal))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              data francophone
            </span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, maxWidth: 560, lineHeight: 1.6, marginBottom: 28 }}>
            Pose tes questions, partage tes expériences et apprends des autres professionnels de la data en France.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setShowNewQuestion(true)}
              style={{
                padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                background: "var(--indigo)", color: "#0F172A", fontSize: 14, fontWeight: 700,
                fontFamily: "var(--font-display)", transition: "opacity 0.15s",
              }}
            >
              + Poser une question
            </button>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {[
                { val: "Bientôt", label: "membres" },
                { val: "5", label: "questions exemple" },
                { val: "Lancement", label: "en cours" },
              ].map(({ val, label }) => (
                <div key={label} className="card" style={{ padding: "10px 18px", display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="stat-num" style={{ fontSize: "1.4rem" }}>{val}</span>
                  <span style={{ color: "#64748B", fontSize: 12 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Layout principal */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "240px 1fr", gap: 32 }}>
        {/* Sidebar catégories */}
        <aside>
          <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>Catégories</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[{ id: "Toutes", label: "Toutes les questions", emoji: "📋", count: MOCK_QUESTIONS.length }, ...CATEGORIES_FORUM.map(c => ({ id: c.label, label: c.label, emoji: c.emoji, count: c.count }))].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategorieActive(cat.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                  borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
                  background: categorieActive === cat.id ? "var(--indigo-tint)" : "transparent",
                  color: categorieActive === cat.id ? "var(--indigo)" : "var(--muted)",
                  fontFamily: "inherit", fontSize: 13.5, fontWeight: categorieActive === cat.id ? 600 : 400,
                  transition: "all 0.15s", width: "100%",
                }}
              >
                <span style={{ fontSize: 15 }}>{cat.emoji}</span>
                <span style={{ flex: 1 }}>{cat.label}</span>
                <span style={{ fontSize: 11, opacity: 0.6 }}>{cat.count}</span>
              </button>
            ))}
          </div>

          {/* Rejoindre Discord */}
          <div style={{ marginTop: 24, padding: 16, background: "#5865F2", borderRadius: 12, color: "#0F172A" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🎮</div>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Discord DataSphère</p>
            <p style={{ fontSize: 12, opacity: 0.8, marginBottom: 12 }}>Discute en temps réel avec la communauté</p>
            <a href="#" style={{
              display: "block", textAlign: "center", padding: "8px 12px",
              background: "rgba(255,255,255,0.2)", borderRadius: 8, color: "#0F172A",
              fontSize: 12.5, fontWeight: 600,
            }}>
              Rejoindre →
            </a>
          </div>
        </aside>

        {/* Questions */}
        <div>
          {/* Barre de recherche */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher dans la communauté..."
              style={{
                flex: 1, padding: "10px 16px", borderRadius: 10,
                border: "1px solid var(--border)", fontSize: 14,
                background: "white", outline: "none", fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => setShowNewQuestion(true)}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                background: "var(--indigo)", color: "#0F172A", fontSize: 13.5, fontWeight: 600,
                fontFamily: "inherit", whiteSpace: "nowrap",
              }}
            >
              + Nouvelle question
            </button>
          </div>

          {/* En vedette */}
          {!search && categorieActive === "Toutes" && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span className="badge badge-amber">⭐ En vedette</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
                {MOCK_QUESTIONS.filter(q => q.featured).map(q => (
                  <div key={q.id} className="card" style={{ padding: 20, cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{q.emoji} {q.categorie}</span>
                      <span className="badge badge-amber" style={{ fontSize: 10 }}>Populaire</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 8 }}>{q.titre}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6 }}>{q.extrait.substring(0, 80)}...</p>
                    <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 11.5, color: "var(--faint)" }}>
                      <span>👁 {q.vues}</span>
                      <span>💬 {q.reponses} réponses</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Liste questions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span className="section-label" style={{ marginBottom: 0 }}>
              {categorieActive === "Toutes" ? "Questions récentes" : categorieActive}
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>— {filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {filtered.map((q, i) => (
              <div key={q.id} style={{
                padding: "20px 24px", borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer", transition: "background 0.15s",
                display: "flex", alignItems: "flex-start", gap: 16,
              }}
                className="article-row"
              >
                {/* Stats votes simulés */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0, paddingTop: 4 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: q.reponses > 10 ? "var(--teal-tint)" : "var(--surface-2)", border: `1px solid ${q.reponses > 10 ? "#A7F3D0" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: q.reponses > 10 ? "#0F766E" : "var(--muted)" }}>{q.reponses}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "var(--faint)" }}>rép.</span>
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, marginBottom: 6, color: "var(--text)" }}>{q.titre}</h3>
                  <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{q.extrait.substring(0, 100)}...</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <AvatarCircle initiales={q.avatar} size={22} />
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{q.auteur}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--faint)" }}>•</span>
                    <span style={{ fontSize: 12, color: "var(--faint)" }}>{q.date}</span>
                    <span style={{ fontSize: 11.5, color: "var(--faint)" }}>•</span>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>👁 {q.vues}</span>
                    {q.tags.slice(0, 2).map(tag => (
                      <span key={tag} style={{ padding: "2px 8px", borderRadius: 12, background: "var(--indigo-tint)", color: "var(--indigo)", fontSize: 11, fontWeight: 500 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--muted)" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p>Aucune question ne correspond à ta recherche.</p>
                <button
                  onClick={() => setShowNewQuestion(true)}
                  style={{ marginTop: 16, padding: "8px 20px", borderRadius: 8, border: "none", background: "var(--indigo)", color: "#0F172A", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5 }}
                >
                  Poser cette question en premier
                </button>
              </div>
            )}
          </div>

          {/* Note communauté */}
          <div style={{ marginTop: 24, padding: 20, background: "var(--surface-2)", borderRadius: 12, border: "1px solid var(--border)", textAlign: "center" }}>
            <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6 }}>
              🚀 La communauté DataSphère est en cours de lancement.{" "}
              <Link href="/newsletter" style={{ color: "var(--indigo)", fontWeight: 600 }}>Inscris-toi à la newsletter</Link>{" "}
              pour être notifié des nouvelles fonctionnalités (compte, votes, notifications).
            </p>
          </div>
        </div>
      </div>

      {/* Modal nouvelle question */}
      {showNewQuestion && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => { setShowNewQuestion(false); setSubmitted(false); }}
        >
          <div
            style={{ background: "white", borderRadius: 20, maxWidth: 560, width: "100%", padding: 36 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.2rem" }}>Poser une question</h2>
              <button onClick={() => { setShowNewQuestion(false); setSubmitted(false); }} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--muted)" }}>✕</button>
            </div>

            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 8 }}>Question envoyée !</h3>
                <p style={{ color: "var(--muted)", fontSize: 14 }}>Ta question sera publiée après modération. La communauté va y répondre bientôt.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuestion} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Titre de ta question *</label>
                  <input
                    required
                    value={newQuestion.titre}
                    onChange={e => setNewQuestion(prev => ({ ...prev, titre: e.target.value }))}
                    placeholder="Ex: Comment optimiser un modèle XGBoost sur Databricks ?"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Catégorie *</label>
                  <select
                    required
                    value={newQuestion.categorie}
                    onChange={e => setNewQuestion(prev => ({ ...prev, categorie: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, fontFamily: "inherit", background: "white" }}
                  >
                    <option value="">Choisir une catégorie</option>
                    {CATEGORIES_FORUM.map(c => <option key={c.id} value={c.label}>{c.emoji} {c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Détails *</label>
                  <textarea
                    required
                    value={newQuestion.contenu}
                    onChange={e => setNewQuestion(prev => ({ ...prev, contenu: e.target.value }))}
                    placeholder="Décris ton contexte, ce que tu as déjà essayé, et ce que tu cherches..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, outline: "none", fontFamily: "inherit", resize: "vertical" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Email (pour être notifié des réponses)</label>
                  <input
                    type="email"
                    value={newQuestion.email}
                    onChange={e => setNewQuestion(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="prenom@exemple.fr"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", fontSize: 13.5, outline: "none", fontFamily: "inherit" }}
                  />
                </div>
                <button type="submit" style={{
                  padding: "12px 24px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "var(--indigo)", color: "#0F172A", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)",
                }}>
                  Publier la question
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
