import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import articles from "@/content/articles.json";
import { ArticleSidebar } from "@/components/article-sidebar";
import { fmtDate } from "@/lib/date-utils";

const BASE = "https://Data Universe.fr";

const CATEGORY_COLORS: Record<string, string> = {
  indigo: "badge-indigo", teal: "badge-teal", amber: "badge-amber", rose: "badge-rose",
};
const CATEGORY_ACCENT: Record<string, string> = {
  indigo: "var(--indigo)", teal: "#0F766E", amber: "#B45309", rose: "#BE123C",
};

function extractHeadings(content: string) {
  return content.split("\n\n")
    .filter((b) => b.startsWith("## "))
    .map((b) => {
      const label = b.replace("## ", "").trim();
      const id = label.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
      return { id, label };
    });
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let idx = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`(.+?)`/);
    const boldPos = boldMatch?.index ?? Infinity;
    const codePos = codeMatch?.index ?? Infinity;
    if (boldPos === Infinity && codePos === Infinity) {
      parts.push(<span key={idx++}>{remaining}</span>);
      break;
    }
    if (boldPos <= codePos && boldMatch) {
      if (boldPos > 0) parts.push(<span key={idx++}>{remaining.slice(0, boldPos)}</span>);
      parts.push(<strong key={idx++} style={{ fontWeight: 700, color: "var(--text)" }}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldPos + boldMatch[0].length);
    } else if (codeMatch) {
      if (codePos > 0) parts.push(<span key={idx++}>{remaining.slice(0, codePos)}</span>);
      parts.push(
        <code key={idx++} style={{ fontFamily: "monospace", fontSize: "0.88em", background: "var(--indigo-tint)", color: "var(--indigo-dim)", padding: "2px 6px", borderRadius: 5, fontWeight: 600 }}>
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codePos + codeMatch[0].length);
    }
  }
  return parts;
}

function renderBlock(block: string, i: number) {
  if (block.startsWith("## ")) {
    const label = block.replace("## ", "").trim();
    const id = label.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    return (
      <h2 key={i} id={id} style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, marginTop: 48, marginBottom: 16, letterSpacing: "-0.025em", paddingBottom: 12, borderBottom: "2px solid var(--indigo-tint)" }}>
        {label}
      </h2>
    );
  }
  return (
    <p key={i} style={{ marginBottom: 20, lineHeight: 1.85, color: "#334155" }}>
      {renderInline(block)}
    </p>
  );
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article — Data Universe" };
  const title = `${article.title} | Data Universe`;
  const ogImageUrl = `${BASE}/og?title=${encodeURIComponent(article.title)}&subtitle=${encodeURIComponent(article.excerpt.slice(0, 120))}&type=${encodeURIComponent(article.category)}`;
  return {
    title,
    description: article.excerpt,
    openGraph: {
      title,
      description: article.excerpt,
      url: `${BASE}/actualites/${slug}`,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: { card: "summary_large_image", title, description: article.excerpt, images: [ogImageUrl] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== slug).slice(0, 3);
  const headings = extractHeadings(article.content);
  const blocks = article.content.split("\n\n");
  const accent = CATEGORY_ACCENT[article.categoryColor] ?? "var(--indigo)";

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.date,
    "author": { "@type": "Person", "name": article.author },
    "publisher": { "@type": "Organization", "name": "Data Universe", "url": BASE },
    "inLanguage": "fr",
    "articleSection": article.category,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${BASE}/actualites/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil",    "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Actualités", "item": `${BASE}/actualites` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": `${BASE}/actualites/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero article */}
      <div style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 8%, white) 0%, var(--surface) 100%)`, borderBottom: "1px solid var(--border)", padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: "var(--muted)" }}>
            <Link href="/" style={{ color: "var(--muted)" }}>Accueil</Link>
            <span style={{ color: "var(--faint)" }}>›</span>
            <Link href="/actualites" style={{ color: "var(--muted)" }}>Actualités</Link>
            <span style={{ color: "var(--faint)" }}>›</span>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{article.category}</span>
          </div>

          <span className={`badge ${CATEGORY_COLORS[article.categoryColor] ?? "badge-neutral"}`} style={{ marginBottom: 18, display: "inline-flex" }}>
            {article.category}
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 18, maxWidth: 720 }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 17.5, color: "var(--muted)", lineHeight: 1.65, marginBottom: 24, maxWidth: 680, borderLeft: `3px solid ${accent}`, paddingLeft: 16 }}>
            {article.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 13, color: "var(--faint)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff", fontWeight: 700 }}>
                {article.author[0]}
              </div>
              <span style={{ color: "var(--text)", fontWeight: 500, fontSize: 13.5 }}>{article.author}</span>
            </div>
            <span>·</span>
            <span>{fmtDate(article.date)}</span>
            <span>·</span>
            <span>{article.readTime} de lecture</span>
          </div>
        </div>
      </div>

      {/* Corps 2 colonnes */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 280px", gap: 56, alignItems: "start" }}>
        <article style={{ fontSize: 16.5, minWidth: 0 }}>
          {blocks.map((block, i) => renderBlock(block, i))}
          <div style={{ marginTop: 56, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
            <span className={`badge ${CATEGORY_COLORS[article.categoryColor] ?? "badge-neutral"}`}>{article.category}</span>
            <span style={{ fontSize: 13, color: "var(--faint)" }}>{fmtDate(article.date)} · {article.readTime}</span>
          </div>
        </article>

        <ArticleSidebar headings={headings} related={related} accent={accent} shareUrl={`https://Data Universe.fr/actualites/${slug}`} />
      </div>
    </>
  );
}
