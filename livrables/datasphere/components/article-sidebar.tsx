"use client";
import Link from "next/link";

type Heading = { id: string; label: string };
type RelatedArticle = { slug: string; title: string; category: string; categoryColor: string; readTime: string };

const CATEGORY_COLORS: Record<string, string> = {
  indigo: "badge-indigo", teal: "badge-teal", amber: "badge-amber", rose: "badge-rose",
};
const CATEGORY_ACCENT: Record<string, string> = {
  indigo: "var(--indigo)", teal: "#0F766E", amber: "#B45309", rose: "#BE123C",
};

export function ArticleSidebar({
  headings,
  related,
  accent,
}: {
  headings: Heading[];
  related: RelatedArticle[];
  accent: string;
}) {
  return (
    <aside style={{ position: "sticky", top: 80 }}>

      {/* Table des matières */}
      {headings.length > 0 && (
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 14 }}>
            Dans cet article
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {headings.map(({ id, label }) => (
              <a key={id} href={`#${id}`} style={{
                display: "block",
                fontSize: 13.5,
                padding: "6px 10px",
                borderRadius: 7,
                color: "var(--muted)",
                borderLeft: "2px solid var(--border)",
                transition: "all 0.15s",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = accent;
                  (e.currentTarget as HTMLElement).style.borderLeftColor = accent;
                  (e.currentTarget as HTMLElement).style.background = "var(--surface)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLElement).style.borderLeftColor = "var(--border)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Retour */}
      <Link href="/actualites" style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13.5,
        fontWeight: 600,
        color: "var(--muted)",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid var(--border)",
        marginBottom: 16,
        background: "var(--surface)",
      }}>
        ← Retour aux articles
      </Link>

      {/* À lire aussi */}
      {related.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 12 }}>
            À lire aussi
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {related.map((r) => (
              <Link key={r.slug} href={`/actualites/${r.slug}`} style={{
                display: "block",
                padding: "12px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = CATEGORY_ACCENT[r.categoryColor] ?? "var(--indigo-light)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              >
                <span className={`badge ${CATEGORY_COLORS[r.categoryColor] ?? "badge-neutral"}`} style={{ marginBottom: 6, display: "inline-flex" }}>
                  {r.category}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35, fontFamily: "var(--font-display)", color: "var(--text)" }}>
                  {r.title}
                </p>
                <p style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 5 }}>{r.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
