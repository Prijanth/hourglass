"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Result = {
  type: "article" | "outil" | "metier" | "glossaire";
  title: string;
  description: string;
  href: string;
};

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
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  // Recherche avec debounce 300ms + annulation des requêtes en vol
  useEffect(() => {
    const q = query.trim();
    if (!q || q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        const data: Result[] = await res.json();
        setResults(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
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
      aria-hidden="true"
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
        role="dialog"
        aria-modal="true"
        aria-label="Recherche globale"
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
            {loading ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, animation: "spin 0.8s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            )}
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
            <div role="listbox" aria-label="Résultats de recherche" style={{ maxHeight: 360, overflowY: "auto" }}>
              {results.map((r, i) => (
                <div
                  key={`${r.type}-${r.href}`}
                  role="option"
                  aria-selected={i === selected}
                  tabIndex={0}
                  onClick={() => navigate(r.href)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(r.href); } }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", cursor: "pointer",
                    background: i === selected ? "#F5F3FF" : "transparent",
                    borderBottom: i < results.length - 1 ? "1px solid #F8FAFC" : "none",
                    transition: "background 0.1s", outline: "none",
                  }}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
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
          ) : query.trim() && !loading ? (
            <div style={{ padding: "36px 16px", textAlign: "center", color: "#94A3B8" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔍</div>
              <p style={{ fontSize: 14 }}>Aucun résultat pour « {query} »</p>
            </div>
          ) : (
            <div style={{ padding: "16px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#CBD5E1", marginBottom: 8, paddingLeft: 4 }}>
                Accès rapide
              </p>
              {QUICK_LINKS.map(item => (
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: 8, cursor: "pointer", transition: "background 0.1s", width: "100%", background: "transparent", border: "none", fontFamily: "inherit" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F3FF"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 13.5, color: "#334155" }}>{item.label}</span>
                  <span className={`badge ${item.badge}`}>{item.badgeLabel}</span>
                </button>
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
