"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend,
} from "recharts";

const data = [
  { nom: "o3",          mmlu: 92.3, code: 96.7, math: 96.7 },
  { nom: "DeepSeek R1", mmlu: 90.8, code: 92.6, math: 97.3 },
  { nom: "Claude S.4",  mmlu: 90.1, code: 95.2, math: 82.1 },
  { nom: "Gemini 2 Pro",mmlu: 90.0, code: 90.0, math: 84.0 },
  { nom: "o4-mini",     mmlu: 88.0, code: 94.5, math: 91.0 },
  { nom: "DeepSeek V3", mmlu: 88.5, code: 89.3, math: 90.2 },
  { nom: "GPT-4o",      mmlu: 88.7, code: 90.2, math: 76.6 },
  { nom: "Mistral L.2", mmlu: 84.0, code: 92.1, math: 69.9 },
].sort((a, b) => (b.mmlu + b.code + b.math) / 3 - (a.mmlu + a.code + a.math) / 3);

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const labels: Record<string, string> = {
    mmlu: "MMLU (culture générale)",
    code: "HumanEval (code)",
    math: "MATH (raisonnement)",
  };
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {labels[p.name] ?? p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export function LLMBenchmarkChart() {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 8 }} barCategoryGap="28%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.5)" vertical={false} />
          <XAxis
            dataKey="nom"
            tick={{ fontSize: 11, fill: "#64748B", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[60, 100]}
            tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
          <Legend
            formatter={(v: string) => ({ mmlu: "MMLU", code: "HumanEval", math: "MATH" }[v] ?? v)}
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          />
          <Bar dataKey="mmlu"  name="mmlu"  fill="#6366F1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="code"  name="code"  fill="#14B8A6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="math"  name="math"  fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
