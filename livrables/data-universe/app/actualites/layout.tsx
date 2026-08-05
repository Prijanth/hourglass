import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités Data & IA en français 2026 | Data Universe",
  description: "Analyses et décryptages data & IA en français : nouveaux modèles LLM, outils data, réglementations (AI Act, RGPD), salaires et tendances marché 2026 — sans jargon, par des praticiens.",
  openGraph: {
    title: "Actualités Data & IA en français 2026",
    description: "Analyses data & IA en français : nouveaux LLM, outils data, AI Act, marché. Par des praticiens, sans jargon.",
    url: "https://data-universe.fr/actualites",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
