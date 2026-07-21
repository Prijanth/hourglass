"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type Visit = { href: string; ts: number };

const SECTION_META: Record<string, { label: string; emoji: string; color: string }> = {
  actualites:    { label: "Article",        emoji: "📰", color: "#7C3AED" },
  certifications:{ label: "Certification",  emoji: "🎓", color: "#5B21B6" },
  concepts:      { label: "Concept",        emoji: "📚", color: "#0E7490" },
  outils:        { label: "Outil",          emoji: "🛠️", color: "#B45309" },
  glossaire:     { label: "Définition",     emoji: "📖", color: "#0F766E" },
  metiers:       { label: "Métier",         emoji: "👤", color: "#BE123C" },
  comparatifs:   { label: "Comparatif",     emoji: "⚡", color: "#7C3AED" },
};

function getSection(href: string): string | null {
  const parts = href.split("/").filter(Boolean);
  return parts.length >= 2 ? parts[0] : null;
}

function slugToLabel(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .slice(0, 52) + (slug.length > 52 ? "…" : "");
}

export function PourVous() {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("du_visited") ?? "[]");
      setVisits(stored);
    } catch {}
  }, []);

  const recent = visits.slice(0, 4);
  if (recent.length === 0) return null;

  return (
    <section style={{
      maxWidth: 1240, margin: "0 auto",
      padding: "0 24px 48px",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #F8FAFC 0%, #F5F3FF 100%)",
        border: "1.5px solid #E2E8F0",
        borderRadius: 20,
        padding: "28px 28px 24px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 18 }}>🔖</span>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "#0F172A" }}>
            Reprendre là où tu t&apos;étais arrêté
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {recent.map(({ href }) => {
            const section = getSection(href);
            if (!section) return null;
            const meta = SECTION_META[section];
            if (!meta) return null;
            const slug = href.split("/").pop() ?? "";
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "12px 14px",
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  textDecoration: "none",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = meta.color;
                  el.style.boxShadow = `0 2px 12px ${meta.color}18`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#E2E8F0";
                  el.style.boxShadow = "none";
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.2 }}>{meta.emoji}</span>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: meta.color, marginBottom: 3 }}>
                    {meta.label}
                  </p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", lineHeight: 1.4 }}>
                    {slugToLabel(slug)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
