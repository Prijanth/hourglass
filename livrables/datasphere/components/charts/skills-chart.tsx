"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

// Sources : dbt Labs State of Data Engineering 2025, 365 Data Science 2025, Dataquest 2025
// Tendances observées sur Indeed FR, France Travail, Welcome to the Jungle — indicateurs relatifs
const data = [
  { skill: "Python",     score: 97 },
  { skill: "SQL",        score: 94 },
  { skill: "Git / CI-CD",score: 78 },
  { skill: "Spark",      score: 72 },
  { skill: "Cloud AWS",  score: 68 },
  { skill: "dbt",        score: 65 },
  { skill: "Docker/K8s", score: 62 },
  { skill: "Airflow",    score: 60 },
  { skill: "Kafka",      score: 55 },
  { skill: "LLM / RAG",  score: 68 },
];

const COLORS = ["#6366F1","#6366F1","#7C3AED","#7C3AED","#8B5CF6","#8B5CF6","#A78BFA","#A78BFA","#C4B5FD","#C4B5FD"];

const CustomTooltip = ({ active, payload }: {active?: boolean; payload?: {payload: {skill: string; score: number}}[]}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 14px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{payload[0].payload.skill}</p>
        <p style={{ fontSize: 12, color: "#7C3AED" }}>Présence dans les offres : {payload[0].payload.score}%</p>
      </div>
    );
  }
  return null;
};

export function SkillsChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.5)" vertical={false} />
          <XAxis
            dataKey="skill"
            tick={{ fontSize: 11.5, fill: "#64748B", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={48}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
