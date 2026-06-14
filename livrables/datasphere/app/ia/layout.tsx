import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Intelligence Artificielle — Actualités & Enjeux 2026 | DataSphère",description: "Tout sur l'IA en français : modèles de fondation, AI Act, risques, LLMs, IA générative. Analyses et actualités pour les professionnels data."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
