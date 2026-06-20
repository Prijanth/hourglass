import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import outils from "@/content/outils.json";
import { ToolLogo } from "@/components/tool-logo";

type Outil = typeof outils[number];
type OutilExt = Outil & {
  use_cases?:      { titre: string; description: string }[];
  companies?:      { name: string; usage?: string }[];
  certifications?: { name: string; provider: string; level?: string; url?: string }[];
  formations?:     { name: string; provider: string; type?: string; prix?: string }[];
};

export function generateStaticParams() {
  return outils.map((o) => ({ slug: o.slug }));
}

const BASE = "https://data-universe.fr";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const outil = outils.find((o) => o.slug === slug);
  if (!outil) return { title: "Outil — Data Universe" };
  const title = `${outil.name} — Présentation, cas d'usage et alternatives 2026 | Data Universe`;
  const description = `${outil.tagline}. Tarif : ${outil.pricing}. Points forts, limites et cas d'usage concrets.`;
  const ogImageUrl = `${BASE}/og?title=${encodeURIComponent(outil.name)}&subtitle=${encodeURIComponent(outil.tagline)}&type=${encodeURIComponent(outil.category)}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE}/outils/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: outil.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const LEVEL_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  "Fondamental": { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
  "Associé":     { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  "Professionnel": { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
  "Expert":      { bg: "#FFF7ED", color: "#C2410C", border: "#FED7AA" },
};

const TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  "MOOC":               { bg: "#EFF6FF", color: "#1D4ED8" },
  "Formation officielle": { bg: "#F5F3FF", color: "#6D28D9" },
  "Documentation":      { bg: "#F0FDF4", color: "#15803D" },
  "Bootcamp":           { bg: "#FFF7ED", color: "#C2410C" },
};

export default async function OutilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const outil = outils.find((o) => o.slug === slug) as OutilExt | undefined;
  if (!outil) notFound();

  const alternatives = outils.filter((o) => (outil.alternatives ?? []).includes(o.slug) && o.slug !== slug).slice(0, 3);

  const companies      = outil.companies     ?? [];
  const useCases       = outil.use_cases     ?? [];
  const certifications = outil.certifications ?? [];
  const formations     = outil.formations    ?? [];

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": outil.name,
    "description": outil.description,
    "url": outil.website,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "description": outil.pricing,
      "priceCurrency": "USD",
    },
    "featureList": outil.features?.join(", ") ?? "",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE },
      { "@type": "ListItem", "position": 2, "name": "Outils",  "item": `${BASE}/outils` },
      { "@type": "ListItem", "position": 3, "name": outil.name, "item": `${BASE}/outils/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <div style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)", padding: "44px 24px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, fontSize: 13, color: "var(--muted)" }}>
            <Link href="/" style={{ color: "var(--muted)" }}>Accueil</Link>
            <span>›</span>
            <Link href="/outils" style={{ color: "var(--muted)" }}>Outils</Link>
            <span>›</span>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>{outil.name}</span>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: 10 }}>
                  <ToolLogo slug={outil.slug} emoji={outil.emoji} name={outil.name} size={36} />
                </div>
                <div>
                  <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>{outil.name}</h1>
                  <span className="badge badge-indigo" style={{ marginTop: 6, display: "inline-flex" }}>{outil.category}</span>
                </div>
              </div>
              <p style={{ fontSize: 16.5, color: "var(--muted)", lineHeight: 1.65, maxWidth: 600 }}>{outil.tagline}</p>
            </div>

            {/* Pricing & badges */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16, padding: "20px 24px", flexShrink: 0, minWidth: 220 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 8 }}>Tarif</p>
              <p style={{ fontSize: 13.5, color: "var(--text)", lineHeight: 1.55, marginBottom: 14 }}>{outil.pricing}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {outil.open_source && <span className="badge badge-teal">Open source</span>}
                {outil.free_tier && <span className="badge badge-neutral">Free tier</span>}
                <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, background: "#F1F5F9", color: "#475569", border: "1px solid var(--border)", fontWeight: 500 }}>
                  {outil.learning_curve}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corps */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start" }}>

        {/* Contenu principal */}
        <div>
          {/* Description */}
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Présentation</span>
            <p style={{ fontSize: 16, color: "#334155", lineHeight: 1.8 }}>{outil.description}</p>
          </div>


          {/* Fonctionnalités */}
          <div style={{ marginBottom: 36 }}>
            <span className="section-label">Fonctionnalités clés</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {outil.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: "var(--surface-2)", borderRadius: 10 }}>
                  <span style={{ color: "var(--teal)", fontWeight: 700, fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 13.5, color: "var(--text)" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cas d'usage */}
          {useCases.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <span className="section-label">Cas d&apos;usage</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {useCases.map((uc, i) => (
                  <div key={i} style={{ display: "flex", gap: 16, padding: "18px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, borderLeft: "3px solid var(--indigo)" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--indigo-tint)", border: "1px solid var(--indigo-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: "var(--indigo)", fontFamily: "var(--font-display)" }}>
                      {i + 1}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4, lineHeight: 1.3 }}>{uc.titre}</p>
                      <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.65 }}>{uc.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pros / Cons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0F766E", marginBottom: 14 }}>✓ Points forts</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {outil.pros.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
                    <span style={{ color: "#0F766E", flexShrink: 0, fontWeight: 700 }}>+</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: "22px 24px" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#BE123C", marginBottom: 14 }}>✗ Limites</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {outil.cons.map((c) => (
                  <div key={c} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text)", lineHeight: 1.5 }}>
                    <span style={{ color: "#BE123C", flexShrink: 0, fontWeight: 700 }}>−</span>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pièges en production */}
          {"pieges_prod" in outil && Array.isArray((outil as { pieges_prod?: string[] }).pieges_prod) && (
            <div style={{ marginBottom: 36, padding: "22px 24px", borderRadius: 14, background: "#FFF7ED", border: "1px solid #FED7AA" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#C2410C", marginBottom: 14 }}>
                ⚠️ Pièges connus en production
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {((outil as { pieges_prod: string[] }).pieges_prod).map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, fontSize: 13.5, color: "#7C2D12", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, flexShrink: 0, color: "#EA580C" }}>{i + 1}.</span>
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best for / Not for */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 36 }}>
            <div style={{ padding: "18px 20px", background: "#F0FDFA", borderRadius: 12, border: "1px solid #CCFBF1" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0F766E", marginBottom: 8 }}>✓ Fait pour vous si…</p>
              <p style={{ fontSize: 14, color: "#0F766E", lineHeight: 1.6 }}>{outil.best_for}</p>
            </div>
            <div style={{ padding: "18px 20px", background: "#FFF1F2", borderRadius: 12, border: "1px solid #FFE4E6" }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#BE123C", marginBottom: 8 }}>✗ Pas fait pour vous si…</p>
              <p style={{ fontSize: 14, color: "#BE123C", lineHeight: 1.6 }}>{outil.not_for}</p>
            </div>
          </div>

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <span className="section-label">Certifications associées</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {certifications.map((cert, i) => {
                  const lvlStyle = LEVEL_STYLE[cert.level ?? ""] ?? { bg: "#F8FAFC", color: "#475569", border: "#E2E8F0" };
                  return (
                    <div key={i} style={{ padding: "16px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>🎓 {cert.name}</p>
                        {cert.level && (
                          <span style={{ padding: "2px 8px", borderRadius: 100, fontSize: 10.5, fontWeight: 600, background: lvlStyle.bg, color: lvlStyle.color, border: `1px solid ${lvlStyle.border}`, flexShrink: 0 }}>
                            {cert.level}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{cert.provider}</p>
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "var(--indigo)", fontWeight: 600, textDecoration: "none" }}>
                          Voir la certification →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Formations */}
          {formations.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <span className="section-label">Formations recommandées</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {formations.map((f, i) => {
                  const typeStyle = TYPE_STYLE[f.type ?? ""] ?? { bg: "#F1F5F9", color: "#475569" };
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{f.name}</p>
                          {f.type && (
                            <span style={{ padding: "1px 8px", borderRadius: 100, fontSize: 10.5, fontWeight: 600, background: typeStyle.bg, color: typeStyle.color }}>
                              {f.type}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12.5, color: "var(--muted)" }}>{f.provider}</p>
                      </div>
                      {f.prix && (
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", flexShrink: 0 }}>{f.prix}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {outil.tags.map((t) => (
              <span key={t} className="badge badge-neutral">{t}</span>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 80, display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Infos pratiques */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)" }}>Infos pratiques</p>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0", fontWeight: 600 }}>✓ 2026</span>
            </div>
            {[
              { label: "Lancé en", value: outil.launched },
              { label: "Courbe d'apprentissage", value: outil.learning_curve },
              { label: "Open source", value: outil.open_source ? "Oui" : "Non" },
              { label: "Free tier", value: outil.free_tier ? "Disponible" : "Non" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 10, marginBottom: 10, borderBottom: "1px solid var(--border)", fontSize: 13.5 }}>
                <span style={{ color: "var(--muted)" }}>{label}</span>
                <span style={{ fontWeight: 600 }}>{value}</span>
              </div>
            ))}
            <a href={outil.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", padding: "10px 0", textAlign: "center", background: "var(--indigo)", color: "#fff", borderRadius: 8, fontWeight: 700, fontSize: 14, fontFamily: "var(--font-display)", marginTop: 6 }}>
              Site officiel →
            </a>
          </div>

          {/* Entreprises utilisatrices */}
          {companies.length > 0 && (
            <div className="card" style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 14 }}>Utilisé par</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {companies.map((c) => (
                  <div key={c.name} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: 10, border: "1px solid var(--border)" }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text)", marginBottom: c.usage ? 2 : 0 }}>{c.name}</p>
                    {c.usage && <p style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>{c.usage}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {alternatives.length > 0 && (
            <div className="card" style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--faint)", marginBottom: 14 }}>Alternatives</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {alternatives.map((alt) => (
                  <Link key={alt.slug} href={`/outils/${alt.slug}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8, transition: "background 0.15s" }}>
                    <span style={{ fontSize: 18 }}>{alt.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{alt.name}</div>
                      <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{alt.category}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link href="/outils" style={{ display: "block", textAlign: "center", fontSize: 13.5, fontWeight: 600, color: "var(--muted)", padding: "10px", border: "1px solid var(--border)", borderRadius: 8 }}>
            ← Tous les outils
          </Link>
        </aside>
      </div>
    </>
  );
}
