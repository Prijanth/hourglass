import { NextRequest, NextResponse } from "next/server";
import articles from "@/content/articles.json";
import outils from "@/content/outils.json";
import metiers from "@/content/metiers.json";
import glossaire from "@/content/glossaire.json";

type Result = { type: string; title: string; description: string; href: string };

const INDEX: Result[] = [
  ...articles.map(a => ({
    type: "article",
    title: a.title,
    description: a.excerpt.slice(0, 90),
    href: `/actualites/${a.slug}`,
  })),
  ...(outils as { name: string; tagline: string; slug: string }[]).map(o => ({
    type: "outil",
    title: o.name,
    description: o.tagline,
    href: `/outils/${o.slug}`,
  })),
  ...(metiers as { title: string; tagline: string; slug: string }[]).map(m => ({
    type: "metier",
    title: m.title,
    description: m.tagline,
    href: `/metiers/${m.slug}`,
  })),
  ...(glossaire as { term: string; definition: string }[]).map(g => ({
    type: "glossaire",
    title: g.term,
    description: (g.definition ?? "").slice(0, 90),
    href: `/glossaire?q=${encodeURIComponent(g.term)}`,
  })),
];

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  if (!q || q.length < 2) return NextResponse.json([]);

  const results = INDEX.filter(
    r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
  ).slice(0, 8);

  return NextResponse.json(results, {
    headers: { "Cache-Control": "no-store" },
  });
}
