"use client";

import { useState, useMemo, useEffect, useRef } from "react";
// Metadata SEO — défini dans un fichier layout.tsx adjacent si nécessaire
// (Next.js n'autorise pas export const metadata dans un "use client")

/* ─── Types ──────────────────────────────────────────────── */
type Localisation = "paris" | "grande-ville" | "province";
type CertificationKey = "none" | "aws-associate" | "aws-pro" | "gcp-pro" | "azure-associate" | "databricks-pro" | "snowflake";

interface Metier {
  slug: string;
  title: string;
  salaryMin: number;
  salaryMax: number;
  skills: string[];
}

/* ─── Données métiers ────────────────────────────────────── */
const METIERS: Metier[] = [
  { slug: "data-engineer",      title: "Data Engineer",         salaryMin: 45, salaryMax: 90,  skills: ["Python", "SQL", "Spark", "Kafka", "dbt", "Airflow", "Snowflake/BigQuery", "Docker/K8s"] },
  { slug: "data-scientist",     title: "Data Scientist",        salaryMin: 45, salaryMax: 88,  skills: ["Python", "ML", "Deep Learning", "Statistics", "Scikit-learn", "PyTorch", "SQL", "MLflow"] },
  { slug: "ai-engineer",        title: "AI Engineer",           salaryMin: 52, salaryMax: 105, skills: ["Python", "LLMs", "LangChain", "RAG", "Prompt Engineering", "FastAPI", "LLMOps", "CI/CD"] },
  { slug: "analytics-engineer", title: "Analytics Engineer",    salaryMin: 42, salaryMax: 80,  skills: ["dbt", "SQL", "Python", "Airbyte/Fivetran", "Looker/Metabase", "Data Modeling"] },
  { slug: "data-analyst",       title: "Data Analyst",          salaryMin: 32, salaryMax: 65,  skills: ["SQL", "Excel", "Power BI", "Tableau", "Python", "Statistiques"] },
  { slug: "ml-engineer",        title: "ML Engineer",           salaryMin: 50, salaryMax: 95,  skills: ["Python", "PyTorch/TensorFlow", "MLflow", "Docker", "Kubernetes", "FastAPI", "CI/CD"] },
  { slug: "data-architect",     title: "Data Architect",        salaryMin: 65, salaryMax: 110, skills: ["Architecture cloud", "Modélisation", "Gouvernance", "Sécurité", "SQL", "Spark"] },
  { slug: "product-owner-data", title: "Product Owner Data",    salaryMin: 45, salaryMax: 80,  skills: ["Jira", "SQL", "Agile", "Stakeholder Management", "Data Strategy"] },
];

/* ─── Compétences premium transversales ─────────────────── */
const COMPETENCES_PREMIUM: { label: string; bonus: number }[] = [
  { label: "dbt",              bonus: 5  },
  { label: "Spark",            bonus: 8  },
  { label: "Kubernetes",       bonus: 7  },
  { label: "LLMs / RAG",       bonus: 10 },
  { label: "MLflow",           bonus: 6  },
  { label: "Snowflake",        bonus: 5  },
  { label: "Databricks",       bonus: 6  },
  { label: "Terraform",        bonus: 5  },
];

/* ─── Certifications ─────────────────────────────────────── */
const CERTIFICATIONS: { key: CertificationKey; label: string; bonus: number }[] = [
  { key: "none",              label: "Aucune certification",         bonus: 0  },
  { key: "aws-associate",     label: "AWS Associate",                bonus: 5  },
  { key: "aws-pro",           label: "AWS Professional",             bonus: 10 },
  { key: "gcp-pro",           label: "GCP Professional",             bonus: 10 },
  { key: "azure-associate",   label: "Azure Associate",              bonus: 5  },
  { key: "databricks-pro",    label: "Databricks Professional",      bonus: 8  },
  { key: "snowflake",         label: "Snowflake SnowPro",            bonus: 5  },
];

/* ─── Localisations ──────────────────────────────────────── */
const LOCALISATIONS: { key: Localisation; label: string; mult: number }[] = [
  { key: "paris",         label: "Paris / Île-de-France", mult: 1.15 },
  { key: "grande-ville",  label: "Lyon, Bordeaux, Nantes", mult: 1.05 },
  { key: "province",      label: "Province",              mult: 1.00 },
];

