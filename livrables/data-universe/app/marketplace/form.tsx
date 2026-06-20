"use client";
import { useState } from "react";

export function MarketplaceFormWrapper({ children }: { children: React.ReactNode }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{
        padding: "48px 40px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "#0F172A" }}>
          Profil reçu, merci !
        </h3>
        <p style={{ fontSize: 14.5, color: "var(--text-2)", lineHeight: 1.7, maxWidth: 420 }}>
          Nous reviendrons vers vous sous 48h si une opportunité correspond à votre profil. Suppression possible à tout moment via <strong>contact@data-universe.fr</strong>.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      style={{ display: "flex", flexDirection: "column", gap: 22 }}
    >
      {children}
    </form>
  );
}
