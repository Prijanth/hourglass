"use client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const data = [
  { cat: "Machine Learning",     Débutant: 7,  Intermédiaire: 16, Avancé: 11 },
  { cat: "Techniques Analytics", Débutant: 4,  Intermédiaire: 11, Avancé: 1  },
  { cat: "Gouvernance",          Débutant: 0,  Intermédiaire: 8,  Avancé: 6  },
  { cat: "Data Engineering",     Débutant: 2,  Intermédiaire: 5,  Avancé: 2  },
  { cat: "Cloud",                Débutant: 1,  Intermédiaire: 5,  Avancé: 3  },
];

const CustomTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10,
      padding: "10px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: 12, color: p.color, marginBottom: 2 }}>
          {p.name} : {p.value} concept{p.value > 1 ? "s" : ""}
        </p>
      ))}
      <p style={{ fontSize: 11, color: "#94A3B8", borderTop: "1px solid #F1F5F9", marginTop: 6, paddingTop: 6 }}>
        Total : {total} concepts
      </p>
    </div>
  );
};

export function ConceptsChart() {
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ left: 0, right: 8, top: 4, bottom: 8 }} barCategoryGap="30%" barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(226,232,240,0.5)" vertical={false} />
          <XAxis
            dataKey="cat"
            tick={{ fontSize: 11, fill: "#64748B", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94A3B8", fontFamily: "var(--font-body)" }}
            axisLine={false} tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99,102,241,0.04)" }} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 6 }} />
          <Bar dataKey="Débutant"     stackId="a" fill="#14B8A6" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Intermédiaire" stackId="a" fill="#6366F1" radius={[0, 0, 0, 0]} />
          <Bar dataKey="Avancé"       stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
