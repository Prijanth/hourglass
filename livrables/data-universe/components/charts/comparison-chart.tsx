"use client";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

type ComparisonData = { criterion: string; a: number; b: number; c?: number };

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", color: "#fff" }}>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 5 }}>{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ fontSize: 13, fontWeight: 700, color: p.color }}>{p.name} : {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export function ComparisonChart({ data, nameA, nameB, nameC }: {
  data: ComparisonData[];
  nameA: string;
  nameB: string;
  nameC?: string;
}) {
  const chartData = data.map((d) => ({ subject: d.criterion, [nameA]: d.a, [nameB]: d.b, ...(nameC && d.c !== undefined ? { [nameC]: d.c } : {}) }));

  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <RadarChart data={chartData} margin={{ top: 16, right: 40, bottom: 16, left: 40 }}>
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fill: "var(--muted)", fontFamily: "var(--font-body)" }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 13, paddingTop: 12 }} />
          <Radar name={nameA} dataKey={nameA} stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
          <Radar name={nameB} dataKey={nameB} stroke="#14B8A6" fill="#14B8A6" fillOpacity={0.15} strokeWidth={2} />
          {nameC && <Radar name={nameC} dataKey={nameC} stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.15} strokeWidth={2} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
