import type { Metadata } from "next";
import Link from "next/link";
import quizzes from "@/content/quizzes.json";

export const metadata: Metadata = {
  title: "Quiz data & IA — 40 quiz, 800 questions | DataSphère",
  description: "40 quiz de 20 questions pour tester tes connaissances en SQL, Python, Kafka, dbt, Spark, GCP, MLOps et plus. Résultats et explications immédiats.",
};

const DIFF_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Débutant":      { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "Intermédiaire": { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  "Avancé":        { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
};

const CAT_COLORS: Record<string, string> = {
  "Langage":              "#7C3AED",
  "Big Data":             "#0E7490",
  "Analytics Engineering":"#0369A1",
  "Cloud":                "#C2410C",
  "Certification":        "#5B21B6",
  "Streaming":            "#047857",
  "Gouvernance":          "#B45309",
  "Machine Learning":     "#BE123C",
  "IA Générative":        "#7C3AED",
  "DevOps":               "#374151",
  "Bases de données":     "#6D28D9",
  "Visualisation":        "#0E7490",
};

export default function QuizPage() {
  const cats = Array.from(new Set(quizzes.map(q => q.categorie))).sort();
  const byDiff = { "Débutant": 0, "Intermédiaire": 0, "Avancé": 0 } as Record<string, number>;
  quizzes.forEach(q => { byDiff[q.difficulte] = (byDiff[q.difficulte] || 0) + 1; });

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "var(--navy)", padding: "64px 24px 52px",
        position: "relative", overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 360, height: 360, background: "rgba(124,58,237,0.22)", top: -110, right: "4%" }} />
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(6,182,212,0.13)", bottom: -60, left: "12%", animationDelay: "8s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <span className="section-label">Quiz interactifs</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800, color: "var(--text)", lineHeight: 1.08,
            letterSpacing: "-0.03em", marginBottom: 14,
          }}>
            Teste tes connaissances data
          </h1>
          <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.65, maxWidth: 560, marginBottom: 32 }}>
            {quizzes.length} quiz · {quizzes.reduce((s, q) => s + q.questions.length, 0)} questions · résultats et explications immédiats.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { value: `${quizzes.length}`, label: "quiz disponibles" },
              { value: `${quizzes.reduce((s, q) => s + q.questions.length, 0)}`, label: "questions" },
              { value: `${cats.length}`, label: "thèmes" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--indigo)" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres difficulté */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "16px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 4 }}>Difficulté</span>
          {Object.entries(byDiff).map(([diff, count]) => {
            const c = DIFF_COLORS[diff] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0" };
            return (
              <span key={diff} style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                background: c.bg, color: c.color, border: `1px solid ${c.border}`,
              }}>
                {diff} ({count})
              </span>
            );
          })}
        </div>
      </section>

      {/* Grille quiz */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {quizzes.map(quiz => {
            const diff = DIFF_COLORS[quiz.difficulte] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0" };
            const catColor = CAT_COLORS[quiz.categorie] ?? "#64748B";
            return (
              <Link
                key={quiz.slug}
                href={`/quiz/${quiz.slug}`}
                className="card"
                style={{ padding: "22px 22px 18px", display: "flex", flexDirection: "column", gap: 12, textDecoration: "none" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{quiz.emoji}</span>
                  <span style={{
                    padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                    background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, flexShrink: 0,
                  }}>
                    {quiz.difficulte}
                  </span>
                </div>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, color: "#0F172A", marginBottom: 5, lineHeight: 1.3 }}>
                    {quiz.titre}
                  </h2>
                  <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.55 }}>{quiz.description}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: catColor, padding: "2px 8px", borderRadius: 6, background: "#F8FAFC" }}>
                    {quiz.categorie}
                  </span>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>{quiz.questions.length} questions</span>
                    <span style={{ fontSize: 11, color: "#94A3B8" }}>{quiz.duree_min} min</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
