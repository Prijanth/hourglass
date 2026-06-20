import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents IA — Panorama et cas d'usage | Data Universe",
  description: "Tour d'horizon des agents IA en 2026 : architectures, frameworks, outils et exemples de déploiement en production.",
};

export default function AgentsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
