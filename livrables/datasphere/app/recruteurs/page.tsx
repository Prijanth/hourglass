import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Recruteurs data & IA — Publiez vos offres | Data Universe",
  description:
    "Recrutez les meilleurs profils data & IA francophones. 2 400 professionnels reçoivent vos offres chaque semaine. Dépôt gratuit, audience qualifiée.",
};

const PROFILS = [
  {
    titre: "Data Engineer",
    desc: "Pipeline, ETL, orchestration",
    badge: "Très demandé",
    badgeStyle: "badge-danger",
    emoji: "⚙️",
  },
  {
    titre: "Data Scientist",
    desc: "ML, modélisation, Python",
    badge: "Demandé",
    badgeStyle: "badge-indigo",
    emoji: "🔬",
  },
  {
    titre: "Analytics Engineer",
    desc: "dbt, SQL, BI",
    badge: "Très demandé",
    badgeStyle: "badge-danger",
    emoji: "📊",
  },
  {
    titre: "AI Engineer",
    desc: "LLMs, RAG, agents IA",
    badge: "Profil rare ⚡",
    badgeStyle: "badge-amber",
    emoji: "🤖",
  },
  {
    titre: "Data Analyst",
    desc: "SQL, Power BI, reporting",
    badge: "Demandé",
    badgeStyle: "badge-indigo",
    emoji: "📈",
  },
  {
    titre: "ML Engineer",
    desc: "MLOps, déploiement, Python",
    badge: "Demandé",
    badgeStyle: "badge-indigo",
    emoji: "🛠️",
  },
];

const AVANTAGES = [
  {
    titre: "100 % gratuit",
    desc: "Aucun frais de publication. Diffusion immédiate auprès de l'audience Data Universe, sans abonnement ni commission.",
  },
  {
    titre: "Audience qualifiée",
    desc: "Des praticiens data en poste ou en veille active — pas des curieux. Notre communauté est composée de professionnels ayant suivi des parcours techniques.",
  },
  {
    titre: "Profils techniques validés",
    desc: "Les membres Data Universe passent des quiz de niveau et suivent des roadmaps de certification. Vous ciblez des candidats qui savent ce qu'ils font.",
  },
  {
    titre: "Ciblage France / francophone",
    desc: "Une audience concentrée sur la France, la Belgique et le Québec. Idéal pour les postes en français ou les offres remote Europe.",
  },
];

const ETAPES = [
  {
    num: "01",
    titre: "Remplissez le formulaire",
    desc: "Titre du poste, description, stack technique, remote ou présentiel — 5 minutes suffisent.",
  },
  {
    num: "02",
    titre: "Validation sous 24 h",
    desc: "L'équipe Data Universe vérifie votre offre et vous confirme la publication par e-mail.",
  },
  {
    num: "03",
    titre: "Diffusion auprès des 2 400 abonnés",
    desc: "Votre offre paraît dans la newsletter hebdomadaire et sur la page des offres d'emploi du site.",
  },
];

const CLIENTS = [
  "BNP Paribas",
  "Société Générale",
  "AXA",
  "SNCF",
  "Decathlon",
  "Capgemini",
  "Sopra Steria",
  "Accenture",
  "Orange",
  "Engie",
  "Cdiscount",
  "Leboncoin",
];

