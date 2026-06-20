"use client";

const OUTIL_COLORS: Record<string, string> = {
  AWS:          "#FF9900",
  Azure:        "#0078D4",
  GCP:          "#4285F4",
  Databricks:   "#FF3621",
  Snowflake:    "#29B5E8",
  dbt:          "#FF694A",
  Dataiku:      "#2AB1AC",
  "Power BI":   "#F2C811",
  IBM:          "#054ADA",
  Tableau:      "#E97627",
  Généraliste:  "#7C3AED",
  TensorFlow:   "#FF6F00",
  SAS:          "#007CC2",
};

type Cert = {
  nom: string;
  outil: string;
  popularite: number;
  niveau: string;
};

export function CertPopularityChart({ certs }: { certs: Cert[] }) {
  const top = [...certs]
    .sort((a, b) => b.popularite - a.popularite)
    .slice(0, 12);

  const max = top[0]?.popularite ?? 100;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {top.map((cert, i) => {
        const color = OUTIL_COLORS[cert.outil] ?? "#7C3AED";
        const pct   = (cert.popularite / max) * 100;
        const nom   = cert.nom.length > 42 ? cert.nom.slice(0, 42) + "…" : cert.nom;
        return (
          <div key={cert.nom + i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Rang */}
            <span style={{
              width: 20, fontSize: 11, fontWeight: 700, color: i < 3 ? color : "var(--faint)",
              fontFamily: "var(--font-mono)", flexShrink: 0, textAlign: "right",
            }}>
              {i + 1}
            </span>
            {/* Label outil */}
            <span style={{
              width: 72, fontSize: 10.5, fontWeight: 700, color, flexShrink: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {cert.outil}
            </span>
            {/* Nom certif */}
            <span style={{
              flex: 1, fontSize: 11.5, color: "var(--text)", lineHeight: 1.3,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              minWidth: 0,
            }}>
              {nom}
            </span>
            {/* Barre */}
            <div style={{
              width: 120, height: 6, background: "var(--surface-3)",
              borderRadius: 10, overflow: "hidden", flexShrink: 0,
            }}>
              <div style={{
                width: `${pct}%`, height: "100%",
                background: color, borderRadius: 10,
                transition: "width 0.4s ease",
              }} />
            </div>
            {/* Score */}
            <span style={{
              width: 30, fontSize: 11.5, fontWeight: 700, color,
              fontFamily: "var(--font-mono)", flexShrink: 0, textAlign: "right",
            }}>
              {cert.popularite}
            </span>
          </div>
        );
      })}
      <p style={{ fontSize: 11, color: "var(--faint)", marginTop: 8 }}>
        Score de popularité basé sur l&apos;analyse des offres d&apos;emploi data francophones 2026.
      </p>
    </div>
  );
}
