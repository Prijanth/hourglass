import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossaire Data & IA — 246 définitions en français | Data Universe",
  description: "246 définitions data & IA avec exemples concrets : Machine Learning, Data Lake, Feature Store, RAG, LLM, Data Mesh. Chaque terme expliqué clairement en français, sans jargon inutile.",
  openGraph: {
    title: "Glossaire Data & IA — 246 définitions en français",
    description: "Machine Learning, Data Lake, LLM, RAG, Data Mesh — 246 termes data & IA expliqués simplement avec exemples concrets.",
    url: "https://data-universe.fr/glossaire",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