export default function RecruteursPage() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0B0F29 0%, #0F1B35 100%)",
          padding: "80px 24px 72px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Orbs */}
        <div
          style={{
            position: "absolute",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(124,58,237,0.12)",
            top: -160,
            right: -100,
            filter: "blur(90px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "rgba(8,145,178,0.07)",
            bottom: -80,
            left: "15%",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 820,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Label */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 100,
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              fontSize: 11,
              fontWeight: 700,
              color: "#A78BFA",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            📢 Espace recruteurs
          </span>

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: 20,
            }}
          >
            Recrutez les meilleurs
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #A78BFA, #38BDF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              profils data & IA
            </span>
          </h1>

          <p
            style={{
              fontSize: 17,
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.75,
              maxWidth: 580,
              margin: "0 auto 36px",
            }}
          >
            2 400 data professionnels francophones reçoivent vos offres chaque
            semaine. Dépôt gratuit, audience qualifiée, diffusion immédiate.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 52,
            }}
          >
            <Link
              href="/jobs/deposer"
              className="btn-primary"
              style={{ fontSize: 15, padding: "13px 28px" }}
            >
              Publier une offre gratuitement →
            </Link>
            <Link
              href="/metiers"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 12,
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--font-display)",
                transition: "background 0.2s, border-color 0.2s",
              }}
            >
              Voir les profils disponibles
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              justifyContent: "center",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "24px 0",
              maxWidth: 560,
              margin: "0 auto",
            }}
          >
            {[
              { val: "2 400", label: "abonnés actifs" },
              { val: "8", label: "profils couverts" },
              { val: "Gratuit", label: "toujours" },
            ].map((s, i) => (
              <div
                key={s.label}
                style={{
                  flex: "1 1 0",
                  minWidth: 120,
                  textAlign: "center",
                  padding: "0 20px",
                  borderLeft:
                    i > 0 ? "1px solid rgba(255,255,255,0.12)" : "none",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.4rem, 3vw, 2rem)",
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    marginBottom: 4,
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Logos entreprises — marquee ──────────────────────── */}
      <section
        style={{
          padding: "56px 0 52px",
          background: "var(--bg-subtle)",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32, padding: "0 24px" }}>
          <span className="section-label">Ils recrutent sur Data Universe</span>
        </div>

        {/* Marquee */}
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div className="marquee-track" style={{ gap: 12 }}>
            {[...CLIENTS, ...CLIENTS].map((name, i) => (
              <div
                key={`${name}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  background: "#FFFFFF",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink-3)",
                  whiteSpace: "nowrap",
                  boxShadow: "var(--shadow-xs)",
                  marginRight: 12,
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Profils disponibles ──────────────────────────────── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Profils disponibles</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 10,
            }}
          >
            Quels profils trouverez-vous ?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "var(--muted)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Notre communauté couvre l&apos;ensemble du spectre data. Publiez une offre
            ciblée pour le profil que vous cherchez.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {PROFILS.map((p) => (
            <div
              key={p.titre}
              className="card"
              style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: 28,
                      width: 44,
                      height: 44,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "var(--navy)",
                      borderRadius: 10,
                      flexShrink: 0,
                    }}
                  >
                    {p.emoji}
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 800,
                        color: "var(--text)",
                        marginBottom: 2,
                      }}
                    >
                      {p.titre}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--muted)" }}>{p.desc}</p>
                  </div>
                </div>
                <span className={`badge ${p.badgeStyle}`} style={{ flexShrink: 0 }}>
                  {p.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────── */}
      <section
        style={{
          background: "var(--navy)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "72px 24px",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <span className="section-label">3 étapes simples</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                fontWeight: 800,
                color: "var(--text)",
              }}
            >
              Comment ça marche ?
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 24,
              position: "relative",
            }}
          >
            {ETAPES.map((e, i) => (
              <div
                key={e.num}
                className="card"
                style={{ padding: "28px 26px", position: "relative" }}
              >
                {/* Connecteur */}
                {i < ETAPES.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      top: 38,
                      right: -14,
                      width: 28,
                      height: 2,
                      background: "linear-gradient(90deg, var(--indigo), transparent)",
                      zIndex: 1,
                      display: "none", // masqué sur mobile, visible via CSS sur desktop
                    }}
                  />
                )}
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    background: "linear-gradient(135deg, #7C3AED, #0EA5E9)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    lineHeight: 1,
                    marginBottom: 14,
                  }}
                >
                  {e.num}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "var(--text)",
                    marginBottom: 8,
                  }}
                >
                  {e.titre}
                </h3>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>
                  {e.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avantages ────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <span className="section-label">Pourquoi Data Universe</span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
              fontWeight: 800,
              color: "var(--text)",
            }}
          >
            Ce qui nous distingue
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {AVANTAGES.map((a) => (
            <div
              key={a.titre}
              className="card-feature"
              style={{ padding: "26px 24px", display: "flex", gap: 16 }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--indigo-tint)",
                  border: "1px solid var(--indigo-border)",
                  borderRadius: 8,
                  fontSize: 14,
                  flexShrink: 0,
                  color: "var(--indigo)",
                  fontWeight: 800,
                }}
              >
                ✓
              </span>
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--text)",
                    marginBottom: 6,
                  }}
                >
                  {a.titre}
                </h3>
                <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.7 }}>
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #6D28D9 100%)",
          padding: "72px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            top: -120,
            right: -60,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(56,189,248,0.1)",
            bottom: -80,
            left: "10%",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: 620,
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              fontWeight: 800,
              color: "#FFFFFF",
              letterSpacing: "-0.025em",
              marginBottom: 14,
              lineHeight: 1.2,
            }}
          >
            Prêt à trouver votre prochain
            <br />
            Data Engineer ?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 460,
              margin: "0 auto 36px",
            }}
          >
            Publiez votre offre en 5 minutes. Gratuit, sans engagement, visible
            auprès de 2 400 professionnels de la data.
          </p>
          <Link
            href="/jobs/deposer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 30px",
              background: "#FFFFFF",
              color: "#7C3AED",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 800,
              fontFamily: "var(--font-display)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            Publier une offre gratuitement →
          </Link>
        </div>
      </section>
    </main>
  );
}
