"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import articles from "@/content/articles.json";
import outils from "@/content/outils.json";
import metiers from "@/content/metiers.json";
import glossaire from "@/content/glossaire.json";

type Result = {
  type: "article" | "outil" | "metier" | "glossaire";
  title: string;
  description: string;
  href: string;
};

const ALL_RESULTS: Result[] = [
  ...articles.map(a => ({
    type: "article" as const,
    title: a.title,
    description: a.excerpt,
    href: `/actualites/${a.slug}`,
  })),
  ...outils.map(o => ({
    type: "outil" as const,
    title: o.name,
    description: o.tagline,
    href: `/outils/${o.slug}`,
  })),
  ...metiers.map(m => ({
    type: "metier" as const,
    title: m.title,
    description: m.tagline,
    href: `/metiers/${m.slug}`,
  })),
  ...(glossaire as { term: string; definition: string }[]).map(g => ({
    type: "glossaire" as const,
    title: g.term,
    description: g.definition.length > 90 ? g.definition.slice(0, 90) + "…" : g.definition,
    href: `/glossaire?q=${encodeURIComponent(g.term)}`,
  })),
];

const TYPE_LABEL: Record<string, string> = {
  article: "Article",
  outil: "Outil",
  metier: "Métier",
  glossaire: "Glossaire",
};

const TYPE_BADGE: Record<string, string> = {
  article: "badge-indigo",
  outil: "badge-amber",
  metier: "badge-teal",
  glossaire: "badge-neutral",
};

const QUICK_LINKS = [
  { label: "Outils & plateformes", href: "/outils",         badge: "badge-amber",   badgeLabel: "Outils" },
  { label: "Métiers data 2026",     href: "/metiers",        badge: "badge-teal",    badgeLabel: "Métiers" },
  { label: "Glossaire",              href: "/glossaire",      badge: "badge-neutral", badgeLabel: "137 termes" },
  { label: "Certifications",         href: "/certifications", badge: "badge-indigo",  badgeLabel: "Certifs" },
];

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_RESULTS.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [results.length]);

  function navigate(href: string) {
    router.push(href);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelected(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selected]) navigate(results[selected].href);
    if (e.key === "Escape") onClose();
  }

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: 80,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 580, margin: "0 16px" }}
      >
        <div style={{
          background: "#fff", borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(124,58,237,0.1)",
          overflow: "hidden",
        }}>

          {/* Input */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid #F1F5F9" }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher un article, outil, métier, terme…"
              aria-label="Recherche globale"
              style={{
                flex: 1, border: "none", outline: "none",
                fontSize: 15, fontFamily: "var(--font-body)",
                color: "#0F172A", background: "transparent",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Effacer"
                style={{ color: "#CBD5E1", background: "none", border: "none", cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 2px" }}
              >
                ✕
              </button>
            )}
            <kbd style={{ padding: "2px 7px", borderRadius: 5, background: "#F1F5F9", color: "#64748B", fontSize: 11, fontFamily: "var(--font-mono)", border: "1px solid #E2E8F0", flexShrink: 0 }}>
              ESC
            </kbd>
          </div>

          {/* Résultats */}
          {results.length > 0 ? (
            <div style={{ maxHeight: 360, overflowY: "auto" }}>
              {results.map((r, i) => (
                <div
                  key={`${r.type}-${r.href}`}
                  onClick={() => navigate(r.href)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", cursor: "pointer",
                    background: i === selected ? "#F5F3FF" : "transparent",
                    borderBottom: i < results.length - 1 ? "1px solid #F8FAFC" : "none",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={() => setSelected(i)}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.description}
                    </div>
                  </div>
                  <span className={`badge ${TYPE_BADGE[r.type]}`} style={{ flexShrink: 0 }}>
                    {TYPE_LABEL[r.type]}
                  </span>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div style={{ padding: "36px 16px", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 14 }}>Aucun résultat pour « {query} »</p>
            </div>
          ) : (
            <div style={{ padding: "16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#CBD5E1", marginBottom: 8, paddingLeft: 4 }}>
                Accès rapide
              </p>
              {QUICK_LINKS.map(item => (
                <div
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 8, cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F3FF"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 13.5, color: "#334155" }}>{item.label}</span>
                  <span className={`badge ${item.badge}`}>{item.badgeLabel}</span>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ padding: "10px 16px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 16, fontSize: 11, color: "#CBD5E1", fontFamily: "var(--font-mono)" }}>
            <span>↑↓ naviguer</span>
            <span>↩ ouvrir</span>
            <span>ESC fermer</span>
          </div>
        </div>
      </div>
    </div>
  );
}