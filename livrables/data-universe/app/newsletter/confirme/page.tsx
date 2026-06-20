import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Inscription confirmée — Data Universe",
  description: "Votre abonnement à la newsletter Data Universe est confirmé. Bienvenue dans la communauté data & IA francophone.",
};

export default async function NewsletterConfirmePage({ searchParams }: { searchParams: Promise<{ deja?: string }> }) {
  const sp = await searchParams;
  const dejaAbonne = sp.deja === "true";

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        <div style={{ fontSize: 72, marginBottom: 24 }}>{dejaAbonne ? "👋" : "🎉"}</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
          {dejaAbonne ? "Tu es déjà abonné !" : "Inscription confirmée !"}
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.8, marginBottom: 32 }}>
          {dejaAbonne
            ? "Cette adresse email est déjà inscrite à la newsletter Data Universe. Retrouve nos archives ci-dessous."
            : "Bienvenue dans la communauté Data Universe. Tu recevras la prochaine édition lundi matin. D'ici là, explore le site !"}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-primary">
            Explorer Data Universe →
          </Link>
          <Link href="/certifications" className="btn-secondary">
            Voir les certifications
          </Link>
        </div>
      </div>
    </main>
  );
}
