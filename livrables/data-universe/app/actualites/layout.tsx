import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités data & IA en français | Data Universe",
  description: "Toute l'actualité data et intelligence artificielle en français : nouveaux modèles, outils, réglementations, carrières et tendances du marché.",
};

export default function ActualitesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
