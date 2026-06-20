import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz data & IA — Testez vos connaissances | Data Universe",
  description: "Des quiz interactifs pour tester et renforcer vos connaissances en data, machine learning et intelligence artificielle. Par niveau et par thème.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
