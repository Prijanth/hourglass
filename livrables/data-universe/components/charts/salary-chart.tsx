"use client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, Legend,
} from "recharts";

const data = [
  { role: "CDO",               min: 90,  max: 160 },
  { role: "Data Architect",    min: 65,  max: 100 },
  { role: "ML Engineer",       min: 48,  max: 85  },
  { role: "Data Scientist",    min: 44,  max: 80  },
  { role: "PO Data",           min: 50,  max: 80  },
  { role: "Analytics Eng.",    min: 45,  max: 70  },
  { role: "Data Engineer",     min: 42,  max: 75  },
  { role: "Data Analyst",      min: 35,  max: 58  },
];

const CustomTooltip = ({ active, payload, label }: {active?: boolean; payload?: {value: number}[]; label?: string}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#0F172A", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 16px", color: "#fff" }}>
        <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{label}</p>
        <p style={{ fontSize: 12, color: "#818CF8" }}>{payload[0]?.value}k€ – {payload[1]?.value}k€ <span style={{ color: "rgba(255,255,255,0.4)" }}>brut/an</span></p>
      </div>
    );
  }
  return null;
};

export function SalaryChart() {
  return (
    <div style={{ width: "100%", height: 360 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.6)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 170]}
            tickFormatter={(v) => `${v}k€`}
            tick={{ fontSize: 11.5, fill: "#94A3B8", fontFamily: "var(--font-body)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="role"
            width={110}
            tick={{ fontSize: 12.5, fill: "#334155", fontFamily: "var(--font-body)", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.05)" }} />
          <Legend
            formatter={(v) => v === "min" ? "Salaire min" : "Salaire max"}
            wrapperStyle={{ fontSize: 12, color: "#64748B", paddingTop: 12 }}
          />
          <Bar dataKey="min" name="min" stackId="a" fill="#C7D2FE" radius={[4, 0, 0, 4]} />
          <Bar dataKey="max" name="max" stackId="a" fill="#6366F1" radius={[0, 4, 4, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={i < 2 ? "#4F46E5" : i < 4 ? "#6366F1" : "#818CF8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
