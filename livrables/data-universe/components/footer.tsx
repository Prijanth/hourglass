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
              <svg width="32" height="32" viewBox="0 0 56 56" fill="none" style={{ filter: "drop-shadow(0 0 10px rgba(167,139,250,0.5))", flexShrink: 0 }}>
                <defs>
                  <linearGradient id="footer-du-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#a78bfa"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
                <ellipse cx="28" cy="28" rx="25" ry="8" stroke="#818cf8" strokeWidth="1.8" fill="none" transform="rotate(-18 28 28)" strokeOpacity="0.35" strokeDasharray="40 41"/>
                <path fillRule="evenodd" d="M12 9 L12 47 L27 47 Q47 47 47 28 Q47 9 27 9 Z M18 15 L18 41 L26 41 Q39 41 39 28 Q39 15 26 15 Z" fill="url(#footer-du-grad)"/>
                <path d="M22 19 L22 30 Q22 37 28 37 Q34 37 34 30 L34 19" stroke="#c4b5fd" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeOpacity="0.8"/>
                <ellipse cx="28" cy="28" rx="25" ry="8" stroke="#a78bfa" strokeWidth="1.8" fill="none" transform="rotate(-18 28 28)" strokeOpacity="0.85" strokeDasharray="40 41" strokeDashoffset="40"/>
                <circle cx="50" cy="23" r="2" fill="#c4b5fd"/>
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, letterSpacing: "-0.03em" }}>
                Data<span style={{ color: "#A78BFA" }}> Universe</span>
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 290, marginBottom: 18 }}>
              La référence francophone sur la data et l&apos;IA. Encyclopédie, certifications, cas d&apos;usage, glossaire et communauté.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Fait en France", "100% gratuit"].map(label => (
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
            {[["Outils", "/outils"], ["Métiers", "/metiers"], ["Formations", "/formations"], ["Jobs", "/jobs"], ["Communauté", "/communaute"], ["Travailler ensemble", "/travailler-avec-nous"]].map(([l, h]) => (
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
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 Data Universe. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/a-propos" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>À propos</Link>
            <Link href="/mentions-legales" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/cgu" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>CGU</Link>
            <Link href="/confidentialite" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Confidentialité</Link>
            <Link href="/accessibilite" style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>Accessibilité</Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: 0 }}>Mis à jour : juin 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
