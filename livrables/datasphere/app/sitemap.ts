import type { MetadataRoute } from "next";
import certifications from "@/content/certifications.json";
import outils from "@/content/outils.json";
import comparatifs from "@/content/comparatifs.json";
import articles from "@/content/articles.json";

const BASE = "https://datasphere.fr";

const STATIC_ROUTES = [
  { url: "/",               priority: 1.0,  changeFrequency: "daily"   },
  { url: "/actualites",     priority: 0.9,  changeFrequency: "daily"   },
  { url: "/certifications", priority: 0.9,  changeFrequency: "weekly"  },
  { url: "/concepts",       priority: 0.85, changeFrequency: "weekly"  },
  { url: "/outils",         priority: 0.85, changeFrequency: "weekly"  },
  { url: "/comparatifs",    priority: 0.8,  changeFrequency: "monthly" },
  { url: "/glossaire",      priority: 0.8,  changeFrequency: "monthly" },
  { url: "/metiers",        priority: 0.8,  changeFrequency: "weekly"  },
  { url: "/formations",     priority: 0.8,  changeFrequency: "weekly"  },
  { url: "/cas-usage",      priority: 0.75, changeFrequency: "monthly" },
  { url: "/ia",             priority: 0.75, changeFrequency: "weekly"  },
  { url: "/toolbox",        priority: 0.7,  changeFrequency: "monthly" },
  { url: "/communaute",     priority: 0.7,  changeFrequency: "weekly"  },
  { url: "/jobs",           priority: 0.7,  changeFrequency: "daily"   },
  { url: "/newsletter",     priority: 0.6,  changeFrequency: "monthly" },
  { url: "/mentions-legales",  priority: 0.2, changeFrequency: "yearly" },
  { url: "/confidentialite",   priority: 0.2, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const statics = STATIC_ROUTES.map(r => ({
    url: `${BASE}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const certPages = certifications.certifications.map(c => ({
    url: `${BASE}/certifications/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const outilPages = outils.map((o: { slug: string }) => ({
    url: `${BASE}/outils/${o.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparatifsPages = comparatifs.map((c: { slug: string }) => ({
    url: `${BASE}/comparatifs/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const articlePages = articles.map((a: { slug: string; date?: string }) => ({
    url: `${BASE}/actualites/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  return [...statics, ...certPages, ...outilPages, ...comparatifsPages, ...articlePages];
}
