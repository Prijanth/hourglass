import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page introuvable — Data Universe",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "4rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: 72, lineHeight: 1, marginBottom: "1.5rem", opacity: 0.15, fontFamily: "var(--font-syne)", fontWeight: 800, color: "var(--text-1)" }}>
        404
      </div>
      <h1 style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 700, color: "var(--text-1)", margin: 0, marginBottom: "0.75rem" }}>
        Page introuvable
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 420, lineHeight: 1.65, margin: "0 auto 2rem" }}>
        Cette page n&apos;existe pas ou a été déplacée. Pas d&apos;inquiétude, le reste du site est intact.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--indigo)", color: "#fff", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
          ← Retour à l&apos;accueil
        </Link>
        <Link href="/actualites" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "var(--surface-2)", color: "var(--text-1)", borderRadius: 8, fontWeight: 600, fontSize: 14, textDecoration: "none", border: "1px solid var(--border)" }}>
          Voir les actualités
        </Link>
      </div>
    </main>
  );
}
