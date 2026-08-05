import type { Metadata } from "next";
import data from "@/content/concepts.json";
import { ConceptsGrid } from "./concepts-grid";

export const metadata: Metadata = {
  title: "Concepts Data & IA — Encyclopédie 143 fiches | Data Universe",
  description: `${data.concepts.length} concepts data & IA expliqués simplement : Machine Learning, Data Lake, Feature Store, LLM, Gouvernance, Data Mesh. Avec exemples concrets et niveaux de difficulté.`,
  openGraph: {
    title: "Concepts Data & IA — Encyclopédie 143 fiches",
    description: "Machine Learning, Data Lake, LLM, Data Mesh, Feature Store — 143 concepts data expliqués avec exemples concrets.",
    url: "https://data-universe.fr/concepts",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ConceptsPage() {
  return (
    <main>
      {/* Hero — rendu serveur, zéro JS */}
      <section style={{
        background: "var(--navy)", padding: "72px 24px 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div className="mesh-orb" style={{ width: 600, height: 600, background: "rgba(85,88,255,0.14)", top: -200, left: -100 }} />
        <div className="mesh-orb" style={{ width: 400, height: 400, background: "rgba(0,201,167,0.09)", bottom: -100, right: "10%", animationDelay: "6s" }} />
        <div className="mesh-orb" style={{ width: 200, height: 200, background: "rgba(255,107,53,0.07)", top: "30%", right: "30%", animationDelay: "3s" }} />
        <div className="grid-overlay" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          <span className="badge badge-teal" style={{ marginBottom: 20 }}>📚 Encyclopédie Data</span>
          <h1 className="display-lg" style={{ color: "#0F172A", marginBottom: 14, maxWidth: 740 }}>
            Tous les concepts data<br />
            <span className="text-gradient">expliqués simplement</span>
          </h1>
          <p style={{ color: "#64748B", fontSize: 17, maxWidth: 580, lineHeight: 1.7, marginBottom: 36 }}>
            {data.concepts.length} concepts couverts — Machine Learning, Cloud, Techniques Analytics, Gouvernance. Des explications avec des exemples que tout le monde peut comprendre.
          </p>
        </div>
      </section>

      {/* Grille interactive — client component */}
      <ConceptsGrid concepts={data.concepts} niveaux={data.niveaux} />

      {/* CTA — rendu serveur */}
      <section style={{ background: "var(--navy)", padding: "64px 24px", position: "relative", overflow: "hidden" }}>
        <div className="mesh-orb" style={{ width: 300, height: 300, background: "rgba(0,201,167,0.12)", top: -80, left: 100 }} />
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <h2 className="display-md" style={{ color: "#0F172A", marginBottom: 12 }}>
            Un concept manque dans l&apos;encyclopédie ?
          </h2>
          <p style={{ color: "#64748B", marginBottom: 28, fontSize: 16, lineHeight: 1.7 }}>
            L&apos;encyclopédie grandit en continu. Propose un concept dans la communauté.
          </p>
          <a href="/communaute" className="btn-primary" style={{ display: "inline-flex" }}>
            Proposer un concept →
          </a>
        </div>
      </section>
    </main>
  );
}
