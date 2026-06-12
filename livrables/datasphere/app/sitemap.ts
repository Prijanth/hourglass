import type { MetadataRoute } from "next";
import certifications from "@/content/certifications.json";
import outils from "@/content/outils.json";
import comparatifs from "@/content/comparatifs.json";
import articles from "@/content/articles.json";
import metiersData from "@/content/metiers.json";
import conceptsData from "@/content/concepts.json";
import glossaireData from "@/content/glossaire.json";

const BASE = "https://datasphere.fr";

const STATIC_ROUTES = [
  { url: "/",               priority: 1.0,  changeFrequency: "daily"   },
  { url: "/actualites",     priority: 0.9,  changeFrequency: "daily"   },
  { url: "/certifications", priority: 0.9,  changeFrequency: "weekly"  },
  { url: "/concepts",       priority: 0.85, changeFrequency: "weekly"  },
  { url: "/outils",         priority: 0.85, changeFrequency: "weekly"  },
  { url: "/comparatifs",    priority: 0.8,  changeFrequency: "monthly" },
  { url: "/comparateur",    priority: 0.75, changeFrequency: "monthly" },
  { url: "/glossaire",      priority: 0.8,  changeFrequency: "monthly" },
  { url: "/metiers",        priority: 0.8,  changeFrequency: "weekly"  },
  { url: "/formations",     priority: 0.8,  changeFrequency: "weekly"  },
  { url: "/cas-usage",      priority: 0.75, changeFrequency: "monthly" },
  { url: "/ia",             priority: 0.75, changeFrequency: "weekly"  },
  { url: "/toolbox",        priority: 0.7,  changeFrequency: "monthly" },
  { url: "/communaute",     priority: 0.7,  changeFrequency: "weekly"  },
  { url: "/jobs",           priority: 0.7,  changeFrequency: "daily"   },
  { url: "/newsletter",     priority: 0.6,  changeFrequency: "monthly" },
  { url: "/debuter",           priority: 0.85, changeFrequency: "monthly" },
  { url: "/a-propos",          priority: 0.4,  changeFrequency: "monthly" },
  { url: "/mentions-legales",  priority: 0.2,  changeFrequency: "yearly"  },
  { url: "/confidentialite",   priority: 0.2,  changeFrequency: "yearly"  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Date de dernière mise à jour du site (à bumper manuellement après chaque déploiement majeur)
  const SITE_LAST_UPDATED = new Date("2026-06-12");

  const statics = STATIC_ROUTES.map(r => ({
    url: `${BASE}${r.url}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const certPages = certifications.certifications.map(c => ({
    url: `${BASE}/certifications/${c.id}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const outilPages = outils.map((o: { slug: string }) => ({
    url: `${BASE}/outils/${o.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparatifsPages = comparatifs.map((c: { slug: string }) => ({
    url: `${BASE}/comparatifs/${c.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const articlePages = articles.map((a: { slug: string; date?: string }) => ({
    url: `${BASE}/actualites/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : now,
    changeFrequency: "never" as const,
    priority: 0.6,
  }));

  const metiersPages = metiersData.map((m: { slug: string }) => ({
    url: `${BASE}/metiers/${m.slug}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const conceptsPages = conceptsData.concepts.map((c: { id: string }) => ({
    url: `${BASE}/concepts/${c.id}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  function toSlug(s: string) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  const glossairePages = (glossaireData as { term: string }[]).map(t => ({
    url: `${BASE}/glossaire/${toSlug(t.term)}`,
    lastModified: SITE_LAST_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...statics, ...certPages, ...outilPages, ...comparatifsPages, ...articlePages, ...metiersPages, ...conceptsPages, ...glossairePages];
}
