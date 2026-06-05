import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toutes les certifications Data & IA 2025 | DataSphère",description: "100+ certifications data répertoriées : AWS, Azure, GCP, Databricks, Snowflake, Dataiku. Niveau, durée, coût et popularité marché pour chaque certification."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
