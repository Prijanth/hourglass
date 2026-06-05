import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cas d'usage Data & IA — 50+ projets réels | DataSphère",description: "50+ cas d'usage data et IA avec stack technique, solution et résultats mesurés. Machine Learning, Data Engineering, IA Générative — tous secteurs."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
