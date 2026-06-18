import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Data Universe",
  description: "Politique de confidentialité et gestion des données personnelles sur Data Universe.",
};

export default function ConfidentialitePage() {
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: "72px 24px" }}>
      <div style={{ marginBottom: 40 }}>
        <Link href="/" style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 600 }}>← Retour à l&apos;accueil</Link>
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
        Politique de confidentialité
      </h1>
      <p style={{ color: "#94A3B8", fontSize: 14, marginBottom: 48 }}>Dernière mise à jour : 5 juin 2026</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            1. Responsable du traitement
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <strong>Prijanth Seevaratnam</strong>, éditeur de Data Universe.fr.<br />
            Contact : <a href="mailto:contact@Data Universe.fr" style={{ color: "var(--indigo)" }}>contact@Data Universe.fr</a>
          </p>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            2. Données collectées
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Data Universe collecte uniquement les données que tu fournis volontairement :</p>
            <br />
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Newsletter :</strong> adresse email, prénom (facultatif), fréquence choisie. Finalité : envoi de la newsletter.</li>
              <li><strong>Données de navigation :</strong> pages visitées, temps passé (via Vercel Analytics, anonymisé, sans cookie de tracking).</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            3. Base légale (RGPD)
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Newsletter :</strong> consentement explicite (double opt-in). Tu confirmes ton inscription par email.</li>
              <li><strong>Analytics :</strong> intérêt légitime (amélioration du service, données anonymisées).</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            4. Sous-traitants
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Data Universe utilise les services suivants :</p>
            <br />
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Supabase</strong> (stockage des emails abonnés) — serveurs en Europe (AWS eu-west-3)</li>
              <li><strong>Resend</strong> (envoi des emails de confirmation et newsletter) — conforme RGPD</li>
              <li><strong>Vercel</strong> (hébergement) — conforme RGPD, certifié SOC 2</li>
            </ul>
            <br />
            <p>Aucune donnée n&apos;est vendue ni cédée à des tiers à des fins commerciales.</p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            5. Durée de conservation
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>Adresses email newsletter : conservées jusqu&apos;au désabonnement, puis supprimées sous 30 jours.</li>
              <li>Données analytiques anonymisées : 12 mois.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            6. Tes droits
          </h2>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            <p>Conformément au RGPD, tu disposes des droits suivants :</p>
            <br />
            <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Accès</strong> : demander une copie de tes données</li>
              <li><strong>Rectification</strong> : corriger des données inexactes</li>
              <li><strong>Suppression</strong> : supprimer tes données (droit à l&apos;oubli)</li>
              <li><strong>Opposition</strong> : t&apos;opposer à un traitement</li>
              <li><strong>Désabonnement</strong> : lien présent dans chaque newsletter</li>
            </ul>
            <br />
            <p>
              Pour exercer ces droits : <a href="mailto:contact@Data Universe.fr" style={{ color: "var(--indigo)", fontWeight: 600 }}>contact@Data Universe.fr</a><br />
              Tu peux également déposer une réclamation auprès de la <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "var(--indigo)" }}>CNIL</a>.
            </p>
          </div>
        </section>

        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
            7. Cookies
          </h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8 }}>
            Data Universe n&apos;utilise pas de cookies publicitaires ni de cookies tiers de tracking. Les seuls cookies utilisés sont techniques (session, préférences) et strictement nécessaires au fonctionnement du site.
          </p>
        </section>

      </div>
    </main>
  );
}
