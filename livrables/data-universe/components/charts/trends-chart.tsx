"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Sources : dbt Labs State of Data Engineering 2024-2025, 365 Data Science 2025, Dataquest 2025
// Tendances relatives — indicateurs de progression, non comptage exact d'offres
const data = [
  { month: "Jan 24", Python: 94, dbt: 42, Spark: 78, LLM: 12 },
  { month: "Avr 24", Python: 95, dbt: 48, Spark: 77, LLM: 22 },
  { month: "Juil 24", Python: 95, dbt: 53, Spark: 76, LLM: 34 },
  { month: "Oct 24", Python: 96, dbt: 58, Spark: 75, LLM: 43 },
  { month: "Jan 25", Python: 96, dbt: 62, Spark: 74, LLM: 51 },
  { month: "Avr 25", Python: 97, dbt: 65, Spark: 73, LLM: 52 },
];

const LINES = [
  { key: "LLM",    color: "#F43F5E" },
  { key: "dbt",    color: "#14B8A6" },
  { key: "Python", color: "#6366F1" },
  { key: "Spark",  color: "#F59E0B" },
];

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {name: string; value: number; color: string}[]; label?: string}) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
        <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ fontSize: 12.5, fontWeight: 600, color: p.color, marginBottom: 3 }}>
            {p.name} : {p.value}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function TrendsChart() {
  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.4)" />
          <XAxis dataKey="month" tick={{ fontSize: 11.5, fill: "#94A3B8", fontFamily: "var(--font-body)" }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12.5, color: "#64748B", paddingTop: 12 }} />
          {LINES.map(({ key, color }) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
