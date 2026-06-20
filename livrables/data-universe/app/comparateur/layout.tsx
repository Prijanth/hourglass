import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparateur d'outils data & IA | Data Universe",
  description: "Comparez jusqu'à 3 outils data et IA côte à côte en temps réel : fonctionnalités, tarifs, cas d'usage et avis d'experts.",
};

export default function ComparateurLayout({ children }: { children: React.ReactNode }) {
  return children;
}
