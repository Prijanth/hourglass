import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales — Data Universe",
  description: "Mentions légales du site Data Universe, hub data & IA francophone.",
};

export default function MentionsLegalesPage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 600 }}>← Retour à l&apos;accueil</Link>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
        Mentions légales
      </h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 48 }}>Dernière mise à jour : 26 juin 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            1. Éditeur du site
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Le site <strong>data-universe.fr</strong> est édité par un particulier domicilié en France.</p>
            <br />
            <p>
              Conformément à l&apos;article 6 III 2° de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN), les coordonnées complètes de l&apos;éditeur sont tenues à disposition par l&apos;hébergeur du site (voir section 2 ci-dessous), qui les communique sur demande des autorités compétentes.
            </p>
            <br />
            <p>Email de contact : <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)" }}>contact@data-universe.fr</a></p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            2. Hébergement
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Le site est hébergé par :</p>
            <br />
            <p><strong>Netlify Inc.</strong></p>
            <p>44 Montgomery Street, Suite 300, San Francisco, CA 94104, États-Unis</p>
            <p>Site web : <a href="https://netlify.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--indigo)" }}>netlify.com</a></p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            3. Propriété intellectuelle
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            L&apos;ensemble du contenu de ce site (textes, articles, données, graphiques, design) est la propriété exclusive de l&apos;éditeur, sauf mention contraire. Toute reproduction, distribution ou utilisation, même partielle, sans autorisation écrite préalable est interdite.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            4. Responsabilité
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Les informations publiées sur Data Universe sont fournies à titre informatif. L&apos;éditeur s&apos;efforce d&apos;en assurer l&apos;exactitude mais ne peut garantir leur exhaustivité ou leur actualité. Data Universe décline toute responsabilité pour les décisions prises sur la base des informations publiées.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            5. Liens d&apos;affiliation
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Certains liens présents sur ce site sont des liens d&apos;affiliation. Si tu cliques sur l&apos;un de ces liens et effectues un achat, Data Universe peut percevoir une commission, sans frais supplémentaires pour toi. Ces liens sont signalés explicitement et ne biaisent pas les contenus éditoriaux.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            6. Données personnelles
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Le traitement des données personnelles est décrit dans notre{" "}
            <Link href="/confidentialite" style={{ color: "var(--indigo)", fontWeight: 600 }}>politique de confidentialité</Link>.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            7. Contact
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Pour toute question relative à ce site :{" "}
            <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)", fontWeight: 600 }}>contact@data-universe.fr</a>
          </p>
        </section>
      </div>
    </main>
  );
}
