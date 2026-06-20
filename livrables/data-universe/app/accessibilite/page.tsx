import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Déclaration d'accessibilité — Data Universe",
  description: "Déclaration de conformité WCAG 2.1 et état de l'accessibilité numérique du site Data Universe.",
};

const CONFORMES = [
  { critere: "1.1.1 — Contenu non textuel (A)", etat: "Conforme", note: "Les SVG décoratifs sont marqués aria-hidden. Les boutons iconiques ont aria-label." },
  { critere: "1.3.1 — Info et relations (A)", etat: "Conforme", note: "HTML sémantique utilisé : nav, main, header, footer, h1→h3 dans l'ordre logique." },
  { critere: "1.4.3 — Contraste minimum (AA)", etat: "Partiellement conforme", note: "Les couleurs d'accroche (#94A3B8 sur blanc) présentent un ratio de ~2.8:1 pour les textes secondaires non critiques. Les textes principaux et boutons sont conformes." },
  { critere: "2.1.1 — Clavier (A)", etat: "Conforme", note: "Navigation complète au clavier. La recherche globale (⌘K) se ferme avec Échap, les résultats sont accessibles via Tab et flèches." },
  { critere: "2.4.1 — Contournement de blocs (A)", etat: "Conforme", note: "Lien 'Aller au contenu principal' visible à la prise de focus clavier, en haut de chaque page." },
  { critere: "2.4.2 — Titre de page (A)", etat: "Conforme", note: "Chaque page a un titre <title> unique et descriptif généré via next/metadata." },
  { critere: "2.4.3 — Ordre de focus (A)", etat: "Partiellement conforme", note: "La modale de recherche place le focus sur l'input à l'ouverture. Pas de piège de focus complet implémenté." },
  { critere: "2.4.7 — Focus visible (AA)", etat: "Conforme", note: "outline: 2px solid #7C3AED défini sur :focus-visible dans globals.css pour tous les éléments interactifs." },
  { critere: "3.1.1 — Langue de la page (A)", etat: "Conforme", note: "lang='fr' défini sur l'élément html racine." },
  { critere: "3.3.1 — Identification des erreurs (A)", etat: "Partiellement conforme", note: "Les formulaires (newsletter) identifient les erreurs par texte mais n'utilisent pas aria-invalid systématiquement." },
  { critere: "4.1.2 — Nom, rôle, valeur (A)", etat: "Conforme", note: "Les modales ont role='dialog' + aria-modal + aria-label. Les boutons ont aria-label quand ils ne contiennent que des icônes. Le bandeau cookie a role='dialog' + aria-live." },
  { critere: "4.1.3 — Messages de statut (AA)", etat: "Non évalué", note: "Les notifications dynamiques (recherche en temps réel) n'ont pas encore de région aria-live dédiée." },
];

const NON_CONFORMES = [
  { critere: "1.4.3 — Contraste minimum (AA)", detail: "Les couleurs de texte secondaire #94A3B8 (ratio ~2.8:1) et #CBD5E1 (ratio ~1.8:1) utilisées pour les métadonnées, labels d'aide et raccourcis clavier ne satisfont pas le seuil de 4.5:1 pour le texte normal. Ces textes ne transportent pas d'information critique." },
  { critere: "2.4.3 — Ordre de focus / Piège de focus (A)", detail: "La modale de recherche globale ne piège pas le focus à l'intérieur. Un utilisateur clavier peut Tab hors de la modale sans la fermer. Contournement : Échap ferme la modale à tout moment." },
  { critere: "1.2.x — Médias temporels", detail: "Aucune vidéo ni audio n'est présent sur le site à ce jour. Critère non applicable mais à surveiller si des formats vidéo sont ajoutés." },
];

