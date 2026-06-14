import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculateur de salaire data — DataSphère",
  description:
    "Estime ton salaire brut annuel en France selon ton métier data, ton expérience, ta localisation et tes compétences. Data Engineer, Data Scientist, AI Engineer et plus.",
};

export default function CalculateurSalaireLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
