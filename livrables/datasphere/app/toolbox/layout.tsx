import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toolbox Data — Snippets, checklists et ressources | Data Universe",description: "Snippets de code, checklists par rôle et ressources d'apprentissage pour Data Engineers, Data Scientists et Analytics Engineers."
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
