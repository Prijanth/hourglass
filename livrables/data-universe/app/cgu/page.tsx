import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Data Universe",
  description: "Conditions générales d'utilisation du site Data Universe et de la newsletter.",
};

export default function CguPage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 600 }}>← Retour à l&apos;accueil</Link>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
        Conditions Générales d&apos;Utilisation
      </h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 48 }}>Dernière mise à jour : 26 juin 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            1. Objet
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du site <strong>data-universe.fr</strong> ainsi que la souscription à la newsletter Data Universe. En accédant au site ou en s&apos;inscrivant à la newsletter, l&apos;utilisateur accepte sans réserve les présentes CGU.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            2. Éditeur du service
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Le site est édité par un particulier domicilié en France. Conformément à l&apos;article 6 III 2° de la loi n° 2004-575 du 21 juin 2004 (LCEN), les coordonnées de l&apos;éditeur sont tenues à disposition par l&apos;hébergeur.</p>
            <p style={{ marginTop: 8 }}>Contact : <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)" }}>contact@data-universe.fr</a></p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            3. Accès au site
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Le site Data Universe est accessible gratuitement, sans inscription préalable, à toute personne disposant d&apos;un accès à Internet. L&apos;éditeur se réserve le droit de modifier, suspendre ou interrompre l&apos;accès au site à tout moment, sans préavis ni indemnité.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            4. Utilisation du contenu
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 12 }}>
            <p>
              Le contenu du site (articles, fiches, glossaire, données, design) est la propriété exclusive de l&apos;éditeur. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
            </p>
            <p>
              Les informations publiées sont fournies à titre informatif et pédagogique. Elles ne constituent pas un conseil professionnel (juridique, financier, médical ou autre). L&apos;utilisateur est seul responsable des décisions prises sur la base des contenus du site.
            </p>
            <p>
              Certains liens présents sur le site sont des liens d&apos;affiliation. En cliquant sur ces liens, Data Universe peut percevoir une commission sans frais supplémentaires pour l&apos;utilisateur. Ces liens sont signalés explicitement.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            5. Newsletter
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 12 }}>
            <p>
              L&apos;inscription à la newsletter Data Universe est gratuite et volontaire. Elle implique la fourniture d&apos;une adresse email valide et, optionnellement, d&apos;un prénom.
            </p>
            <p>
              L&apos;inscription est soumise à un processus de double opt-in : un email de confirmation est envoyé à l&apos;adresse fournie, et l&apos;abonnement n&apos;est effectif qu&apos;après validation par clic sur le lien de confirmation. Ce lien est valable 24 heures.
            </p>
            <p>
              L&apos;abonné peut se désinscrire à tout moment en cliquant sur le lien de désabonnement présent dans chaque email envoyé, ou en écrivant à <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)" }}>contact@data-universe.fr</a>. La désinscription est effective immédiatement.
            </p>
            <p>
              Les données collectées (email, prénom optionnel, fréquence souhaitée) sont utilisées exclusivement pour l&apos;envoi de la newsletter. Elles ne sont jamais cédées à des tiers à des fins commerciales.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            6. Liens externes
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Le site peut contenir des liens vers des sites tiers. Data Universe n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur politique de confidentialité ou leur disponibilité.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            7. Données personnelles
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Le traitement des données personnelles collectées via le site est détaillé dans notre{" "}
            <Link href="/confidentialite" style={{ color: "var(--indigo)", fontWeight: 600 }}>politique de confidentialité</Link>.
            Conformément au RGPD, l&apos;utilisateur dispose d&apos;un droit d&apos;accès, de rectification et de suppression de ses données en écrivant à{" "}
            <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)" }}>contact@data-universe.fr</a>.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            8. Limitation de responsabilité
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Data Universe s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations publiées, mais ne peut garantir leur exhaustivité, leur absence d&apos;erreurs ou leur adéquation à des besoins particuliers. L&apos;éditeur décline toute responsabilité pour tout dommage direct ou indirect résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            9. Modification des CGU
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            L&apos;éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur cette page. L&apos;utilisation du site après modification vaut acceptation des nouvelles CGU.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            10. Droit applicable
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis aux juridictions compétentes françaises.
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            11. Contact
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Pour toute question relative aux présentes CGU :{" "}
            <a href="mailto:contact@data-universe.fr" style={{ color: "var(--indigo)", fontWeight: 600 }}>contact@data-universe.fr</a>
          </p>
        </section>

      </div>
    </main>
  );
}
