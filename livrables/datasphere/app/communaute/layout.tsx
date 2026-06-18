import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Communauté Data & IA francophone | Data Universe",description: "Rejoins la communauté Data Universe : questions, retours d'expérience et ressources entre data professionals francophones."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
