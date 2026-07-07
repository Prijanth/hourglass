import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Désabonnement confirmé — Data Universe",
  description: "Vous avez bien été désabonné de la newsletter Data Universe.",
  robots: { index: false, follow: false },
};

export default async function DesabonnementPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; deja?: string }>;
}) {
  const params = await searchParams;
  const erreur = params.erreur;
  const deja = params.deja;

  if (erreur === "lien-invalide") {
    return (
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>⚠️</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Lien invalide
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 28 }}>
            Ce lien de désabonnement n&apos;est pas valide ou a déjà été utilisé. Si tu souhaites te désabonner, contacte-nous à{" "}
            <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)", fontWeight: 600 }}>contact@data-universe.fr</a>.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  if (deja) {
    return (
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 24 }}>ℹ️</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Déjà désabonné
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 28 }}>
            Cette adresse email est déjà désabonnée de la newsletter Data Universe.
          </p>
          <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ maxWidth: 480, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 24 }}>👋</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
          Désabonnement confirmé
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, marginBottom: 8 }}>
          Tu ne recevras plus d&apos;emails de la part de Data Universe.
        </p>
        <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 32 }}>
          Tu peux te réabonner à tout moment via la{" "}
          <Link href="/newsletter" style={{ color: "var(--indigo)", fontWeight: 600 }}>page newsletter</Link>.
        </p>
        <Link href="/" className="btn-primary" style={{ textDecoration: "none" }}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
