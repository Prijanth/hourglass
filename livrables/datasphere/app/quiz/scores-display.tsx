"use client";
import { useEffect, useState } from "react";

type ScoreRecord = Record<string, { pct: number; date: string; total: number; correct: number }>;

export function QuizScoreBadge({ slug }: { slug: string }) {
  const [score, setScore] = useState<{ pct: number; date: string } | null>(null);

  useEffect(() => {
    try {
      const saved: ScoreRecord = JSON.parse(localStorage.getItem("Data Universe_quiz_scores") ?? "{}");
      if (saved[slug]) setScore(saved[slug]);
    } catch {}
  }, [slug]);

  if (!score) return null;

  const color = score.pct >= 70 ? "#15803D" : score.pct >= 50 ? "#B45309" : "#BE123C";
  const bg    = score.pct >= 70 ? "#F0FDF4" : score.pct >= 50 ? "#FFFBEB" : "#FFF1F2";
  const border= score.pct >= 70 ? "#BBF7D0" : score.pct >= 50 ? "#FDE68A" : "#FECDD3";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
      background: bg, color, border: `1px solid ${border}`,
    }}>
      ✓ {score.pct}% · {score.date}
    </span>
  );
}
