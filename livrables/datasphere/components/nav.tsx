"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { GlobalSearch } from "./global-search";
import { ThemeToggle } from "./theme-toggle";

type NavItem  = { href: string; label: string; desc: string };
type NavGroup =
  | { label: string; href: string; items?: never }
  | { label: string; href?: never; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  { label: "Actualités", href: "/actualites" },
  {
    label: "Apprendre",
    items: [
      { href: "/concepts",    label: "Encyclopédie",   desc: "60+ concepts ML, Cloud, Gouvernance" },
      { href: "/ia",          label: "IA & LLMs",      desc: "Modèles, agents IA, AI Act" },
      { href: "/agents",      label: "Agents IA",      desc: "47 prompts data & corporate prêts à l'emploi" },
      { href: "/quiz",        label: "Quiz",           desc: "40 quiz de 20 questions — SQL, Python, Kafka, dbt…" },
      { href: "/glossaire",   label: "Glossaire",      desc: "246 définitions avec exemples" },
      { href: "/cas-usage",   label: "Cas d'usage",    desc: "104 projets réels annotés" },
    ],
  },
  {
    label: "Carrière",
    items: [
      { href: "/metiers",                  label: "Métiers data",          desc: "Salaires 2026 et trajectoires" },
      { href: "/calculateur-salaire",      label: "Calculateur salaire",   desc: "Estime ta progression salariale" },
      { href: "/certifications",           label: "Certifications",        desc: "166 AWS, Azure, GCP, Databricks" },
      { href: "/certifications/roadmap",   label: "Roadmap certifications",desc: "Dans quel ordre passer tes certifs ?" },
      { href: "/formations",               label: "Formations",            desc: "Ressources pour progresser" },
      { href: "/debuter",                  label: "Débuter en data",       desc: "Parcours guidé pour débutants" },
    ],
  },
  {
    label: "Outils",
    items: [
      { href: "/outils",          label: "Outils & plateformes", desc: "88 outils data — Snowflake, Databricks, dbt" },
      { href: "/comparatifs",    label: "Comparatifs",          desc: "21 face-à-face objectifs entre outils" },
      { href: "/comparateur",    label: "Comparateur",          desc: "Compare jusqu'à 3 outils en temps réel" },
      { href: "/ecosystem",      label: "Modern Data Stack",    desc: "Carte visuelle de l'écosystème data" },
      { href: "/outils/adoption",label: "Adoption par secteur", desc: "Quels outils dans quelle industrie ?" },
      { href: "/toolbox",        label: "Toolbox",              desc: "Snippets et checklists par rôle" },
    ],
  },
  {
    label: "Jobs",
    items: [
      { href: "/jobs",          label: "Offres d'emploi",   desc: "CDI, freelance, remote — toute la France" },
      { href: "/recruteurs",    label: "Recruteurs",        desc: "Publiez votre offre auprès de 2 400 pros data" },
      { href: "/marketplace",   label: "Déposer son CV",    desc: "Mise en relation avec des recruteurs data" },
      { href: "/jobs/deposer",  label: "Déposer une offre", desc: "Gratuit, validation sous 24h" },
    ],
  },
];

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== "/" && pathname.startsWith(href));
}

