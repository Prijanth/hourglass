import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Offres d'emploi data & IA | Data Universe",
  description: "CDI, freelance et remote en data et IA — toute la France.",
};

export default function JobsPage() {
  return (
    <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 520, textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>💼</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.03em", marginBottom: 14 }}>
          Offres d&apos;emploi
        </h1>
        <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.7, marginBottom: 32 }}>
          Le board des offres data & IA arrive bientôt. CDI, freelance et remote — toute la France.
        </p>
        <div style={{ display: "inline-flex", padding: "6px 16px", borderRadius: 100, background: "#EDE9FE", border: "1px solid #C4B5FD", fontSize: 12, fontWeight: 700, color: "#5B21B6", marginBottom: 32 }}>
          En construction
        </div>
        <div>
          <Link href="/certifications" style={{ fontSize: 14, color: "#7C3AED", fontWeight: 600 }}>
            En attendant, explore les certifications →
          </Link>
        </div>
      </div>
    </main>
  );
}