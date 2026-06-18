import type { Metadata } from "next";
import outils from "@/content/outils.json";
import { OutilsGrid } from "@/components/outils-grid";

export const metadata: Metadata = {
  title: "Outils Data & IA — Comparatifs et fiches détaillées | Data Universe",
  description: "88 fiches détaillées sur les outils data du marché : Snowflake, Databricks, dbt, Airflow, Spark. Scores, pros/cons et alternatives pour choisir le bon outil.",
};

export default function OutilsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.24)", top: -110, right: "4%", animationDelay: "3s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(6,182,212,0.15)", bottom: -50, left: "15%", animationDelay: "10s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Écosystème data &amp; IA</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>
            Outils &amp; Plateformes
          </h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 580 }}>
            {outils.length} fiches détaillées : description, scores, pros/cons et alternatives pour chaque outil majeur.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>
        <OutilsGrid outils={outils} />
      </div>
    </>
  );
}
