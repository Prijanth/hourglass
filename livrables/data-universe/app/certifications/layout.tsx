import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certifications Data & IA 2026 — 166 fiches complètes | Data Universe",
  description: "Comparez 166 certifications data & IA : AWS, Azure, GCP, Databricks, Snowflake, dbt, Dataiku. Coût, durée de préparation, niveau requis et valeur marché 2026 — tout en français.",
  openGraph: {
    title: "Certifications Data & IA 2026 — 166 fiches complètes",
    description: "AWS, Azure, GCP, Databricks, Snowflake, dbt — coût, durée et valeur marché pour chaque certification data.",
    url: "https://data-universe.fr/certifications",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
