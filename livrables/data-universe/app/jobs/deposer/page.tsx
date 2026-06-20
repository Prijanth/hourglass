"use client";
import { useState } from "react";
import Link from "next/link";

const TYPES_CONTRAT = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];

export default function DeposerOffrePage() {
  const [form, setForm] = useState({
    titre: "", entreprise: "", type_depot: "employeur", cabinet: "", type_contrat: "CDI", lieu: "", remote: false,
    salaire_min: "", salaire_max: "", description: "", competences: "",
    lien_candidature: "", email_contact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          salaire_min: form.salaire_min ? Number(form.salaire_min) : null,
          salaire_max: form.salaire_max ? Number(form.salaire_max) : null,
          competences: form.competences.split(",").map(s => s.trim()).filter(Boolean),
        }),
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

  const inputStyle = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: "1.5px solid #E2E8F0", fontSize: 14, fontFamily: "inherit",
    outline: "none", background: "white", color: "#0F172A",
    boxSizing: "border-box" as const,
  };
  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", color: "#64748B", marginBottom: 7 };

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/jobs" style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 600 }}>← Retour aux offres</Link>
      </div>

      <span className="section-label">Recrutement data</span>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8, lineHeight: 1.2 }}>
        Publier une offre d&apos;emploi
      </h1>
      <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 16 }}>
        Gratuit. Votre offre sera visible après validation sous 24h. Touchez directement notre communauté data francophone.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 36, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontWeight: 600 }}>✓ Gratuit</span>
        <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD6FE", fontWeight: 600 }}>✓ Validation sous 24h</span>
        <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "#F0F9FF", color: "#0E7490", border: "1px solid #BAE6FD", fontWeight: 600 }}>✓ Email de confirmation envoyé</span>
        <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, background: "#FFF7ED", color: "#B45309", border: "1px solid #FED7AA", fontWeight: 600 }}>✓ Cabinets de recrutement acceptés</span>
      </div>

      {submitted ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Offre reçue !
          </h2>
          <div style={{ maxWidth: 480, margin: "0 auto 28px", display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7 }}>
              Votre offre est en cours d&apos;examen. Voici ce qui se passe ensuite :
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
              {[
                { n: "1", t: "Email de confirmation", d: "Vous allez recevoir un email récapitulatif à l'adresse fournie." },
                { n: "2", t: "Modération sous 24h", d: "L'offre est relue manuellement pour garantir la qualité." },
                { n: "3", t: "Publication + lien", d: "Un second email vous envoie le lien direct vers votre offre publiée." },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 12, padding: "12px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#7C3AED", color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 2 }}>{s.t}</p>
                    <p style={{ fontSize: 12, color: "#64748B" }}>{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/jobs" className="btn-primary">Voir le job board →</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Type de dépôt */}
          <div>
            <label style={labelStyle}>Vous déposez en tant que</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { id: "employeur", label: "Employeur direct", sub: "Je recrute pour mon entreprise" },
                { id: "cabinet", label: "Cabinet de recrutement", sub: "Je recrute pour un client" },
              ].map(opt => (
                <button key={opt.id} type="button" onClick={() => set("type_depot", opt.id)} style={{
                  flex: 1, padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                  border: `2px solid ${form.type_depot === opt.id ? "#7C3AED" : "#E2E8F0"}`,
                  background: form.type_depot === opt.id ? "#EDE9FE" : "white",
                  textAlign: "left", fontFamily: "inherit",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: form.type_depot === opt.id ? "#7C3AED" : "#0F172A", marginBottom: 2 }}>{opt.label}</div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Titre du poste <span style={{ color: "#BE123C" }}>*</span></label>
              <input style={inputStyle} value={form.titre} onChange={e => set("titre", e.target.value)} placeholder="Data Engineer Senior" required />
            </div>
            <div>
              <label style={labelStyle}>{form.type_depot === "cabinet" ? "Entreprise cliente (ou 'Confidentiel')" : "Entreprise"} <span style={{ color: "#BE123C" }}>*</span></label>
              <input style={inputStyle} value={form.entreprise} onChange={e => set("entreprise", e.target.value)} placeholder={form.type_depot === "cabinet" ? "Confidentiel" : "Acme Corp"} required />
            </div>
          </div>

          {form.type_depot === "cabinet" && (
            <div>
              <label style={labelStyle}>Nom du cabinet <span style={{ color: "#BE123C" }}>*</span></label>
              <input style={inputStyle} value={form.cabinet} onChange={e => set("cabinet", e.target.value)} placeholder="Cabinet XYZ Recrutement" required={form.type_depot === "cabinet"} />
              <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 6 }}>Affiché sur l&apos;offre. L&apos;entreprise cliente peut rester confidentielle.</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Type de contrat <span style={{ color: "#BE123C" }}>*</span></label>
              <select style={{ ...inputStyle }} value={form.type_contrat} onChange={e => set("type_contrat", e.target.value)}>
                {TYPES_CONTRAT.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Ville <span style={{ color: "#BE123C" }}>*</span></label>
              <input style={inputStyle} value={form.lieu} onChange={e => set("lieu", e.target.value)} placeholder="Paris" required />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 2 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#475569", fontWeight: 500 }}>
                <input type="checkbox" checked={form.remote} onChange={e => set("remote", e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--indigo)", cursor: "pointer" }} />
                Full remote possible
              </label>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={labelStyle}>Salaire min (k€/an)</label>
              <input style={inputStyle} type="number" value={form.salaire_min} onChange={e => set("salaire_min", e.target.value)} placeholder="45" min="0" max="300" />
            </div>
            <div>
              <label style={labelStyle}>Salaire max (k€/an)</label>
              <input style={inputStyle} type="number" value={form.salaire_max} onChange={e => set("salaire_max", e.target.value)} placeholder="65" min="0" max="300" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description du poste <span style={{ color: "#BE123C" }}>*</span></label>
            <textarea
              style={{ ...inputStyle, minHeight: 150, resize: "vertical" }}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Décrivez le poste, les missions, le contexte de l'équipe et le profil recherché..."
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Compétences recherchées</label>
            <input style={inputStyle} value={form.competences} onChange={e => set("competences", e.target.value)} placeholder="Python, SQL, dbt, Spark, Airflow (séparées par des virgules)" />
          </div>

          <div>
            <label style={labelStyle}>Lien pour postuler</label>
            <input style={inputStyle} type="url" value={form.lien_candidature} onChange={e => set("lien_candidature", e.target.value)} placeholder="https://careers.entreprise.com/job/123" />
          </div>

          <div>
            <label style={labelStyle}>Email de contact <span style={{ color: "#BE123C" }}>*</span></label>
            <input style={inputStyle} type="email" value={form.email_contact} onChange={e => set("email_contact", e.target.value)} placeholder="recrutement@entreprise.com" required />
            <p style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 6 }}>Utilisé uniquement pour la validation et l&apos;envoi du lien de publication. Non visible publiquement.</p>
          </div>

          {error && <p style={{ fontSize: 13, color: "#BE123C", background: "#FFF1F2", padding: "10px 14px", borderRadius: 8, border: "1px solid #FECDD3" }}>{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary" style={{ justifyContent: "center", opacity: submitting ? 0.7 : 1, marginTop: 4 }}>
            {submitting ? "Envoi en cours..." : "Soumettre l'offre gratuitement →"}
          </button>

          <p style={{ fontSize: 11.5, color: "#94A3B8", textAlign: "center", lineHeight: 1.6 }}>
            Publication gratuite · Offre validée sous 24h · Email de confirmation envoyé · Conforme RGPD
          </p>
        </form>
      )}
    </main>
  );
}
