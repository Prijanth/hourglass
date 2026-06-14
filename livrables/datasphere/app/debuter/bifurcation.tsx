"use client";

import { useState } from "react";
import Link from "next/link";

type Choix = "zero" | "profil" | null;

type SousProfil = {
  emoji: string;
  titre: string;
  cible: string;
  outils: string;
  duree: string;
  certifs: string[];
  href: string;
};

const sousProfils: SousProfil[] = [
  {
    emoji: "🔧",
    titre: "Dev backend",
    cible: "Data Engineer",
    outils: "dbt, Airflow, Spark",
    duree: "3-6 mois",
    certifs: ["AWS Data Engineer Associate", "dbt Fundamentals (gratuit)"],
    href: "/metiers/data-engineer",
  },
  {
    emoji: "📊",
    titre: "Analyste métier",
    cible: "Data Analyst / Analytics Engineer",
    outils: "SQL avancé, dbt, Looker",
    duree: "2-4 mois",
    certifs: ["Google Data Analytics Certificate", "dbt Fundamentals (gratuit)"],
    href: "/metiers/data-analyst",
  },
  {
    emoji: "🤖",
    titre: "Ingénieur",
    cible: "ML Engineer / Data Scientist",
    outils: "Python ML, MLflow, SageMaker",
    duree: "4-8 mois",
    certifs: ["AWS ML Specialty", "Google Professional ML Engineer"],
    href: "/metiers/data-scientist",
  },
  {
    emoji: "💡",
    titre: "Consultant IT",
    cible: "Product Owner Data / Data Architect",
    outils: "SQL, gouvernance, DAMA",
    duree: "3-5 mois",
    certifs: ["AWS Cloud Practitioner", "Certification CDMP (DAMA)"],
    href: "/metiers",
  },
];

