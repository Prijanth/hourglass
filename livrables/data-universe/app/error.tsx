"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "4rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: 72, lineHeight: 1, marginBottom: "1.5rem", opacity: 0.12, fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text-1)" }}>
        500
      </div>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "var(--text-1)", margin: 0, marginBottom: "0.75rem" }}>
        Une erreur est survenue
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 420, lineHeight: 1.65, margin: "0 auto 2rem" }}>
        Quelque chose s&apos;est mal passé de notre côté. Vous pouvez réessayer ou revenir à l&apos;accueil.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--indigo)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14, border: "none", cursor: "pointer" }}
        >
          Réessayer
        </button>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--surface-2)", color: "var(--text-1)", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid var(--border)" }}>
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
