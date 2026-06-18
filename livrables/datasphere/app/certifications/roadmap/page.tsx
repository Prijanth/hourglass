import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Roadmap certifications data 2026 — Dans quel ordre se certifier | Data Universe",
  description: "Parcours visuels de certifications par provider : AWS, Azure, GCP, Databricks, Snowflake, dbt, Dataiku, Google. De débutant à expert, dans le bon ordre.",
};

/* ── Types ─────────────────────────────────────────────── */
type Niveau = "Débutant" | "Intermédiaire" | "Avancé";

interface Certification {
  nom: string;
  code?: string;
  duree: string;
  gratuit?: boolean;
}

interface Provider {
  id: string;
  nom: string;
  couleur: string;
  couleurBg: string;
  couleurBorder: string;
  debutant: Certification[];
  intermediaire: Certification[];
  avance: Certification[];
}

/* ── Data ──────────────────────────────────────────────── */
const PROVIDERS: Provider[] = [
  {
    id: "aws",
    nom: "AWS",
    couleur: "#FF9900",
    couleurBg: "rgba(255,153,0,0.08)",
    couleurBorder: "rgba(255,153,0,0.25)",
    debutant: [
      { nom: "Cloud Practitioner", code: "CLF-C02", duree: "30-60h" },
    ],
    intermediaire: [
      { nom: "Solutions Architect Associate", code: "SAA-C03", duree: "80-120h" },
      { nom: "Data Engineer Associate", code: "DEA-C01", duree: "80-120h" },
    ],
    avance: [
      { nom: "Solutions Architect Professional", duree: "150h+" },
      { nom: "ML Engineer Associate", code: "MLA-C01", duree: "120-160h" },
      { nom: "DevOps Engineer Professional", duree: "150h+" },
    ],
  },
  {
    id: "azure",
    nom: "Azure",
    couleur: "#0078D4",
    couleurBg: "rgba(0,120,212,0.08)",
    couleurBorder: "rgba(0,120,212,0.25)",
    debutant: [
      { nom: "Azure Fundamentals", code: "AZ-900", duree: "20-40h" },
      { nom: "AI Fundamentals", code: "AI-900", duree: "20-40h" },
    ],
    intermediaire: [
      { nom: "Azure Data Engineer Associate", code: "DP-203", duree: "80-120h" },
      { nom: "Azure AI Engineer Associate", code: "AI-102", duree: "80-120h" },
    ],
    avance: [
      { nom: "Azure Solutions Architect Expert", code: "AZ-305", duree: "150h+" },
      { nom: "Data Scientist Associate", code: "DP-100", duree: "120h+" },
    ],
  },
  {
    id: "gcp",
    nom: "GCP",
    couleur: "#4285F4",
    couleurBg: "rgba(66,133,244,0.08)",
    couleurBorder: "rgba(66,133,244,0.25)",
    debutant: [
      { nom: "Cloud Digital Leader", duree: "20-40h" },
      { nom: "Associate Cloud Engineer", duree: "60-80h" },
    ],
    intermediaire: [
      { nom: "Professional Data Engineer", duree: "100-140h" },
    ],
    avance: [
      { nom: "Professional ML Engineer", duree: "140h+" },
      { nom: "Professional Cloud Architect", duree: "150h+" },
    ],
  },
  {
    id: "databricks",
    nom: "Databricks",
    couleur: "#FF3621",
    couleurBg: "rgba(255,54,33,0.08)",
    couleurBorder: "rgba(255,54,33,0.25)",
    debutant: [
      { nom: "Databricks Fundamentals", duree: "10-20h", gratuit: true },
    ],
    intermediaire: [
      { nom: "Data Engineer Associate", duree: "60-80h" },
      { nom: "ML Associate", duree: "60-80h" },
    ],
    avance: [
      { nom: "Data Engineer Professional", duree: "120h+" },
      { nom: "ML Professional", duree: "120h+" },
    ],
  },
  {
    id: "snowflake",
    nom: "Snowflake",
    couleur: "#29B5E8",
    couleurBg: "rgba(41,181,232,0.08)",
    couleurBorder: "rgba(41,181,232,0.25)",
    debutant: [
      { nom: "SnowPro Core", duree: "40-60h" },
    ],
    intermediaire: [
      { nom: "SnowPro Advanced Data Engineer", duree: "80-100h" },
    ],
    avance: [
      { nom: "SnowPro Advanced Architect", duree: "120h+" },
    ],
  },
  {
    id: "dbt",
    nom: "dbt",
    couleur: "#FF694A",
    couleurBg: "rgba(255,105,74,0.08)",
    couleurBorder: "rgba(255,105,74,0.25)",
    debutant: [],
    intermediaire: [
      { nom: "dbt Analytics Engineering Certification", duree: "60-80h" },
    ],
    avance: [],
  },
  {
    id: "dataiku",
    nom: "Dataiku",
    couleur: "#2AB1AC",
    couleurBg: "rgba(42,177,172,0.08)",
    couleurBorder: "rgba(42,177,172,0.25)",
    debutant: [
      { nom: "Dataiku Core Designer", duree: "20-40h" },
    ],
    intermediaire: [
      { nom: "Dataiku ML Practitioner", duree: "60-80h" },
      { nom: "Dataiku Developer", duree: "60-80h" },
    ],
    avance: [
      { nom: "Dataiku MLOps Practitioner", duree: "100-120h" },
      { nom: "Dataiku Data Science Professional", duree: "120h+" },
    ],
  },
  {
    id: "google",
    nom: "Google (ML/IA)",
    couleur: "#34A853",
    couleurBg: "rgba(52,168,83,0.08)",
    couleurBorder: "rgba(52,168,83,0.25)",
    debutant: [
      { nom: "Google IT Support", duree: "150h" },
      { nom: "Data Analytics Certificate", duree: "150-200h" },
    ],
    intermediaire: [
      { nom: "Advanced Data Analytics", duree: "200h+" },
      { nom: "Business Intelligence Certificate", duree: "150h+" },
    ],
    avance: [
      { nom: "Professional ML Engineer", duree: "150h+" },
      { nom: "Professional Data Engineer", duree: "140h+" },
    ],
  },
];

