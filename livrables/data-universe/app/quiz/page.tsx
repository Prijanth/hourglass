"use client";
import { useState } from "react";
import Link from "next/link";
import quizzes from "@/content/quizzes.json";

const DIFF_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Débutant":      { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "Intermédiaire": { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
  "Avancé":        { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3" },
};

const CAT_COLORS: Record<string, string> = {
  "Langage":               "#7C3AED",
  "Big Data":              "#0E7490",
  "Analytics Engineering": "#0369A1",
  "Cloud":                 "#C2410C",
  "Certification":         "#5B21B6",
  "Streaming":             "#047857",
  "Gouvernance":           "#B45309",
  "Machine Learning":      "#BE123C",
  "IA Générative":         "#7C3AED",
  "DevOps":                "#374151",
  "Bases de données":      "#6D28D9",
  "Visualisation":         "#0E7490",
};

const ALL_CATS = Array.from(new Set(quizzes.map(q => q.categorie))).sort();
const ALL_DIFFS = ["Débutant", "Intermédiaire", "Avancé"];

export default function QuizPage() {
  const [activeCat, setActiveCat]   = useState("Tous");
  const [activeDiff, setActiveDiff] = useState("Tous");

  const filtered = quizzes.filter(q => {
    const matchCat  = activeCat  === "Tous" || q.categorie  === activeCat;
    const matchDiff = activeDiff === "Tous" || q.difficulte === activeDiff;
    return matchCat && matchDiff;
  });

  const totalQuestions = quizzes.reduce((s, q) => s + q.questions.length, 0);

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
            {quizzes.length} quiz · {totalQuestions} questions · résultats et explications immédiats.
          </p>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[
              { value: `${quizzes.length}`, label: "quiz disponibles" },
              { value: `${totalQuestions}`, label: "questions" },
              { value: `${ALL_CATS.length}`, label: "thèmes" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--indigo)" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "14px 24px", position: "sticky", top: 58, zIndex: 30, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}>

          {/* Difficulté */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Niveau</span>
            {["Tous", ...ALL_DIFFS].map(d => {
              const active = activeDiff === d;
              const c = d !== "Tous" ? DIFF_COLORS[d] : null;
              return (
                <button key={d} onClick={() => setActiveDiff(d)} style={{
                  padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer",
                  border: `1px solid ${active ? (c?.border ?? "var(--indigo-border)") : "var(--border)"}`,
                  background: active ? (c?.bg ?? "var(--indigo-tint)") : "var(--surface)",
                  color: active ? (c?.color ?? "var(--indigo)") : "var(--muted)",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}>
                  {d}
                </button>
              );
            })}
          </div>

          <div style={{ width: 1, height: 20, background: "var(--border)" }} />

          {/* Catégorie */}
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Thème</span>
            {["Tous", ...ALL_CATS].map(cat => {
              const active = activeCat === cat;
              return (
                <button key={cat} onClick={() => setActiveCat(cat)} style={{
                  padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: active ? 600 : 400, cursor: "pointer",
                  border: `1px solid ${active ? "var(--indigo)" : "var(--border)"}`,
                  background: active ? "var(--indigo-tint)" : "var(--surface)",
                  color: active ? "var(--indigo)" : "var(--muted)",
                  fontFamily: "inherit", transition: "all 0.15s",
                }}>
                  {cat}
                </button>
              );
            })}
          </div>

          <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--faint)", fontFamily: "var(--font-mono)", flexShrink: 0 }}>
            {filtered.length} quiz
          </span>
        </div>
      </section>

      {/* Grille */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>Aucun quiz pour ces filtres.</p>
            <button onClick={() => { setActiveCat("Tous"); setActiveDiff("Tous"); }} style={{
              marginTop: 16, padding: "8px 18px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--surface)", cursor: "pointer", fontSize: 13, fontFamily: "inherit",
            }}>
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
            {filtered.map(quiz => {
              const diff = DIFF_COLORS[quiz.difficulte] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0" };
              const catColor = CAT_COLORS[quiz.categorie] ?? "#64748B";
              return (
                <Link
                  key={quiz.slug}
                  href={`/quiz/${quiz.slug}`}
                  className="card"
                  style={{ padding: "20px 20px 16px", display: "flex", flexDirection: "column", gap: 12, textDecoration: "none" }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 26, lineHeight: 1 }}>{quiz.emoji}</span>
                    <span style={{
                      padding: "2px 9px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                      background: diff.bg, color: diff.color, border: `1px solid ${diff.border}`, flexShrink: 0,
                    }}>
                      {quiz.difficulte}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 5, lineHeight: 1.3 }}>
                      {quiz.titre}
                    </h2>
                    <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.55 }}>{quiz.description}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: catColor }}>{quiz.categorie}</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{quiz.questions.length} questions</span>
                      <span style={{ fontSize: 11, color: "#94A3B8" }}>{quiz.duree_min} min</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