export default function AccessibilitePage() {
  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 60%, #EDE9FE 100%)",
        padding: "56px 24px 44px", borderBottom: "1px solid #E2E8F0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.06)", top: -80, right: -40, filter: "blur(60px)" }} />
        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, fontSize: 13, color: "#94A3B8" }}>
            <Link href="/" style={{ color: "#94A3B8" }}>Accueil</Link>
            <span>/</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Accessibilité</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 14 }}>
            Déclaration d&apos;accessibilité
          </h1>
          <p style={{ fontSize: 15.5, color: "#64748B", lineHeight: 1.75, maxWidth: 600, marginBottom: 24 }}>
            Data Universe s&apos;engage à rendre son site accessible conformément aux référentiels WCAG 2.1 (niveaux A et AA). Cette page documente l&apos;état actuel de la conformité et les dérogations connues.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "#15803D", background: "#F0FDF4", border: "1px solid #86EFAC" }}>WCAG 2.1 — Référentiel</span>
            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "#B45309", background: "#FFFBEB", border: "1px solid #FDE68A" }}>Partiellement conforme</span>
            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600, color: "#64748B", background: "#F1F5F9", border: "1px solid #CBD5E1" }}>Mis à jour : juin 2026</span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 72px" }}>

        {/* Niveau de conformité */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ padding: "24px 28px", borderRadius: 16, background: "#FFFBEB", border: "2px solid #FDE68A" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>!</span>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "#92400E", marginBottom: 6 }}>Partiellement conforme WCAG 2.1 AA</p>
                <p style={{ fontSize: 13.5, color: "#B45309", lineHeight: 1.7 }}>
                  Le site est conforme à la majorité des critères de niveau A et AA. Deux dérogations sont connues et documentées ci-dessous : le contraste des textes secondaires et l&apos;absence de piège de focus dans la modale de recherche. Une mise à jour corrective est planifiée.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats critères */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Audit WCAG 2.1</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 24 }}>
            État des critères évalués
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {CONFORMES.map((c, i) => (
              <div key={i} className="card" style={{ padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0, marginTop: 2,
                  padding: "2px 8px", borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: c.etat === "Conforme" ? "#F0FDF4" : c.etat === "Partiellement conforme" ? "#FFFBEB" : "#F8FAFC",
                  color: c.etat === "Conforme" ? "#15803D" : c.etat === "Partiellement conforme" ? "#B45309" : "#64748B",
                  border: `1px solid ${c.etat === "Conforme" ? "#86EFAC" : c.etat === "Partiellement conforme" ? "#FDE68A" : "#E2E8F0"}`,
                  whiteSpace: "nowrap" as const,
                }}>
                  {c.etat === "Conforme" ? "✓" : c.etat === "Non évalué" ? "–" : "~"} {c.etat}
                </span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>{c.critere}</p>
                  <p style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.6 }}>{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Non conformités */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Dérogations</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 24 }}>
            Non-conformités connues
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {NON_CONFORMES.map((nc, i) => (
              <div key={i} style={{ padding: "18px 20px", borderRadius: 12, background: "#FFF1F2", border: "1px solid #FECDD3" }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#9F1239", marginBottom: 6 }}>{nc.critere}</p>
                <p style={{ fontSize: 13, color: "#BE123C", lineHeight: 1.65 }}>{nc.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div style={{ marginBottom: 52 }}>
          <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "0.12em", color: "#94A3B8" }}>Technologies</span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)", fontWeight: 800, color: "#0F172A", marginTop: 6, marginBottom: 16 }}>
            Stack technique
          </h2>
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.75 }}>
              Le site Data Universe est construit avec <strong>Next.js 14</strong> (App Router, server components), <strong>TypeScript</strong> et du CSS via variables custom sans framework UI externe.
              La conformité WCAG repose sur : HTML5 sémantique, ARIA attributes natifs, CSS <code style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>:focus-visible</code>, et les attributs natifs des composants React.
            </p>
            <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Next.js 14", "React 18", "TypeScript", "HTML sémantique", "ARIA natif"].map(t => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div style={{ padding: "24px 28px", borderRadius: 16, background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>Signaler un problème d&apos;accessibilité</h2>
          <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.7, marginBottom: 14 }}>
            Si vous rencontrez une difficulté pour accéder à un contenu ou une fonctionnalité du site, merci de nous le signaler. Nous nous engageons à traiter votre demande dans les meilleurs délais.
          </p>
          <a
            href="mailto:contact@data-universe.fr?subject=Accessibilité — problème signalé"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 8, background: "#7C3AED", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
          >
            Contacter l&apos;équipe →
          </a>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 14 }}>
            Cette déclaration a été établie en juin 2026 sur la base d&apos;un auto-audit des critères WCAG 2.1 niveaux A et AA. Elle sera mise à jour lors de chaque évolution significative du site.
          </p>
        </div>

      </div>
    </main>
  );
}
