"use client";
import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import glossaire from "@/content/glossaire.json";

type GlossaireTerm = typeof glossaire[number];

function esc(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function printHtml(html: string) {
  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) { document.body.removeChild(iframe); return; }
  doc.open();
  doc.write(html);
  doc.close();
  iframe.addEventListener("load", () => {
    iframe.contentWindow?.print();
    setTimeout(() => { if (document.body.contains(iframe)) document.body.removeChild(iframe); }, 1000);
  });
}

function buildTermHtml(t: GlossaireTerm): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Data Universe — ${esc(t.term)}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0F172A;background:#fff;font-size:13px;line-height:1.6}
    .header{padding:28px 40px 20px;border-bottom:3px solid #7C3AED;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
    .logo{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.15em;color:#7C3AED;margin-bottom:8px}
    h1{font-size:24px;font-weight:800;line-height:1.2;color:#0F172A;margin-bottom:10px}
    .badge{padding:3px 10px;border-radius:100px;font-size:11px;font-weight:600}
    .body{padding:28px 40px}
    .def{font-size:14px;line-height:1.85;color:#1E293B;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:18px 20px}
    .examples-title{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#94A3B8;margin:20px 0 10px}
    .examples{display:flex;flex-wrap:wrap;gap:7px}
    .ex{padding:4px 10px;background:#EDE9FE;border:1px solid #DDD6FE;border-radius:6px;font-size:11.5px;color:#5B21B6}
    .footer{margin-top:28px;padding:14px 40px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center}
    .footer-brand{font-size:11px;font-weight:800;color:#7C3AED}
    .footer-url{font-size:10px;color:#94A3B8}
    @media print{
      *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
      @page{margin:1.5cm 2cm;size:A4}
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">⬡ Data Universe · Fiche Glossaire</div>
      <h1>${esc(t.term)}</h1>
      <span class="badge" style="background:#EDE9FE;color:#5B21B6">${esc(t.category)}</span>
    </div>
    <div style="font-size:10px;color:#94A3B8;text-align:right;flex-shrink:0">Data Universe.fr/glossaire</div>
  </div>
  <div class="body">
    <div class="def">${esc(t.definition)}</div>
    ${t.examples && t.examples.length > 0 ? `
    <div class="examples-title">Exemples &amp; outils</div>
    <div class="examples">${t.examples.map(e => `<span class="ex">${esc(e)}</span>`).join("")}</div>` : ""}
  </div>
  <div class="footer">
    <div class="footer-brand">Data Universe</div>
    <div class="footer-url">Data Universe.fr · Le référentiel data en français</div>
  </div>
</body>
</html>`;
}

const CATEGORIES = ["Tous", ...Array.from(new Set(glossaire.map((t) => t.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  Infrastructure: "badge-teal",
  Engineering: "badge-indigo",
  "IA Générative": "badge-rose",
  Transformation: "badge-amber",
  Architecture: "badge-neutral",
  Analytics: "badge-indigo",
  Processing: "badge-teal",
  Qualité: "badge-amber",
  DataOps: "badge-neutral",
  Gouvernance: "badge-neutral",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalizeFirstLetter(term: string): string {
  return term.normalize("NFD").replace(/[̀-ͯ]/g, "")[0].toUpperCase();
}

function GlossaireContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return glossaire
      .filter((t) => t.term.toLowerCase().includes(q) || t.examples?.some(ex => ex.toLowerCase().includes(q)))
      .slice(0, 10);
  }, [search]);

  function selectSuggestion(term: string) {
    setSearch(term);
    setShowSuggestions(false);
    setHighlightedIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && highlightedIdx >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlightedIdx].term);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  const filtered = useMemo(() =>
    glossaire.filter((t) => {
      const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.definition.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "Tous" || t.category === activeCategory;
      return matchSearch && matchCat;
    }),
    [search, activeCategory]
  );

  const availableLetters = useMemo(() =>
    new Set(filtered.map((t) => normalizeFirstLetter(t.term))),
    [filtered]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const term of filtered) {
      const letter = normalizeFirstLetter(term.term);
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(term);
    }
    return map;
  }, [filtered]);

  const showAlpha = !search;

  function scrollToLetter(letter: string) {
    const el = document.getElementById(`letter-${letter}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      {/* ── PAGE HERO ─────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "64px 24px 52px",
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(124,58,237,0.18)",
      }}>
        <div className="orb" style={{ width: 340, height: 340, background: "rgba(124,58,237,0.24)", top: -100, right: "5%", animationDelay: "1s" }} />
        <div className="orb" style={{ width: 200, height: 200, background: "rgba(6,182,212,0.16)", bottom: -50, left: "12%", animationDelay: "7s" }} />
        <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
          <span className="section-label">{glossaire.length} termes définis</span>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
            fontWeight: 800, color: "#0F172A", lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: 14,
          }}>Glossaire data &amp; IA</h1>
          <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.65, maxWidth: 560 }}>
            Tous les concepts expliqués clairement, en français, avec des exemples concrets.
          </p>
        </div>
      </section>

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "52px 24px" }}>
      {/* Search */}
      <div ref={searchRef} style={{ position: "relative", marginBottom: 20, maxWidth: 520 }}>
        <label htmlFor="glossaire-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
          Rechercher un terme dans le glossaire
        </label>
        <svg style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--faint)", zIndex: 1 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          id="glossaire-search"
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); setHighlightedIdx(-1); }}
          onFocus={() => { if (search) setShowSuggestions(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher un terme..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={showSuggestions && suggestions.length > 0}
          style={{
            width: "100%",
            padding: "11px 16px 11px 40px",
            border: "1px solid var(--border)",
            borderRadius: showSuggestions && suggestions.length > 0 ? "10px 10px 0 0" : 10,
            fontSize: 14.5,
            outline: "none",
            background: "var(--surface)",
            color: "var(--text)",
            fontFamily: "var(--font-body)",
          }}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderTop: "none",
            borderRadius: "0 0 10px 10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            zIndex: 50,
            overflow: "hidden",
          }}>
            {suggestions.map((t, idx) => (
              <div
                key={t.term}
                onMouseDown={() => selectSuggestion(t.term)}
                onMouseEnter={() => setHighlightedIdx(idx)}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  background: idx === highlightedIdx ? "var(--indigo-tint)" : "transparent",
                  borderBottom: idx < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--text)", fontFamily: "var(--font-body)" }}>
                  {t.term}
                </span>
                <span className={`badge ${CATEGORY_COLORS[t.category] ?? "badge-neutral"}`} style={{ fontSize: 11, flexShrink: 0 }}>
                  {t.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filtres catégorie */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: showAlpha ? 20 : 36 }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "6px 14px",
            borderRadius: 20,
            border: "1px solid",
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: activeCategory === cat ? 600 : 400,
            borderColor: activeCategory === cat ? "var(--indigo)" : "var(--border)",
            background: activeCategory === cat ? "var(--indigo-tint)" : "var(--surface)",
            color: activeCategory === cat ? "var(--indigo)" : "var(--muted)",
          }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Navigation alphabétique */}
      {showAlpha && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 36 }}>
          {ALPHABET.map((letter) => {
            const active = availableLetters.has(letter);
            return (
              <button
                key={letter}
                onClick={() => active && scrollToLetter(letter)}
                disabled={!active}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  border: "1px solid",
                  cursor: active ? "pointer" : "default",
                  fontFamily: "var(--font-body)",
                  fontSize: 13,
                  fontWeight: 600,
                  borderColor: active ? "var(--border)" : "transparent",
                  background: active ? "var(--surface)" : "transparent",
                  color: active ? "var(--text)" : "var(--faint)",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (active) (e.currentTarget as HTMLButtonElement).style.background = "var(--indigo-tint)";
                }}
                onMouseLeave={(e) => {
                  if (active) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface)";
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      )}

      {/* Résultat count */}
      <div style={{ fontSize: 13, color: "var(--faint)", marginBottom: 28 }}>
        {filtered.length} terme{filtered.length > 1 ? "s" : ""} {search && `pour "${search}"`}
      </div>

      {/* Termes groupés par lettre */}
      {showAlpha ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {ALPHABET.filter((l) => grouped.has(l)).map((letter) => (
            <div key={letter} id={`letter-${letter}`} style={{ scrollMarginTop: 130 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14, marginBottom: 18,
              }}>
                <h2 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: "var(--indigo)",
                  lineHeight: 1,
                  minWidth: 32,
                  margin: 0,
                }}>
                  {letter}
                </h2>
                <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {grouped.get(letter)!.map((term) => (
                  <TermCard key={term.term} term={term} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {filtered.map((term) => (
            <TermCard key={term.term} term={term} />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 15 }}>Aucun terme trouvé pour cette recherche.</p>
        </div>
      )}
    </div>
    </>
  );
}

function TermCard({ term }: { term: GlossaireTerm }) {
  const [exported, setExported] = useState(false);

  function handleExport(e: React.MouseEvent) {
    e.stopPropagation();
    printHtml(buildTermHtml(term));
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10, gap: 12 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, margin: 0 }}>{term.term}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span className={`badge ${CATEGORY_COLORS[term.category] ?? "badge-neutral"}`}>{term.category}</span>
          <button
            onClick={handleExport}
            title="Exporter en Markdown"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)",
              background: exported ? "#F0FDF4" : "var(--surface-2)",
              color: exported ? "#15803D" : "var(--muted)",
              cursor: "pointer", transition: "all 0.2s", flexShrink: 0,
            }}
          >
            {exported
              ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            }
          </button>
        </div>
      </div>
      <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 12 }}>{term.definition}</p>
      {term.examples && term.examples.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {term.examples.map((ex) => (
            <span key={ex} style={{ fontSize: 11.5, padding: "3px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--muted)" }}>{ex}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function GlossairePage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 24px", textAlign: "center", color: "#94A3B8" }}>Chargement…</div>}>
      <GlossaireContent />
    </Suspense>
  );
}