/* ── Composants internes ────────────────────────────────── */

const NIVEAU_CONFIG: Record<Niveau, { cls: string; couleur: string; label: string }> = {
  "Débutant":      { cls: "badge-teal",  couleur: "#0E7490", label: "Débutant" },
  "Intermédiaire": { cls: "badge-amber", couleur: "#B45309", label: "Intermédiaire" },
  "Avancé":        { cls: "badge-rose",  couleur: "#BE123C", label: "Avancé" },
};

function CertCard({
  cert,
  niveau,
  providerColor,
}: {
  cert: Certification;
  niveau: Niveau;
  providerColor: string;
}) {
  const n = NIVEAU_CONFIG[niveau];
  return (
    <div style={{
      background: "#fff",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "14px 16px",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minWidth: 0,
    }}>
      {/* Barre de couleur provider en haut */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 3,
        background: providerColor,
        borderRadius: "10px 10px 0 0",
      }} />

      {/* Badges */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
        <span className={`badge ${n.cls}`}>{n.label}</span>
        {cert.gratuit && (
          <span className="badge badge-success">Gratuit</span>
        )}
      </div>

      {/* Nom */}
      <p style={{
        fontSize: 13.5,
        fontWeight: 700,
        color: "var(--text)",
        lineHeight: 1.3,
        fontFamily: "var(--font-display)",
      }}>
        {cert.nom}
      </p>

      {/* Code si dispo */}
      {cert.code && (
        <p style={{
          fontSize: 11,
          color: providerColor,
          fontWeight: 700,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.05em",
        }}>
          {cert.code}
        </p>
      )}

      {/* Durée */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 100,
        width: "fit-content",
        fontSize: 11,
        color: "var(--muted)",
      }}>
        <span>⏱</span>
        {cert.duree}
      </div>
    </div>
  );
}

