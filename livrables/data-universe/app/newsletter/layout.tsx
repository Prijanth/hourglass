import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Data & IA gratuite en français | Data Universe",description: "La newsletter data & IA en français : actualités filtrées, concepts expliqués, nouvelles certifications. Chaque semaine, 100% gratuit."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
