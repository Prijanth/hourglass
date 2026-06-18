import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encyclopédie Data & IA — 60+ concepts expliqués | Data Universe",description: "60+ concepts data et IA expliqués simplement en français : Machine Learning, Cloud, Gouvernance, DataOps, LLM. Avec exemples concrets."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
