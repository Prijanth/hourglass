import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter Data & IA gratuite en français | Data Universe",description: "Rejoins 2 400+ professionnels data : actualités filtrées, concepts expliqués, nouvelles certifications. Chaque semaine en français. 100% gratuit."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
