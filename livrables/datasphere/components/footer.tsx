"use client";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubscribe() {
    if (!email.includes("@")) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer style={{ background: "#0B0F29", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(14,165,233,0.4), transparent)" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 24px 32px" }}>
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #7C3AED 0%, #0EA5E9 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="white" opacity="0.9"/>
                  <circle cx="8" cy="8" r="6.5" stroke="white" strokeWidth="1" opacity="0.4"/>
                </svg>
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em" }}>
                Data<span style={{ color: "#A78BFA" }}>Sphère</span>
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 290, marginBottom: 18 }}>
              La référence francophone sur la data et l&apos;IA. Encyclopédie, certifications, cas d&apos;usage, glossaire et communauté.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fait en France", "2 400 abonnés"].map(label => (
                <span key={label} style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Contenu</p>
            {[["Actualités", "/actualites"], ["Encyclopédie", "/concepts"], ["Certifications", "/certifications"], ["Cas d'usage", "/cas-usage"], ["Glossaire", "/glossaire"], ["Débuter en data", "/debuter"]].map(([l, h]) => (
              <Link key={h} href={h} className="footer-link">{l}</Link>
            ))}
          </div>

          {/* Ressources */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Ressources</p>
            {[["Outils", "/outils"], ["Comparatifs", "/comparatifs"], ["Comparateur", "/comparateur"], ["Métiers", "/metiers"], ["Formations", "/formations"], ["Jobs", "/jobs"], ["Communauté", "/communaute"]].map(([l, h]) => (
              <Link key={h} href={h} className="footer-link">{l}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Newsletter</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 14, lineHeight: 1.6 }}>L&apos;essentiel data et IA chaque lundi. Gratuit.</p>
            {done ? (
              <div style={{ padding: "11px 14px", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "var(--r-md)" }}>
                <p style={{ fontSize: 13, color: "#4ADE80" }}>Merci, inscription confirmée !</p>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); handleSubscribe(); }} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label htmlFor="footer-email" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                  Votre adresse email
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="prenom@email.fr"
                  style={{
                    padding: "10px 14px", borderRadius: "var(--r-md)",
                    border: "1.5px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.07)", color: "#fff",
                    fontSize: 13.5, outline: "none", fontFamily: "inherit",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 14px", background: "var(--indigo)", color: "#fff",
                    borderRadius: "var(--r-md)", border: "none", cursor: "pointer",
                    fontSize: 13.5, fontWeight: 700, fontFamily: "var(--font-display)",
                    transition: "background 0.15s", opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "..." : "S'abonner →"}
                </button>
                {error && (
                  <p style={{ fontSize: 12, color: "#F87171", marginTop: 4 }}>
                    Erreur lors de l&apos;inscription. Réessaie.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 DataSphère. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/a-propos" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>À propos</Link>
            <Link href="/mentions-legales" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/confidentialite" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Confidentialité</Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>Mis à jour : juin 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
