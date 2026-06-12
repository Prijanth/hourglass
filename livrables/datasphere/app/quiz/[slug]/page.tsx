"use client";
import { useState, useMemo, use } from "react";
import Link from "next/link";
import quizzes from "@/content/quizzes.json";

const DIFF_COLOR: Record<string, string> = {
  "Débutant": "#15803D", "Intermédiaire": "#92400E", "Avancé": "#BE123C", "Tous niveaux": "#6D28D9",
};

export default function QuizPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const quiz = quizzes.find(q => q.slug === slug);

  const [current, setCurrent]   = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [scores, setScores]     = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);

  const questions = quiz?.questions ?? [];
  const q         = questions[current] as { id: number; question: string; options: string[]; reponse: number; explication: string } | undefined;
  const total     = questions.length;
  const correct   = scores.filter(Boolean).length;
  const pct       = total > 0 ? Math.round((correct / total) * 100) : 0;

  const resultMsg = useMemo(() => {
    if (pct >= 90) return { msg: "Excellent ! Tu maîtrises ce sujet.", emoji: "🏆", color: "#15803D" };
    if (pct >= 70) return { msg: "Très bien ! Quelques points à consolider.", emoji: "🎉", color: "#0E7490" };
    if (pct >= 50) return { msg: "Correct. Revois les notions manquées.", emoji: "📚", color: "#B45309" };
    return { msg: "Continue à pratiquer, tu y arriveras !", emoji: "💪", color: "#BE123C" };
  }, [pct]);

  if (!quiz) return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>❓</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Quiz introuvable</h1>
      <Link href="/quiz" className="btn-primary">← Retour aux quiz</Link>
    </div>
  );

  if (questions.length === 0) return (
    <div style={{ maxWidth: 600, margin: "80px auto", textAlign: "center", padding: "0 24px" }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>{quiz.emoji}</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginBottom: 12 }}>{quiz.titre}</h1>
      <p style={{ fontSize: 16, color: "var(--muted)", marginBottom: 28 }}>Ce quiz est en cours de préparation. Il sera disponible très prochainement !</p>
      <Link href="/quiz" className="btn-primary">← Voir tous les quiz</Link>
    </div>
  );

  function handleAnswer(idx: number) {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setScores(prev => [...prev, idx === (q as NonNullable<typeof q>).reponse]);
  }

  function saveScore(finalScores: boolean[]) {
    try {
      const key = "datasphere_quiz_scores";
      const existing = JSON.parse(localStorage.getItem(key) ?? "{}");
      existing[quiz!.slug] = {
        pct: Math.round((finalScores.filter(Boolean).length / finalScores.length) * 100),
        date: new Date().toISOString().split("T")[0],
        total: finalScores.length,
        correct: finalScores.filter(Boolean).length,
      };
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  }

  function handleNext() {
    if (current + 1 >= total) {
      setFinished(true);
      saveScore(scores);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScores([]);
    setFinished(false);
  }

  /* ── Écran de résultats ── */
  if (finished) return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "52px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <span style={{ fontSize: 56 }}>{resultMsg.emoji}</span>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, marginTop: 12, marginBottom: 8 }}>Quiz terminé !</h1>
        <p style={{ fontSize: 16, color: "var(--muted)" }}>{quiz.titre}</p>
      </div>

      {/* Score */}
      <div style={{ background: "var(--surface-2)", borderRadius: 20, padding: "32px", textAlign: "center", marginBottom: 28, border: "1px solid var(--border)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 72, fontWeight: 900, color: resultMsg.color, lineHeight: 1 }}>{pct}%</div>
        <p style={{ fontSize: 16, color: "var(--text)", marginTop: 8, marginBottom: 4 }}><strong>{correct}</strong> / {total} bonnes réponses</p>
        <p style={{ fontSize: 14.5, color: "var(--muted)", marginTop: 12 }}>{resultMsg.msg}</p>
      </div>

      {/* Détail par question */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
        {scores.map((ok, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", background: ok ? "#F0FDF4" : "#FFF1F2", borderRadius: 10, border: `1px solid ${ok ? "#BBF7D0" : "#FECDD3"}` }}>
            <span style={{ fontSize: 16 }}>{ok ? "✅" : "❌"}</span>
            <span style={{ fontSize: 13.5, color: ok ? "#15803D" : "#BE123C" }}>Question {i + 1}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button onClick={handleRestart} className="btn-primary" style={{ flex: 1 }}>
          🔄 Recommencer
        </button>
        <Link href="/quiz" className="btn-secondary" style={{ flex: 1, textAlign: "center" }}>
          ← Tous les quiz
        </Link>
      </div>

      {/* Suggestion */}
      <div style={{ marginTop: 28, padding: "20px 24px", background: "var(--indigo-tint)", borderRadius: 14, border: "1px solid var(--indigo-border)" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--indigo)", marginBottom: 6 }}>Aller plus loin</p>
        <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.6 }}>
          Pour progresser sur ce sujet, consulte la fiche outil ou les concepts associés sur DataSphère.
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <Link href="/outils" style={{ fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>Outils →</Link>
          <Link href="/concepts" style={{ fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>Concepts →</Link>
          <Link href="/certifications" style={{ fontSize: 13, fontWeight: 600, color: "var(--indigo)" }}>Certifications →</Link>
        </div>
      </div>
    </main>
  );

  if (!q) return null;

  const progress = Math.round(((current) / total) * 100);

  /* ── Question courante ── */
  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>{quiz.emoji}</span>
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{quiz.titre}</p>
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Question {current + 1} / {total}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: DIFF_COLOR[quiz.difficulte] ?? "var(--muted)" }}>{quiz.difficulte}</span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>✅ {scores.filter(Boolean).length}</span>
        </div>
      </div>

      {/* Barre de progression */}
      <div style={{ height: 6, background: "var(--surface-2)", borderRadius: 10, marginBottom: 32, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--indigo), #0EA5E9)", borderRadius: 10, transition: "width 0.3s ease" }} />
      </div>

      {/* Question */}
      <div className="card" style={{ padding: "28px 32px", marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--indigo)", marginBottom: 16 }}>Question {current + 1}</p>
        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "var(--text)", lineHeight: 1.45 }}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          const isCorrect  = i === q.reponse;
          const isSelected = i === selected;
          let bg = "var(--surface)";
          let border = "1.5px solid var(--border)";
          let color = "var(--text)";

          if (answered) {
            if (isCorrect)               { bg = "#F0FDF4"; border = "1.5px solid #86EFAC"; color = "#15803D"; }
            else if (isSelected)         { bg = "#FFF1F2"; border = "1.5px solid #FECDD3"; color = "#BE123C"; }
          } else if (isSelected) {
            bg = "var(--indigo-tint)"; border = "1.5px solid var(--indigo)"; color = "var(--indigo)";
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 12, border, background: bg, color, cursor: answered ? "default" : "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.15s", fontSize: 14.5, lineHeight: 1.5 }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 8, background: answered && isCorrect ? "#BBF7D0" : answered && isSelected ? "#FECDD3" : "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, color: answered && isCorrect ? "#15803D" : answered && isSelected ? "#BE123C" : "var(--muted)" }}>
                {answered && isCorrect ? "✓" : answered && isSelected && !isCorrect ? "✗" : "ABCD"[i]}
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explication */}
      {answered && (
        <div style={{ padding: "18px 22px", background: selected === q.reponse ? "#F0FDF4" : "#FFF7ED", borderRadius: 14, border: `1px solid ${selected === q.reponse ? "#BBF7D0" : "#FED7AA"}`, marginBottom: 24 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: selected === q.reponse ? "#15803D" : "#C2410C", marginBottom: 8 }}>
            {selected === q.reponse ? "✅ Bonne réponse !" : "❌ Mauvaise réponse"}
          </p>
          <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.7 }}>{q.explication}</p>
        </div>
      )}

      {/* Bouton suivant */}
      {answered && (
        <button onClick={handleNext} className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 15 }}>
          {current + 1 >= total ? "Voir mes résultats →" : "Question suivante →"}
        </button>
      )}

      {/* Quitter */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <Link href="/quiz" style={{ fontSize: 13, color: "var(--faint)", textDecoration: "none" }}>
          Quitter le quiz
        </Link>
      </div>
    </main>
  );
}
