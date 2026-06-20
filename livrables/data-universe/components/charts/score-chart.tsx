"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type ScoreItem = { label: string; value: number };

function getColor(v: number) {
  if (v >= 85) return "#14B8A6";
  if (v >= 70) return "#6366F1";
  if (v >= 55) return "#F59E0B";
  return "#F43F5E";
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: ScoreItem }[] }) => {
  if (active && payload?.length) {
    const { label, value } = payload[0].payload;
    return (
      <div style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 14px", color: "#fff" }}>
        <p style={{ fontSize: 13, fontWeight: 700 }}>{label}</p>
        <p style={{ fontSize: 12, color: getColor(value) }}>{value} / 100</p>
      </div>
    );
  }
  return null;
};

export function ScoreChart({ data }: { data: ScoreItem[] }) {
  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 4, bottom: 4 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="label" width={95} tick={{ fontSize: 12, fill: "#334155", fontWeight: 500 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={getColor(entry.value)} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