export function Nav() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup]       = useState<string | null>(null);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [mobileExp, setMobileExp]       = useState<string | null>(null);
  const [searchOpen, setSearchOpen]     = useState(false);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function groupActive(group: NavGroup) {
    if (group.href) return isActive(pathname, group.href);
    return group.items?.some(i => isActive(pathname, i.href)) ?? false;
  }

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid #E2E8F0",
      boxShadow: "0 1px 0 rgba(124,58,237,0.06), 0 1px 8px rgba(0,0,0,0.04)",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 24px", height: 60,
        display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 8,
      }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)",
            boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <polyline points="0,5 3,5 5,1 7,9 9,2 11,5 16,5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.03em", color: "#0F172A" }}>
            Data<span style={{ color: "var(--indigo)" }}>Sphère</span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {NAV_GROUPS.map(group => {
            const active = groupActive(group);

            if (!group.items) {
              return (
                <Link key={group.href} href={group.href} style={{
                  padding: "5px 12px", borderRadius: "var(--r-sm)",
                  fontSize: 13.5, fontWeight: active ? 600 : 400,
                  color: active ? "var(--indigo)" : "#64748B",
                  background: active ? "#EDE9FE" : "transparent",
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = "#0F172A"; el.style.background = "#F8FAFC"; }}}
                onMouseLeave={e => { if (!active) { const el = e.currentTarget as HTMLElement; el.style.color = "#64748B"; el.style.background = "transparent"; }}}
                >
                  {group.label}
                </Link>
              );
            }

            const isOpen = openGroup === group.label;
            return (
              <div
                key={group.label}
                style={{ position: "relative" }}
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <button
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpenGroup(isOpen ? null : group.label); } if (e.key === "Escape") setOpenGroup(null); }}
                  style={{
                  padding: "5px 12px", borderRadius: "var(--r-sm)",
                  fontSize: 13.5, fontWeight: active || isOpen ? 600 : 400,
                  color: active || isOpen ? "var(--indigo)" : "#64748B",
                  background: active || isOpen ? "#EDE9FE" : "transparent",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}>
                  {group.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", opacity: 0.55 }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {isOpen && (
                  <div style={{
                    position: "absolute", top: "100%", left: "50%",
                    transform: "translateX(-50%)", minWidth: 230,
                    paddingTop: 8, zIndex: 100,
                  }}>
                  <div style={{
                    background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14,
                    padding: 6, boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(124,58,237,0.06)",
                  }}>
                    {group.items.map(item => {
                      const ia = isActive(pathname, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpenGroup(null)}
                          style={{
                            display: "block", padding: "10px 12px", borderRadius: 8,
                            textDecoration: "none",
                            background: ia ? "#EDE9FE" : "transparent",
                            transition: "background 0.1s",
                          }}
                          onMouseEnter={e => { if (!ia) (e.currentTarget as HTMLElement).style.background = "#F8FAFC"; }}
                          onMouseLeave={e => { if (!ia) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 600, color: ia ? "var(--indigo)" : "#0F172A", marginBottom: 2 }}>
                            {item.label}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.4 }}>{item.desc}</div>
                        </Link>
                      );
                    })}
                  </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* CTA + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Bouton recherche globale */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Recherche"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: 8,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              cursor: "pointer", color: "#64748B",
              fontFamily: "inherit", transition: "all 0.15s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#C4B5FD"; el.style.color = "#7C3AED"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#E2E8F0"; el.style.color = "#64748B"; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span style={{ fontSize: 11, color: "#94A3B8", fontFamily: "var(--font-mono)", letterSpacing: "0.02em" }}>⌘K</span>
          </button>

          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menu"
            style={{
              display: "none", padding: "6px 8px",
              background: "transparent", border: "1.5px solid #E2E8F0",
              borderRadius: "var(--r-sm)", cursor: "pointer",
              flexDirection: "column", gap: 4,
            }}
            className="hamburger-btn"
          >
            <span style={{ display: "block", width: 18, height: 2, background: "#64748B", borderRadius: 2, transition: "transform 0.2s", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ display: "block", width: 18, height: 2, background: "#64748B", borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ display: "block", width: 18, height: 2, background: "#64748B", borderRadius: 2, transition: "transform 0.2s", transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>

          <ThemeToggle />
          <Link href="/newsletter" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13 }}>
            Newsletter
          </Link>
        </div>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Menu mobile */}
      {mobileOpen && (
        <div style={{ background: "rgba(255,255,255,0.98)", borderTop: "1px solid #E2E8F0", padding: "12px 16px" }}>
          {NAV_GROUPS.map(group => {
            if (!group.items) {
              const a = isActive(pathname, group.href);
              return (
                <Link key={group.href} href={group.href} onClick={() => setMobileOpen(false)} style={{
                  display: "block", padding: "10px 12px", borderRadius: "var(--r-sm)",
                  fontSize: 14, color: a ? "var(--indigo)" : "#0F172A",
                  background: a ? "#EDE9FE" : "transparent",
                  fontWeight: a ? 600 : 400, marginBottom: 2,
                }}>{group.label}</Link>
              );
            }

            const ga = group.items.some(i => isActive(pathname, i.href));
            const expanded = mobileExp === group.label;
            return (
              <div key={group.label}>
                <button
                  onClick={() => setMobileExp(expanded ? null : group.label)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "10px 12px", borderRadius: "var(--r-sm)",
                    fontSize: 14, fontWeight: ga ? 600 : 400,
                    color: ga ? "var(--indigo)" : "#0F172A",
                    background: ga ? "#EDE9FE" : "transparent",
                    border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 2,
                  }}
                >
                  {group.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {expanded && (
                  <div style={{ paddingLeft: 16, marginBottom: 4 }}>
                    {group.items.map(item => {
                      const ia = isActive(pathname, item.href);
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{
                          display: "block", padding: "8px 12px", borderRadius: "var(--r-sm)",
                          fontSize: 13, color: ia ? "var(--indigo)" : "#475569",
                          background: ia ? "#EDE9FE" : "transparent", marginBottom: 2,
                        }}>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{ marginTop: 8, display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid #F1F5F9" }}>
            <Link href="/communaute" onClick={() => setMobileOpen(false)} style={{
              flex: 1, textAlign: "center", padding: "10px",
              borderRadius: "var(--r-sm)", border: "1.5px solid #E2E8F0",
              fontSize: 13, fontWeight: 600, color: "#64748B",
            }}>
              Communauté
            </Link>
            <Link href="/newsletter" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ flex: 1, textAlign: "center", fontSize: 13 }}>
              Newsletter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
