"use client";
import Link from "next/link";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    if (!email.includes("@")) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <footer style={{ background: "#0B0F29", color: "#fff", position: "relative", overflow: "hidden" }}>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), rgba(14,165,233,0.4), transparent)" }} />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.3fr", gap: 48, marginBottom: 44 }}>
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
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, maxWidth: 290, marginBottom: 18 }}>
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
            {[["Outils", "/outils"], ["Comparatifs", "/comparatifs"], ["Métiers", "/metiers"], ["Formations", "/formations"], ["Jobs", "/jobs"], ["Communauté", "/communaute"]].map(([l, h]) => (
              <Link key={h} href={h} className="footer-link">{l}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>Newsletter</p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.42)", marginBottom: 14, lineHeight: 1.6 }}>L&apos;essentiel data et IA chaque lundi. Gratuit.</p>
            {done ? (
              <div style={{ padding: "11px 14px", background: "rgba(22,163,74,0.12)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "var(--r-md)" }}>
                <p style={{ fontSize: 13, color: "#4ADE80" }}>Merci, inscription confirmée !</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input
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
                  onClick={handleSubscribe}
                  disabled={loading}
                  style={{
                    padding: "10px 14px", background: "var(--indigo)", color: "#fff",
                    borderRadius: "var(--r-md)", border: "none", cursor: "pointer",
                    fontSize: 13.5, fontWeight: 700, fontFamily: "var(--font-display)",
                    transition: "background 0.15s", opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#6D28D9")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--indigo)")}
                >
                  {loading ? "..." : "S'abonner →"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>© 2026 DataSphère. Tous droits réservés.</p>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/a-propos" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>À propos</Link>
            <Link href="/mentions-legales" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Mentions légales</Link>
            <Link href="/confidentialite" style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Confidentialité</Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>Fait avec passion en France</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