function ColonneNiveau({
  niveau,
  certs,
  providerColor,
  isDbt,
}: {
  niveau: Niveau;
  certs: Certification[];
  providerColor: string;
  isDbt: boolean;
}) {
  const n = NIVEAU_CONFIG[niveau];
  const vide = certs.length === 0;

  return (
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header niveau */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        paddingBottom: 10,
        borderBottom: `2px solid ${vide ? "#F1F5F9" : n.couleur}22`,
      }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: vide ? "var(--border)" : n.couleur,
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: vide ? "var(--faint)" : n.couleur,
        }}>
          {n.label}
        </span>
      </div>

      {/* Cartes ou placeholder */}
      {vide ? (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 80,
          border: "1.5px dashed var(--border)",
          borderRadius: 10,
          padding: 16,
        }}>
          <p style={{
            fontSize: 11.5,
            color: "var(--faint)",
            textAlign: "center",
            lineHeight: 1.5,
          }}>
            {isDbt && niveau === "Débutant"
              ? "Prérequis : SQL avancé + Python"
              : isDbt && niveau === "Avancé"
              ? "Pas encore disponible officiellement"
              : "Non disponible"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {certs.map((c) => (
            <CertCard
              key={c.nom}
              cert={c}
              niveau={niveau}
              providerColor={providerColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Flèche SVG entre les niveaux */
function Fleche({ couleur }: { couleur: string }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      paddingTop: 32,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M6 14 H22 M16 8 L22 14 L16 20"
          stroke={couleur}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ProviderRoadmap({ provider }: { provider: Provider }) {
  const isDbt = provider.id === "dbt";
  return (
    <div className="card" style={{ padding: "28px 24px", overflow: "hidden" }}>
      {/* Header provider */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        marginBottom: 24,
        paddingBottom: 20,
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Logo / initiales */}
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          background: provider.couleurBg,
          border: `1.5px solid ${provider.couleurBorder}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 800,
            color: provider.couleur,
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.02em",
          }}>
            {provider.nom.substring(0, 3).toUpperCase()}
          </span>
        </div>

        <div>
          <h3 style={{
            fontFamily: "var(--font-display)",
            fontSize: 18,
            fontWeight: 800,
            color: provider.couleur,
            marginBottom: 2,
          }}>
            {provider.nom}
          </h3>
          <p style={{ fontSize: 12, color: "var(--muted)" }}>
            {provider.debutant.length + provider.intermediaire.length + provider.avance.length} certification{provider.debutant.length + provider.intermediaire.length + provider.avance.length > 1 ? "s" : ""} dans ce parcours
          </p>
        </div>
      </div>

      {/* Grille 3 colonnes avec flèches */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto 1fr",
        gap: 0,
        alignItems: "start",
      }}>
        <ColonneNiveau
          niveau="Débutant"
          certs={provider.debutant}
          providerColor={provider.couleur}
          isDbt={isDbt}
        />
        <Fleche couleur={provider.couleur} />
        <ColonneNiveau
          niveau="Intermédiaire"
          certs={provider.intermediaire}
          providerColor={provider.couleur}
          isDbt={isDbt}
        />
        <Fleche couleur={provider.couleur} />
        <ColonneNiveau
          niveau="Avancé"
          certs={provider.avance}
          providerColor={provider.couleur}
          isDbt={isDbt}
        />
      </div>
    </div>
  );
}

/* ── Page principale ─────────────────────────────────────── */
export default function RoadmapCertificationsPage() {
  return (
    <main>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "72px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="orb" style={{ width: 600, height: 600, background: "rgba(124,58,237,0.1)", top: -160, right: -100 }} />
        <div className="orb" style={{ width: 400, height: 400, background: "rgba(14,165,233,0.07)", bottom: -120, left: "10%", animationDelay: "7s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ maxWidth: 1240, margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <Link href="/certifications" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: "var(--muted)",
              padding: "4px 10px",
              background: "white",
              border: "1px solid var(--border)",
              borderRadius: 100,
            }}>
              ← Toutes les certifications
            </Link>
          </div>

          <span className="badge badge-indigo" style={{ marginBottom: 16 }}>🗺 Roadmap</span>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4.5vw, 3.6rem)",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 16,
            maxWidth: 700,
          }}>
            Roadmap certifications{" "}
            <span className="text-gradient">data 2026</span>
          </h1>

          <p style={{
            fontSize: 17,
            color: "#64748B",
            maxWidth: 560,
            lineHeight: 1.75,
            marginBottom: 40,
          }}>
            Dans quel ordre passer tes certifications ? Pour chaque provider, le parcours visuel de débutant à expert.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { n: "166", l: "certifications répertoriées" },
              { n: "8",   l: "providers couverts" },
              { n: "3",   l: "niveaux" },
            ].map(({ n, l }) => (
              <div key={l} className="card" style={{
                padding: "12px 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
              }}>
                <span className="stat-num" style={{ fontSize: "1.7rem" }}>{n}</span>
                <span style={{ color: "#94A3B8", fontSize: 12 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT LIRE CETTE ROADMAP ─────────────────────── */}
      <section style={{
        padding: "48px 24px",
        background: "#F8FAFC",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <span className="section-label">Guide de lecture</span>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: 24,
          }}>
            Comment lire cette roadmap
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {[
              {
                step: "1",
                titre: "Commence par le niveau Débutant",
                desc: "Chaque provider a une certification d'entrée. AWS Cloud Practitioner, Azure Fundamentals ou Google Cloud Digital Leader sont parfaits pour démarrer sans prérequis.",
                couleur: "#0E7490",
                bg: "#ECFEFF",
                border: "#A5F3FC",
              },
              {
                step: "2",
                titre: "Monte en Intermédiaire",
                desc: "Une fois les bases validées, spécialise-toi : Data Engineer, ML Engineer, Analytics Engineer. Ces certifications sont celles que les recruteurs cherchent en priorité.",
                couleur: "#B45309",
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                step: "3",
                titre: "Valide l'Avancé sur ton domaine",
                desc: "Les certifications Avancées (Professional, Expert) distinguent les senior profiles. Ne les passe qu'après 1-2 ans de pratique réelle — les examens sont exigeants.",
                couleur: "#BE123C",
                bg: "#FFF1F2",
                border: "#FECDD3",
              },
            ].map(({ step, titre, desc, couleur, bg, border }) => (
              <div key={step} style={{
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 14,
                padding: "22px 24px",
                display: "flex",
                gap: 16,
              }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: couleur,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  flexShrink: 0,
                }}>
                  {step}
                </div>
                <div>
                  <h3 style={{
                    fontSize: 14.5,
                    fontWeight: 700,
                    color: couleur,
                    fontFamily: "var(--font-display)",
                    marginBottom: 6,
                  }}>
                    {titre}
                  </h3>
                  <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.65 }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Conseil clé */}
          <div style={{
            marginTop: 20,
            padding: "14px 20px",
            background: "#EDE9FE",
            border: "1.5px solid #C4B5FD",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>💡</span>
            <p style={{ fontSize: 13.5, color: "#5B21B6", lineHeight: 1.55 }}>
              <strong>Conseil de départ :</strong> commence par le Cloud Practitioner (ou équivalent) du provider de ton employeur ou de ta stack cible. C'est l'investissement avec le meilleur ROI — 30 à 60h de prep pour une certification reconnue partout.
            </p>
          </div>
        </div>
      </section>

      {/* ── ROADMAPS PAR PROVIDER ──────────────────────────── */}
      <section style={{ padding: "64px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 40 }}>
            <span className="section-label">8 providers</span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              fontWeight: 800,
              color: "#0F172A",
            }}>
              Parcours par provider
            </h2>
          </div>

          {/* Légende des niveaux */}
          <div style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 40,
            padding: "14px 18px",
            background: "var(--surface-2)",
            borderRadius: 10,
            border: "1px solid var(--border)",
            alignItems: "center",
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Légende</span>
            {(["Débutant", "Intermédiaire", "Avancé"] as Niveau[]).map((n) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: NIVEAU_CONFIG[n].couleur,
                }} />
                <span className={`badge ${NIVEAU_CONFIG[n].cls}`}>{n}</span>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="badge badge-success">Gratuit</span>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>= aucun frais d&apos;examen</span>
            </div>
          </div>

          {/* Une card par provider */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {PROVIDERS.map((provider) => (
              <ProviderRoadmap key={provider.id} provider={provider} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PAR OU COMMENCER ───────────────────────────────── */}
      <section style={{
        padding: "64px 24px",
        background: "#F8FAFC",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Recommandations</span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: 8,
            }}>
              Par où commencer ?
            </h2>
            <p style={{ fontSize: 15, color: "var(--muted)", maxWidth: 560 }}>
              Selon ton profil cible et ton point de départ actuel.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}>
            {[
              {
                emoji: "⚙️",
                profil: "Data Engineer",
                certs: ["AWS DEA-C01", "GCP Professional Data Engineer"],
                pourquoi: "Ces certifications valident les compétences pipelines, stockage et orchestration — le coeur du métier.",
                couleur: "#7C3AED",
                bg: "#EDE9FE",
                border: "#C4B5FD",
              },
              {
                emoji: "🧬",
                profil: "Data Scientist / ML",
                certs: ["AWS MLA-C01", "GCP Professional ML Engineer"],
                pourquoi: "Centrées sur l'entraînement, l'évaluation et le déploiement de modèles. AWS MLA-C01 est particulièrement demandé en France.",
                couleur: "#0E7490",
                bg: "#ECFEFF",
                border: "#A5F3FC",
              },
              {
                emoji: "📊",
                profil: "Analytics Engineer",
                certs: ["dbt Analytics Engineering", "Snowflake SnowPro Core"],
                pourquoi: "La combinaison dbt + Snowflake est la stack analytics engineer standard du marché en 2026.",
                couleur: "#B45309",
                bg: "#FFFBEB",
                border: "#FDE68A",
              },
              {
                emoji: "🚀",
                profil: "Départ de zéro",
                certs: ["AWS Cloud Practitioner", "Google Cloud Digital Leader"],
                pourquoi: "Ces certifications ne demandent aucun prérequis technique et prouvent que tu maîtrises les concepts cloud fondamentaux.",
                couleur: "#15803D",
                bg: "#F0FDF4",
                border: "#86EFAC",
              },
            ].map(({ emoji, profil, certs, pourquoi, couleur, bg, border }) => (
              <div key={profil} style={{
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: 14,
                padding: "22px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{emoji}</span>
                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: couleur,
                  }}>
                    {profil}
                  </h3>
                </div>

                {/* Certifs recommandées */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {certs.map((c) => (
                    <div key={c} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 10px",
                      background: "#fff",
                      border: `1px solid ${border}`,
                      borderRadius: 8,
                    }}>
                      <div style={{
                        width: 6, height: 6,
                        borderRadius: "50%",
                        background: couleur,
                        flexShrink: 0,
                      }} />
                      <span style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: couleur,
                        fontFamily: "var(--font-mono)",
                      }}>
                        {c}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Explication */}
                <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.65 }}>
                  {pourquoi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{
        padding: "72px 24px",
        background: "#fff",
      }}>
        <div style={{
          maxWidth: 700,
          margin: "0 auto",
          textAlign: "center",
        }}>
          <span className="badge badge-indigo" style={{ marginBottom: 18 }}>166 certifications</span>

          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.6rem, 2.8vw, 2.2rem)",
            fontWeight: 800,
            color: "#0F172A",
            marginBottom: 12,
            lineHeight: 1.2,
          }}>
            Toutes les certifications{" "}
            <span className="text-gradient">en détail</span>
          </h2>

          <p style={{
            fontSize: 15.5,
            color: "var(--muted)",
            lineHeight: 1.75,
            marginBottom: 32,
          }}>
            Niveau, durée de préparation, coût, validité, popularité marché et compétences associées. Filtre par profil, outil ou niveau.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/certifications" className="btn-primary">
              Voir toutes les certifications →
            </Link>
            <Link href="/formations" className="btn-secondary">
              Ressources de préparation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
