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
  shareUrl,
}: {
  headings: Heading[];
  related: RelatedArticle[];
  accent: string;
  shareUrl?: string;
}) {
  const linkedInHref = shareUrl
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    : null;

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

      {/* Partage LinkedIn */}
      {linkedInHref && (
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13.5,
            fontWeight: 600,
            color: "#0A66C2",
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #BFDBFE",
            marginBottom: 10,
            background: "#EFF6FF",
            transition: "background 0.15s",
            textDecoration: "none",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#DBEAFE"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#EFF6FF"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          Partager sur LinkedIn
        </a>
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
