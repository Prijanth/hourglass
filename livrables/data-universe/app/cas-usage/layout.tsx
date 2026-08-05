import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cas d'usage Data & IA en entreprise — 104 projets réels | Data Universe",
  description: "104 cas d'usage data & IA documentés : stack technique, problème résolu et résultats mesurés. Finance, santé, retail, industrie — Machine Learning, NLP, Data Engineering, IA Générative.",
  openGraph: {
    title: "Cas d'usage Data & IA — 104 projets réels avec résultats",
    description: "Machine Learning, NLP, IA Générative : 104 projets data réels avec stack, problème et résultats mesurés — tous secteurs.",
    url: "https://data-universe.fr/cas-usage",
    siteName: "Data Universe",
    locale: "fr_FR",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
