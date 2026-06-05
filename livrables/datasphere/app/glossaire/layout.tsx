import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossaire Data & IA — 137 définitions | DataSphère",description: "137 définitions précises du vocabulaire data et IA : ML, Big Data, Cloud, Gouvernance. Cherche n'importe quel terme et trouve une explication claire en français."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
