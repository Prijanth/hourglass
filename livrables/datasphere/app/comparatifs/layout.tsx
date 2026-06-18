import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparatifs d'outils data — Snowflake vs Databricks, Pandas vs Polars | Data Universe",
  description: "Comparatifs honnêtes des outils data les plus utilisés en France : Snowflake vs Databricks, Power BI vs Tableau, Pandas vs Polars, dbt Core vs dbt Cloud. Scores, verdicts et conseils de praticiens.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