export function Bifurcation() {
  const [choix, setChoix] = useState<Choix>(null);
  const [sousProfil, setSousProfil] = useState<SousProfil | null>(null);

  const handleChoix = (c: Choix) => {
    setChoix(c);
    setSousProfil(null);
  };

  return (
    <div>
      {/* Cards de bifurcation */}
      <div
        style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Card 1 — Je pars de zéro */}
        <button
          onClick={() => handleChoix("zero")}
          style={{
            flex: "1 1 280px",
            minWidth: 280,
            maxWidth: 400,
            textAlign: "left",
            padding: "28px 28px 24px",
            borderRadius: 16,
            border: choix === "zero"
              ? "2px solid #7C3AED"
              : "2px solid #DDD6FE",
            background: choix === "zero" ? "#EDE9FE" : "#F5F3FF",
            cursor: "pointer",
            position: "relative",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s",
            boxShadow: choix === "zero"
              ? "0 4px 16px rgba(124,58,237,0.18)"
              : "0 1px 4px rgba(0,0,0,0.04)",
            transform: choix === "zero" ? "translateY(-2px)" : "translateY(0)",
          }}
          aria-pressed={choix === "zero"}
        >
          {choix === "zero" && (
            <span
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#7C3AED",
                color: "#fff",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          )}
          <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>🚀</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 800,
              color: "#3B0764",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            Je pars de zéro
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "#5B21B6",
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            Aucune expérience en data, je veux me reconvertir ou me lancer
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#7C3AED",
              background: "rgba(124,58,237,0.08)",
              borderRadius: 8,
              padding: "6px 10px",
              marginBottom: 18,
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700 }}>Vient de :</span> Finance, Marketing, RH, Commerce, ou reconversion totale
          </div>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: choix === "zero" ? "#7C3AED" : "#94A3B8",
              transition: "color 0.2s",
            }}
          >
            {choix === "zero" ? "Ce parcours est fait pour moi ✓" : "Ce parcours est fait pour moi →"}
          </div>
        </button>

        {/* Card 2 — J'ai déjà un profil */}
        <button
          onClick={() => handleChoix("profil")}
          style={{
            flex: "1 1 280px",
            minWidth: 280,
            maxWidth: 400,
            textAlign: "left",
            padding: "28px 28px 24px",
            borderRadius: 16,
            border: choix === "profil"
              ? "2px solid #0891B2"
              : "2px solid #BAE6FD",
            background: choix === "profil" ? "#E0F2FE" : "#F0F9FF",
            cursor: "pointer",
            position: "relative",
            transition: "border-color 0.2s, background 0.2s, box-shadow 0.2s, transform 0.15s",
            boxShadow: choix === "profil"
              ? "0 4px 16px rgba(8,145,178,0.18)"
              : "0 1px 4px rgba(0,0,0,0.04)",
            transform: choix === "profil" ? "translateY(-2px)" : "translateY(0)",
          }}
          aria-pressed={choix === "profil"}
        >
          {choix === "profil" && (
            <span
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "#0891B2",
                color: "#fff",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ✓
            </span>
          )}
          <div style={{ fontSize: 36, marginBottom: 14, lineHeight: 1 }}>💼</div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 800,
              color: "#0C4A6E",
              marginBottom: 8,
              lineHeight: 1.2,
            }}
          >
            {"J'ai déjà des bases"}
          </div>
          <div
            style={{
              fontSize: 13.5,
              color: "#0369A1",
              lineHeight: 1.6,
              marginBottom: 12,
            }}
          >
            Je travaille déjà dans la tech ou la data, je veux monter en compétences
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#0891B2",
              background: "rgba(8,145,178,0.08)",
              borderRadius: 8,
              padding: "6px 10px",
              marginBottom: 18,
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700 }}>Vient de :</span> Dev backend, Analyste, Consultant IT, Ingénieur
          </div>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: choix === "profil" ? "#0891B2" : "#94A3B8",
              transition: "color 0.2s",
            }}
          >
            {choix === "profil" ? "Je veux m'orienter ✓" : "Je veux m'orienter →"}
          </div>
        </button>
      </div>

      {/* ── Recommandations "Je pars de zéro" ── */}
      {choix === "zero" && (
        <div
          style={{
            marginTop: 32,
            padding: "32px 28px",
            borderRadius: 18,
            background: "#FAFBFF",
            border: "1.5px solid #DDD6FE",
            animation: "fadeSlideIn 0.3s ease both",
          }}
        >
          <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 20 }}>🎯</span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 800,
                color: "#3B0764",
              }}
            >
              Ton plan de démarrage
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "1px solid #DDD6FE",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                1re étape
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: 4,
                }}
              >
                SQL
              </div>
              <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5 }}>
                SQLZoo, Mode Analytics
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "inline-block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7C3AED",
                  background: "rgba(124,58,237,0.08)",
                  borderRadius: 6,
                  padding: "2px 8px",
                }}
              >
                2-4 semaines
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #DDD6FE",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                Certif de départ
              </div>
              <div style={{ fontSize: 12.5, color: "#0F172A", lineHeight: 1.5 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>Google Data Analytics</div>
                <div style={{ color: "#64748B" }}>ou AWS Cloud Practitioner</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #DDD6FE",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                Métiers accessibles
              </div>
              <div style={{ fontSize: 12.5, color: "#0F172A", lineHeight: 1.6 }}>
                <div>Data Analyst</div>
                <div>Product Owner Data</div>
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #DDD6FE",
                borderRadius: 12,
                padding: "16px 18px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                  color: "#7C3AED",
                  marginBottom: 8,
                }}
              >
                Ressources gratuites
              </div>
              <div style={{ fontSize: 12.5, color: "#0F172A", lineHeight: 1.7 }}>
                <div>SQLZoo</div>
                <div>Khan Academy Statistics</div>
                <div>Google Skillshop</div>
              </div>
            </div>
          </div>

          <Link
            href="/certifications?q=débutant"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 20px",
              borderRadius: 10,
              background: "#7C3AED",
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "var(--font-display)",
            }}
          >
            Voir les certifs pour débutants →
          </Link>
        </div>
      )}

      {/* ── Grille sous-profils "J'ai déjà un profil" ── */}
      {choix === "profil" && (
        <div
          style={{
            marginTop: 32,
            animation: "fadeSlideIn 0.3s ease both",
          }}
        >
          <style>{`@keyframes fadeSlideIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <p
            style={{
              fontSize: 13,
              color: "#64748B",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Sélectionne ton profil actuel pour voir le chemin recommandé
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: sousProfil ? 24 : 0,
            }}
          >
            {sousProfils.map((sp) => {
              const isActive = sousProfil?.titre === sp.titre;
              return (
                <button
                  key={sp.titre}
                  onClick={() => setSousProfil(isActive ? null : sp)}
                  style={{
                    textAlign: "left",
                    padding: "18px 20px",
                    borderRadius: 14,
                    border: isActive
                      ? "2px solid #0891B2"
                      : "1.5px solid #BAE6FD",
                    background: isActive ? "#E0F2FE" : "#F0F9FF",
                    cursor: "pointer",
                    transition: "border-color 0.2s, background 0.2s, transform 0.15s",
                    transform: isActive ? "translateY(-2px)" : "translateY(0)",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(8,145,178,0.15)"
                      : "none",
                  }}
                  aria-pressed={isActive}
                >
                  <div style={{ fontSize: 26, marginBottom: 8, lineHeight: 1 }}>
                    {sp.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#0C4A6E",
                      marginBottom: 4,
                    }}
                  >
                    {sp.titre}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#0369A1",
                      marginBottom: 6,
                      lineHeight: 1.4,
                    }}
                  >
                    → {sp.cible}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#0891B2",
                      background: "rgba(8,145,178,0.08)",
                      borderRadius: 6,
                      padding: "2px 8px",
                      display: "inline-block",
                    }}
                  >
                    {sp.duree}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Détail sous-profil sélectionné */}
          {sousProfil && (
            <div
              style={{
                padding: "24px 26px",
                borderRadius: 16,
                background: "#F0F9FF",
                border: "1.5px solid #0891B2",
                animation: "fadeSlideIn 0.25s ease both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <span style={{ fontSize: 22 }}>{sousProfil.emoji}</span>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 15,
                      fontWeight: 800,
                      color: "#0C4A6E",
                    }}
                  >
                    {sousProfil.titre} → {sousProfil.cible}
                  </div>
                  <div style={{ fontSize: 12, color: "#0891B2" }}>
                    Durée estimée : {sousProfil.duree}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      color: "#0891B2",
                      marginBottom: 8,
                    }}
                  >
                    Compétences à acquérir
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#0F172A",
                      fontWeight: 600,
                    }}
                  >
                    {sousProfil.outils}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                      color: "#0891B2",
                      marginBottom: 8,
                    }}
                  >
                    Certifications recommandées
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {sousProfil.certifs.map((c) => (
                      <div
                        key={c}
                        style={{
                          fontSize: 12,
                          color: "#0F172A",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 6,
                        }}
                      >
                        <span style={{ color: "#0891B2", marginTop: 1 }}>›</span>
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href={sousProfil.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "#0891B2",
                  color: "#fff",
                  fontSize: 13.5,
                  fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "var(--font-display)",
                }}
              >
                Voir la fiche métier →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
