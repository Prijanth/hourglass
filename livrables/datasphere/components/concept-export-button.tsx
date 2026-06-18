"use client";
import { useState } from "react";

type Concept = {
  id: string;
  titre: string;
  categorie: string;
  sous_categorie: string;
  niveau: string;
  emoji: string;
  description_courte: string;
  explication_simple: string;
  exemple_concret: string;
  formule?: string | null;
  quand_utiliser?: string[];
  avantages: string[];
  inconvenients: string[];
  outils: string[];
  tags: string[];
};

function esc(s: string | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildConceptBody(c: Concept): string {
  const NIVEAU_COLORS: Record<string, { bg: string; color: string }> = {
    "Débutant":       { bg: "#ECFDF5", color: "#065F46" },
    "Intermédiaire":  { bg: "#FFFBEB", color: "#92400E" },
    "Avancé":         { bg: "#FFF1F2", color: "#9F1239" },
  };
  const niv = NIVEAU_COLORS[c.niveau] || { bg: "#F1F5F9", color: "#475569" };

  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0F172A;background:#fff;font-size:13px;line-height:1.6">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    .ds-header{padding:26px 36px 18px;border-bottom:3px solid #7C3AED;display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
    .ds-logo{font-size:9.5px;font-weight:800;text-transform:uppercase;letter-spacing:.15em;color:#7C3AED;margin-bottom:8px}
    .ds-h1{font-size:22px;font-weight:800;line-height:1.2;color:#0F172A;margin-bottom:8px}
    .ds-meta{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
    .ds-badge{padding:2px 9px;border-radius:100px;font-size:10.5px;font-weight:600}
    .ds-body{padding:22px 36px}
    .ds-section{margin-bottom:18px}
    .ds-label{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#94A3B8;margin-bottom:8px;display:flex;align-items:center;gap:5px}
    .ds-card{border-radius:8px;padding:13px 15px;font-size:13px;line-height:1.75}
    .ds-purple{background:#F5F3FF;border:1px solid #DDD6FE}
    .ds-gray{background:#F8FAFC;border:1px solid #E2E8F0}
    .ds-code{background:#0F1629;color:#A5B4FC;font-family:'Courier New',monospace;font-size:11.5px;white-space:pre-wrap}
    .ds-two{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .ds-green{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:13px}
    .ds-red{background:#FFF1F2;border:1px solid #FECDD3;border-radius:8px;padding:13px}
    .ds-col-title{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;margin-bottom:9px}
    .ds-li{display:flex;gap:7px;margin-bottom:6px;font-size:12.5px;line-height:1.5}
    .ds-tools{display:flex;flex-wrap:wrap;gap:5px}
    .ds-tool{padding:3px 9px;background:#F1F5F9;border:1px solid #E2E8F0;border-radius:5px;font-size:11px;color:#475569;font-family:'Courier New',monospace}
    .ds-tags{display:flex;flex-wrap:wrap;gap:5px}
    .ds-tag{padding:2px 8px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:100px;font-size:10px;color:#64748B}
    .ds-footer{margin-top:20px;padding:12px 36px;border-top:1px solid #E2E8F0;display:flex;justify-content:space-between;align-items:center}
    .ds-footer-brand{font-size:11px;font-weight:800;color:#7C3AED}
    .ds-footer-url{font-size:10px;color:#94A3B8}
  </style>

  <div class="ds-header">
    <div>
      <div class="ds-logo">⬡ Data Universe · Fiche Concept</div>
      <div class="ds-h1">${esc(c.emoji)} ${esc(c.titre)}</div>
      <div class="ds-meta">
        <span class="ds-badge" style="background:#EDE9FE;color:#5B21B6">${esc(c.categorie)}</span>
        <span class="ds-badge" style="background:${niv.bg};color:${niv.color}">${esc(c.niveau)}</span>
        <span style="font-size:11px;color:#94A3B8">${esc(c.sous_categorie)}</span>
      </div>
    </div>
    <div style="font-size:10px;color:#94A3B8;text-align:right;flex-shrink:0">Data Universe.fr/concepts/${esc(c.id)}</div>
  </div>

  <div class="ds-body">
    <div class="ds-section">
      <div class="ds-label">💡 Explication simple</div>
      <div class="ds-card ds-purple">${esc(c.explication_simple)}</div>
    </div>

    <div class="ds-section">
      <div class="ds-label">🏗️ Exemple concret</div>
      <div class="ds-card ds-gray">${esc(c.exemple_concret)}</div>
    </div>

    ${c.formule ? `
    <div class="ds-section">
      <div class="ds-label">∑ Concept clé</div>
      <div class="ds-card ds-code">${esc(c.formule)}</div>
    </div>` : ""}

    ${c.quand_utiliser && c.quand_utiliser.length > 0 ? `
    <div class="ds-section">
      <div class="ds-label">🎯 Quand l'utiliser ?</div>
      ${c.quand_utiliser.map(q => `<div class="ds-li"><span style="color:#15803D;font-weight:700;flex-shrink:0">✓</span><span>${esc(q)}</span></div>`).join("")}
    </div>` : ""}

    <div class="ds-section ds-two">
      <div class="ds-green">
        <div class="ds-col-title" style="color:#15803D">✅ Avantages</div>
        ${c.avantages.map(a => `<div class="ds-li"><span style="color:#15803D;font-weight:700;flex-shrink:0">+</span><span>${esc(a)}</span></div>`).join("")}
      </div>
      <div class="ds-red">
        <div class="ds-col-title" style="color:#BE123C">⚠️ Limites</div>
        ${c.inconvenients.map(i => `<div class="ds-li"><span style="color:#BE123C;font-weight:700;flex-shrink:0">−</span><span>${esc(i)}</span></div>`).join("")}
      </div>
    </div>

    <div class="ds-section">
      <div class="ds-label">🛠️ Outils principaux</div>
      <div class="ds-tools">${c.outils.map(o => `<span class="ds-tool">${esc(o)}</span>`).join("")}</div>
    </div>

    <div class="ds-section">
      <div class="ds-label">Tags</div>
      <div class="ds-tags">${c.tags.map(t => `<span class="ds-tag">${esc(t)}</span>`).join("")}</div>
    </div>
  </div>

  <div class="ds-footer">
    <div class="ds-footer-brand">Data Universe</div>
    <div class="ds-footer-url">Data Universe.fr · Le référentiel data en français</div>
  </div>
</div>`;
}

export default function ConceptExportButton({ concept }: { concept: Concept }) {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  async function handleExport() {
    setState("loading");
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const html2pdf = (await import("html2pdf.js")).default as any;

      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `Data Universe-${concept.id}.pdf`,
          image: { type: "png" },
          html2canvas: { scale: 3, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(buildConceptBody(concept), "string")
        .save();

      setState("done");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("idle");
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={state === "loading"}
      title="Télécharger la fiche en PDF"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 16px",
        borderRadius: 10,
        fontSize: 13,
        fontWeight: 600,
        cursor: state === "loading" ? "wait" : "pointer",
        fontFamily: "inherit",
        transition: "all 0.2s",
        opacity: state === "loading" ? 0.7 : 1,
        background: state === "done" ? "#F0FDF4" : "#FFFFFF",
        color: state === "done" ? "#15803D" : "#7C3AED",
        border: state === "done" ? "1.5px solid #86EFAC" : "1.5px solid rgba(124,58,237,0.35)",
        boxShadow: state === "done" ? "none" : "0 1px 4px rgba(124,58,237,0.1)",
      }}
    >
      {state === "loading" ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Génération…
        </>
      ) : state === "done" ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Téléchargé !
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Télécharger PDF
        </>
      )}
    </button>
  );
}
