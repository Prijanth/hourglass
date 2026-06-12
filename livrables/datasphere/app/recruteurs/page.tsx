import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recruteurs data & IA | DataSphere",
  description: "Publiez votre offre auprès de 2 400 professionnels de la data.",
};

export default function RecruteursPage() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>📢</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 14 }}>
          Espace recruteurs
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, marginBottom: 32 }}>
          Publiez votre offre auprès de 2 400 professionnels de la data et de l&apos;IA. Formulaire de dépôt bientôt disponible.
        </p>
        <div style={{ display: "inline-flex", padding: "6px 16px", borderRadius: 100, background: "#EDE9FE", border: "1px solid #C4B5FD", fontSize: 12, fontWeight: 700, color: "#5B21B6", marginBottom: 32 }}>
          En construction
        </div>
        <div>
          <Link href="/metiers" style={{ fontSize: 14, color: "#7C3AED", fontWeight: 600 }}>
            Explorer les profils data →
          </Link>
        </div>
      </div>
    </main>
  );
}