/* ─── Helpers ────────────────────────────────────────────── */
function calcSalaire(
  metier: Metier,
  experience: number,
  localisation: Localisation,
  competencesSelectionnees: string[],
  certification: CertificationKey,
): { bas: number; haut: number; base: number; bonusComp: number; bonusCert: number } {
  const base = metier.salaryMin + (metier.salaryMax - metier.salaryMin) * (experience / 15);
  const locMult = LOCALISATIONS.find(l => l.key === localisation)!.mult;

  const bonusComp = Math.min(
    COMPETENCES_PREMIUM
      .filter(c => competencesSelectionnees.includes(c.label))
      .reduce((acc, c) => acc + c.bonus, 0),
    30,
  );

  const bonusCert = CERTIFICATIONS.find(c => c.key === certification)!.bonus;
  const totalBonus = (bonusComp + bonusCert) / 100;

  const mid = base * locMult * (1 + totalBonus);
  return {
    bas: Math.round(mid - 8),
    haut: Math.round(mid + 8),
    base: Math.round(base * locMult),
    bonusComp,
    bonusCert,
  };
}

/* ─── Animated counter ───────────────────────────────────── */
function useAnimatedNumber(target: number, duration = 500) {
  const [value, setValue] = useState(target);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(target);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    startValRef.current = value;
    startRef.current = null;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    function step(ts: number) {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(startValRef.current + (target - startValRef.current) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current !== null) cancelAnimationFrame(frameRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

/* ─── Page component ─────────────────────────────────────── */
export default function CalculateurSalairePage() {
  const [metierSlug, setMetierSlug] = useState<string>(METIERS[0].slug);
  const [experience, setExperience] = useState<number>(3);
  const [localisation, setLocalisation] = useState<Localisation>("paris");
  const [competences, setCompetences] = useState<string[]>([]);
  const [certification, setCertification] = useState<CertificationKey>("none");

  const metier = useMemo(() => METIERS.find(m => m.slug === metierSlug)!, [metierSlug]);

  const resultat = useMemo(
    () => calcSalaire(metier, experience, localisation, competences, certification),
    [metier, experience, localisation, competences, certification],
  );

  const resultatSans = useMemo(
    () => calcSalaire(metier, experience, localisation, [], "none"),
    [metier, experience, localisation],
  );

  /* Compétences disponibles = compétences du métier + premium non déjà présentes */
  const competencesDispos = useMemo(() => {
    const premium = COMPETENCES_PREMIUM.map(c => c.label);
    const metierSkills = metier.skills;
    /* On affiche les compétences premium : celles du métier d'abord (si premium), puis les autres */
    const fromMetier = metierSkills.filter(s => premium.some(p => s.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(s.toLowerCase())));
    const extras = premium.filter(p => !fromMetier.some(fm => fm.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(fm.toLowerCase())));
    return [...new Set([...fromMetier.map(s => {
      /* Normaliser le nom vers le label premium */
      const match = COMPETENCES_PREMIUM.find(c => s.toLowerCase().includes(c.label.toLowerCase()) || c.label.toLowerCase().includes(s.toLowerCase()));
      return match ? match.label : s;
    }), ...extras])];
  }, [metier]);

  /* Top 3 compétences impactantes pour ce profil */
  const top3Competences = useMemo(() => {
    return COMPETENCES_PREMIUM
      .filter(c => !competences.includes(c.label))
      .sort((a, b) => b.bonus - a.bonus)
      .slice(0, 3);
  }, [competences]);

  /* Certification suggérée */
  const certSuggestion = useMemo(() => {
    if (certification !== "none") return null;
    return CERTIFICATIONS.filter(c => c.key !== "none").sort((a, b) => b.bonus - a.bonus)[0];
  }, [certification]);

  /* Barre de progression dans la fourchette du métier */
  const progressPct = useMemo(() => {
    const mid = (resultat.bas + resultat.haut) / 2;
    const pct = ((mid - metier.salaryMin) / (metier.salaryMax - metier.salaryMin)) * 100;
    return Math.max(0, Math.min(100, pct));
  }, [resultat, metier]);

  const gainBas  = resultat.bas  - resultatSans.bas;
  const gainHaut = resultat.haut - resultatSans.haut;
  const hasGain  = gainBas > 0 || gainHaut > 0;

  /* Animated values */
  const animBas  = useAnimatedNumber(resultat.bas);
  const animHaut = useAnimatedNumber(resultat.haut);

  function toggleComp(label: string) {
    setCompetences(prev =>
      prev.includes(label) ? prev.filter(c => c !== label) : [...prev, label],
    );
  }

  /* Réinitialiser compétences quand on change de métier */
  function handleMetierChange(slug: string) {
    setMetierSlug(slug);
    setCompetences([]);
  }

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.15)",
      }}>
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(124,58,237,0.18)", top: -130, right: "2%", animationDelay: "0s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(8,145,178,0.12)", bottom: -60, left: "8%", animationDelay: "-8s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <span className="section-label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Calculateur de salaire
          </span>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            marginBottom: 14,
          }}>
            Combien vaut ton profil{" "}
            <span className="text-gradient">data</span>{" "}
            en France&nbsp;?
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.65, maxWidth: 540 }}>
            Estime ton salaire brut annuel selon ton métier, ton expérience, ta localisation et les compétences que tu maîtrises.
          </p>
        </div>
      </section>

      {/* ── Layout 2 colonnes ─────────────────────────────── */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 28,
        }}
          className="calc-grid"
        >
          {/* ── COLONNE GAUCHE : Inputs ───────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Étape 1 — Profil actuel */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-display)" }}>1</span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>Ton profil actuel</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>Métier, expérience et localisation</p>
                </div>
              </div>

              {/* Sélecteur de métier */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                  Métier
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {METIERS.map(m => (
                    <button
                      key={m.slug}
                      onClick={() => handleMetierChange(m.slug)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: metierSlug === m.slug
                          ? "1.5px solid rgba(124,58,237,0.5)"
                          : "1.5px solid var(--border)",
                        background: metierSlug === m.slug ? "rgba(124,58,237,0.06)" : "var(--surface)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{
                        fontSize: 13.5,
                        fontWeight: metierSlug === m.slug ? 700 : 500,
                        color: metierSlug === m.slug ? "#5B21B6" : "var(--text)",
                      }}>
                        {m.title}
                      </span>
                      <span style={{ fontSize: 11.5, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
                        {m.salaryMin}–{m.salaryMax}k€
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider expérience */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                  <span>Années d&apos;expérience</span>
                  <span style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#7C3AED",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.03em",
                  }}>
                    {experience} {experience <= 1 ? "an" : "ans"}
                  </span>
                </label>
                <div style={{ position: "relative", paddingBottom: 20 }}>
                  <input
                    type="range"
                    min={0}
                    max={15}
                    value={experience}
                    onChange={e => setExperience(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#7C3AED",
                      height: 6,
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                    {[0, 3, 5, 8, 10, 15].map(y => (
                      <span key={y} style={{ fontSize: 10, color: "var(--faint)" }}>{y}</span>
                    ))}
                  </div>
                </div>

                {/* Labels niveaux */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { label: "Junior",   range: [0, 2],  color: "#22C55E" },
                    { label: "Mid",      range: [3, 5],  color: "#0891B2" },
                    { label: "Senior",   range: [6, 9],  color: "#7C3AED" },
                    { label: "Expert",   range: [10, 15], color: "#EA580C" },
                  ].map(lvl => {
                    const active = experience >= lvl.range[0] && experience <= lvl.range[1];
                    return (
                      <span
                        key={lvl.label}
                        style={{
                          padding: "3px 10px",
                          borderRadius: 100,
                          fontSize: 11,
                          fontWeight: active ? 700 : 500,
                          background: active ? `${lvl.color}15` : "var(--surface-2)",
                          color: active ? lvl.color : "var(--faint)",
                          border: active ? `1px solid ${lvl.color}40` : "1px solid var(--border)",
                          transition: "all 0.2s",
                        }}
                      >
                        {lvl.label} ({lvl.range[0]}–{lvl.range[1]} ans)
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Localisation */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 8, fontFamily: "var(--font-display)" }}>
                  Localisation
                </label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {LOCALISATIONS.map(loc => (
                    <button
                      key={loc.key}
                      onClick={() => setLocalisation(loc.key)}
                      style={{
                        flex: "1 1 auto",
                        padding: "10px 14px",
                        borderRadius: 10,
                        border: localisation === loc.key ? "1.5px solid rgba(124,58,237,0.5)" : "1.5px solid var(--border)",
                        background: localisation === loc.key ? "rgba(124,58,237,0.06)" : "var(--surface)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 13,
                        fontWeight: localisation === loc.key ? 700 : 500,
                        color: localisation === loc.key ? "#5B21B6" : "var(--text)",
                        transition: "all 0.15s",
                        textAlign: "center",
                      }}
                    >
                      <div>{loc.label}</div>
                      <div style={{ fontSize: 10, color: localisation === loc.key ? "#7C3AED" : "var(--faint)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                        {loc.mult === 1 ? "0%" : `+${Math.round((loc.mult - 1) * 100)}%`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Étape 2 — Booster son profil */}
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, #0891B2, #0EA5E9)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "var(--font-display)" }}>2</span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--text)" }}>Booster ton profil</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 1 }}>Compétences premium et certifications</p>
                </div>
              </div>

              {/* Compétences premium */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", fontFamily: "var(--font-display)" }}>
                    Compétences premium
                  </label>
                  {competences.length > 0 && (
                    <button
                      onClick={() => setCompetences([])}
                      style={{ fontSize: 11, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                    >
                      Tout décocher
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {competencesDispos.map(label => {
                    const premiumData = COMPETENCES_PREMIUM.find(c => c.label === label);
                    if (!premiumData) return null;
                    const checked = competences.includes(label);
                    return (
                      <label
                        key={label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          padding: "9px 14px",
                          borderRadius: 9,
                          border: checked ? "1.5px solid rgba(124,58,237,0.4)" : "1.5px solid var(--border)",
                          background: checked ? "rgba(124,58,237,0.05)" : "transparent",
                          cursor: "pointer",
                          transition: "all 0.15s",
                          userSelect: "none",
                        }}
                      >
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          border: checked ? "none" : "1.5px solid var(--border-2)",
                          background: checked ? "#7C3AED" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {checked && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleComp(label)}
                          style={{ display: "none" }}
                        />
                        <span style={{
                          flex: 1,
                          fontSize: 13.5,
                          fontWeight: checked ? 700 : 500,
                          color: checked ? "#5B21B6" : "var(--text)",
                        }}>
                          {label}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#22C55E",
                          background: "rgba(34,197,94,0.1)",
                          border: "1px solid rgba(34,197,94,0.2)",
                          padding: "2px 7px",
                          borderRadius: 100,
                          fontFamily: "var(--font-mono)",
                        }}>
                          +{premiumData.bonus}%
                        </span>
                      </label>
                    );
                  })}
                </div>
                {competences.length > 0 && (
                  <div style={{
                    marginTop: 10, padding: "8px 12px",
                    background: "rgba(124,58,237,0.05)", borderRadius: 8,
                    border: "1px solid rgba(124,58,237,0.15)",
                    fontSize: 12, color: "#5B21B6",
                    fontWeight: 600,
                  }}>
                    Bonus compétences actuel : +{Math.min(
                      COMPETENCES_PREMIUM.filter(c => competences.includes(c.label)).reduce((a, c) => a + c.bonus, 0),
                      30,
                    )}%
                    {COMPETENCES_PREMIUM.filter(c => competences.includes(c.label)).reduce((a, c) => a + c.bonus, 0) > 30 && (
                      <span style={{ color: "var(--muted)", fontWeight: 400 }}> (plafonné à +30%)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Certification */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "var(--text-2)", marginBottom: 10, fontFamily: "var(--font-display)" }}>
                  Certification cloud / data
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {CERTIFICATIONS.map(cert => (
                    <button
                      key={cert.key}
                      onClick={() => setCertification(cert.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 14px",
                        borderRadius: 9,
                        border: certification === cert.key ? "1.5px solid rgba(124,58,237,0.5)" : "1.5px solid var(--border)",
                        background: certification === cert.key ? "rgba(124,58,237,0.06)" : "transparent",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{
                        fontSize: 13,
                        fontWeight: certification === cert.key ? 700 : 500,
                        color: certification === cert.key ? "#5B21B6" : "var(--text)",
                      }}>
                        {cert.label}
                      </span>
                      {cert.bonus > 0 && (
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#0891B2",
                          background: "rgba(8,145,178,0.1)",
                          border: "1px solid rgba(8,145,178,0.2)",
                          padding: "2px 7px",
                          borderRadius: 100,
                          fontFamily: "var(--font-mono)",
                        }}>
                          +{cert.bonus}%
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── COLONNE DROITE : Résultats sticky ─────────── */}
          <div>
            <div style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Carte résultat principal */}
              <div style={{
                background: "linear-gradient(145deg, #F5F3FF 0%, #EDE9FE 60%, #F0FFFE 100%)",
                border: "1.5px solid rgba(124,58,237,0.2)",
                borderRadius: 20,
                padding: 28,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Orb décoratif */}
                <div style={{
                  position: "absolute", width: 200, height: 200,
                  background: "rgba(124,58,237,0.1)", borderRadius: "50%",
                  filter: "blur(60px)", top: -60, right: -40, pointerEvents: "none",
                }} />

                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7C3AED", marginBottom: 6 }}>
                  Salaire estimé
                </p>

                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: "#0F172A",
                  marginBottom: 6,
                  transition: "all 0.3s",
                }}>
                  <span style={{ background: "linear-gradient(130deg, #7C3AED, #0EA5E9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {animBas} – {animHaut}k€
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#64748B", marginBottom: 20 }}>brut / an • France</p>

                {/* Barre de progression */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "var(--muted)", marginBottom: 5, fontFamily: "var(--font-mono)" }}>
                    <span>{metier.salaryMin}k€ (débutant)</span>
                    <span>{metier.title}</span>
                    <span>{metier.salaryMax}k€ (expert)</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(124,58,237,0.12)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${progressPct}%`,
                      background: "linear-gradient(90deg, #7C3AED, #0EA5E9)",
                      borderRadius: 100,
                      transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }} />
                  </div>
                  <p style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 4, textAlign: "center", fontFamily: "var(--font-mono)" }}>
                    {Math.round(progressPct)}e percentile dans ta fourchette métier
                  </p>
                </div>
              </div>

              {/* Carte comparaison */}
              {hasGain ? (
                <div className="card" style={{ padding: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>
                    Impact de tes choix
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--faint)", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>Sans les boosters</p>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-2)" }}>
                          {resultatSans.bas} – {resultatSans.haut}k€
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED", flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>Avec tes boosters</p>
                        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "#5B21B6" }}>
                          {resultat.bas} – {resultat.haut}k€
                        </p>
                      </div>
                      <span style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "#22C55E",
                        background: "rgba(34,197,94,0.1)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontFamily: "var(--font-mono)",
                      }}>
                        +{Math.round((gainBas + gainHaut) / 2)}k€
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 10 }}>
                    Potentiel de gain
                  </p>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
                    Coche des compétences ou une certification pour voir l&apos;impact sur ton salaire.
                  </p>
                </div>
              )}

              {/* Top 3 compétences à acquérir */}
              {top3Competences.length > 0 && (
                <div className="card" style={{ padding: 20 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 12 }}>
                    Top compétences à acquérir
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {top3Competences.map((c, i) => (
                      <div
                        key={c.label}
                        style={{ display: "flex", alignItems: "center", gap: 12 }}
                      >
                        <span style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: i === 0 ? "linear-gradient(135deg, #F59E0B, #D97706)" : i === 1 ? "linear-gradient(135deg, #94A3B8, #64748B)" : "linear-gradient(135deg, #C49B6C, #A07848)",
                          color: "#fff", fontSize: 10, fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-display)", flexShrink: 0,
                        }}>
                          {i + 1}
                        </span>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{c.label}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#22C55E",
                          background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)",
                          padding: "2px 7px", borderRadius: 100, fontFamily: "var(--font-mono)",
                        }}>
                          +{c.bonus}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion certification */}
              {certSuggestion && (
                <div style={{
                  padding: "14px 18px",
                  background: "rgba(8,145,178,0.06)",
                  border: "1px solid rgba(8,145,178,0.18)",
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>🏅</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0E7490", marginBottom: 2 }}>Pour aller plus loin</p>
                    <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                      Vise la certification{" "}
                      <strong style={{ color: "var(--text)" }}>{certSuggestion.label}</strong>
                      {" "}pour un gain additionnel de{" "}
                      <strong style={{ color: "#0E7490" }}>+{certSuggestion.bonus}%</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <p style={{ fontSize: 11, color: "var(--faint)", lineHeight: 1.5, textAlign: "center" }}>
                Estimation indicative basée sur les données du marché français 2024–2025.
                Les salaires varient selon l&apos;entreprise et le contexte.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive styles inline ─────────────────────── */}
      <style>{`
        @media (min-width: 768px) {
          .calc-grid {
            grid-template-columns: 1fr 380px !important;
            align-items: start;
          }
        }
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          background: linear-gradient(
            to right,
            #7C3AED 0%,
            #7C3AED calc(${(experience / 15) * 100}%),
            #E2E8F0 calc(${(experience / 15) * 100}%),
            #E2E8F0 100%
          );
          border-radius: 100px;
          outline: none;
          cursor: pointer;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #7C3AED;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(124,58,237,0.4);
          transition: box-shadow 0.15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 3px 12px rgba(124,58,237,0.55);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #7C3AED;
          border-radius: 50%;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(124,58,237,0.4);
        }
      `}</style>
    </main>
  );
}
