import type { Metadata } from "next";
import Link from "next/link";
import metiers from "@/content/metiers.json";
import { MetiersListing } from "./listing";
import { SkillsChart } from "@/components/charts/skills-chart";
import { SalaryChart } from "@/components/charts/salary-chart";

export const metadata: Metadata = {
  title: "Métiers Data & IA — Compétences, salaires et carrières 2026 | Data Universe",
  description: "Fiches détaillées des métiers data & IA : salaires, compétences requises, certifications et trajectoires de carrière. Data Engineer, Data Scientist, Analytics Engineer, ML Engineer, Data Analyst.",
  openGraph: {
    title: "Métiers Data & IA — Compétences, salaires et carrières 2026",
    description: "Data Engineer, Data Scientist, ML Engineer — salaires, compétences et certifications pour chaque métier data.",
    url: "https://data-universe.fr/metiers",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

const PROFILES = [
  {
    emoji: "🎓",
    title: "Tu viens de commerce / tu n'as pas de background tech",
    desc: "Ces métiers sont accessibles sans bagage technique fort, avec des compétences Excel, gestion de projet ou communication.",
    roles: ["Data Analyst", "Product Owner Data"],
    color: "#0E7490",
    bg: "#ECFEFF",
  },
  {
    emoji: "💻",
    title: "Tu as un background technique (info, math, ingé)",
    desc: "Ces profils requièrent Python, SQL ou des bases en statistiques, mais sont accessibles en sortie d'école avec les bons projets.",
    roles: ["Data Engineer", "Data Scientist", "Analytics Engineer", "AI Engineer"],
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  {
    emoji: "📈",
    title: "Tu es déjà en poste et tu veux évoluer",
    desc: "Ces rôles nécessitent 6 à 10+ ans d'expérience et représentent les évolutions naturelles des profils seniors.",
    roles: ["Data Architect", "Staff / Principal Data Engineer", "Chief Data Officer"],
    color: "#92400E",
    bg: "#FFFBEB",
  },
];

export default function MetiersPage() {
  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.22)", top: -100, right: "6%", animationDelay: "4s" }} />
        <div className="orb" style={{ width: 240, height: 240, background: "rgba(34,211,238,0.13)", bottom: -70, left: "10%", animationDelay: "11s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Marché de l&apos;emploi data</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Métiers Data &amp; IA</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 580 }}>
            Fiches complètes des métiers data &amp; IA : compétences requises, certifications et trajectoires de carrière en France.
          </p>
        </div>
      </section>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>

      {/* ── ORIENTATION PAR PROFIL ─────────────────────── */}
      <div style={{ marginBottom: 56 }}>
        <span className="section-label">Par où commencer ?</span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Trouve le métier fait pour toi</h2>
        <p style={{ fontSize: 14.5, color: "var(--muted)", marginBottom: 24, maxWidth: 560 }}>
          Selon ton background, certains rôles sont plus accessibles que d&apos;autres. Clique sur ton profil pour voir les métiers recommandés.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {PROFILES.map(p => (
            <div key={p.title} style={{ background: p.bg, border: `1px solid ${p.color}22`, borderRadius: 14, padding: "20px 22px" }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{p.emoji}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: p.color, marginBottom: 8, lineHeight: 1.4 }}>{p.title}</p>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {p.roles.map(r => (
                  <Link
                    key={r}
                    href={`/metiers/${metiers.find(m => m.title === r)?.slug ?? ""}`}
                    style={{ fontSize: 12, padding: "4px 10px", background: `${p.color}15`, border: `1px solid ${p.color}30`, borderRadius: 20, color: p.color, fontWeight: 600, textDecoration: "none" }}
                  >{r}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 48 }}>
        {[
          { value: `${metiers.length}`, label: "métiers couverts", sub: "data & IA" },
          { value: "4",  label: "catégories", sub: "Engineering, Analytics, IA, Management" },
          { value: "Forte", label: "tension du marché", sub: "manque de profils qualifiés" },
        ].map(({ value, label, sub }) => (
          <div key={label} className="card" style={{ padding: "20px 22px" }}>
            <div className="stat-num" style={{ fontSize: "1.8rem", marginBottom: 6 }}>{value}</div>
            <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 12, color: "var(--faint)" }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Charts côte à côte */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 56 }}>
        <div className="card" style={{ padding: "28px 24px" }}>
          <span className="section-label">Compétences</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Top compétences demandées</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>Score de demande sur les offres d&apos;emploi data analysées</p>
          <SkillsChart />
        </div>
        <div className="card" style={{ padding: "28px 24px" }}>
          <span className="section-label">Rémunération</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Fourchettes salariales</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 18 }}>Salaires bruts annuels en France 2026 — junior à senior</p>
          <SalaryChart />
        </div>
      </div>

    </div>

      <MetiersListing />
    </>
  );
}
