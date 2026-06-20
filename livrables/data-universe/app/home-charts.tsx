"use client";

import dynamic from "next/dynamic";

const SkillsChart = dynamic(
  () => import("@/components/charts/skills-chart").then(m => ({ default: m.SkillsChart })),
  { ssr: false, loading: () => <div style={{ height: 300, background: "#F8FAFC", borderRadius: 8 }} /> }
);

const TrendsChart = dynamic(
  () => import("@/components/charts/trends-chart").then(m => ({ default: m.TrendsChart })),
  { ssr: false, loading: () => <div style={{ height: 300, background: "#F8FAFC", borderRadius: 8 }} /> }
);

export function HomeSkillsChart() {
  return <SkillsChart />;
}

export function HomeTrendsChart() {
  return <TrendsChart />;
}
