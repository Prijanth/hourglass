import type { Metadata } from "next";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Offres d'emploi Data & IA en France | DataSphère",
  description: "Les meilleures offres d'emploi data et IA en France : Data Engineer, Data Scientist, ML Engineer, Analytics Engineer. CDI, freelance, remote.",
};

type Job = {
  id: string;
  titre: string;
  entreprise: string;
  type_contrat: string;
  lieu: string;
  remote: boolean;
  salaire_min: number | null;
  salaire_max: number | null;
  description: string;
  competences: string[];
  lien_candidature: string | null;
  created_at: string;
};

const CONTRAT_COLORS: Record<string, { bg: string; color: string }> = {
  CDI:        { bg: "rgba(14,116,144,0.1)",  color: "#0E7490" },
  CDD:        { bg: "rgba(180,83,9,0.1)",    color: "#B45309" },
  Freelance:  { bg: "rgba(124,58,237,0.1)",  color: "#7C3AED" },
  Stage:      { bg: "rgba(22,163,74,0.1)",   color: "#16A34A" },
  Alternance: { bg: "rgba(234,88,12,0.1)",   color: "#EA580C" },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

function fmtSalaire(min: number | null, max: number | null) {
  if (!min && !max) return null;
  if (min && max) return `${min}–${max}k€`;
  if (min) return `${min}k€+`;
  return `jusqu'à ${max}k€`;
}

export default async function JobsPage() {
  const { data: jobs } = await getSupabase()
    .from("job_offers")
    .select("id,titre,entreprise,type_contrat,lieu,remote,salaire_min,salaire_max,description,competences,lien_candidature,created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  const offres: Job[] = jobs ?? [];

  return (
    <main>
      {/* Hero */}
      <section style={{
        background: "linear-gradient(150deg, #FAFBFF 0%, #F5F3FF 55%, #EDE9FE 100%)",
        padding: "72px 24px 64px",
        borderBottom: "1px solid #E2E8F0",
        position: "relative",
        overflow: "hidden",
      }}>
        <div className="orb" style={{ width: 500, height: 500, background: "rgba(124,58,237,0.08)", top: -160, right: -80 }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <span className="section-label">Emploi data & IA</span>
              <h1 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800, color: "#0F172A",
                lineHeight: 1.1, letterSpacing: "-0.03em",
                marginBottom: 14,
              }}>
                Offres d&apos;emploi <span className="text-gradient">data & IA</span>
              </h1>
              <p style={{ fontSize: 16, color: "#64748B", lineHeight: 1.75, maxWidth: 560 }}>
                Les meilleures opportunités data en France, publiées par des entreprises qui recrutent activement.
              </p>
            </div>
            <Link href="/jobs/deposer" className="btn-primary" style={{ flexShrink: 0 }}>
              Publier une offre →
            </Link>
          </div>

          <div style={{ display: "flex", gap: 20, marginTop: 36, paddingTop: 28, borderTop: "1px solid #DDD6FE" }}>
            {[
              { n: offres.length, l: "offres actives" },
              { n: offres.filter(j => j.remote).length, l: "full remote" },
              { n: offres.filter(j => j.type_contrat === "CDI").length, l: "CDI" },
              { n: offres.filter(j => j.type_contrat === "Freelance").length, l: "freelance" },
            ].map(({ n, l }) => (
              <div key={l}>
                <div className="stat-num" style={{ fontSize: "1.6rem" }}>{n}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offres */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>
        {offres.length === 0 ? (
          <div>
            {/* État vide honnête */}
            <div style={{ textAlign: "center", padding: "64px 0 48px" }}>
              <div style={{ fontSize: 56, marginBottom: 18 }}>🚀</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
                Le job board ouvre bientôt
              </h2>
              <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: "0 auto 28px" }}>
                Aucune offre publiée pour l&apos;instant. Si tu recrutes en data, tu peux soumettre dès maintenant — ton offre sera parmi les premières visibles à l&apos;ouverture.
              </p>
              <Link href="/jobs/deposer" className="btn-primary">
                Soumettre une offre en avant-première →
              </Link>
            </div>

            {/* Espace recruteur */}
            <div style={{
              borderRadius: 20, background: "linear-gradient(135deg, #0B0F29 0%, #0F1B35 100%)",
              border: "1px solid rgba(124,58,237,0.2)", padding: "40px 44px", marginTop: 16,
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A78BFA" }}>
                    💼 Pourquoi publier ici ?
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "12px 0 16px" }}>
                    Une audience data qualifiée,<br />pas un flux de CV génériques
                  </h3>
                  <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 24 }}>
                    Les 2 400 abonnés à la newsletter DataSphère sont des data professionnels actifs en France. Ils lisent la newsletter chaque semaine parce qu&apos;ils travaillent dans la data — pas parce qu&apos;ils cherchent n&apos;importe quel emploi.
                  </p>
                  <Link href="/jobs/deposer" style={{
                    display: "inline-block", padding: "12px 28px", borderRadius: 10,
                    background: "#7C3AED", color: "#fff",
                    fontSize: 14, fontWeight: 700, textDecoration: "none",
                    fontFamily: "var(--font-display)",
                  }}>
                    Publier une offre gratuitement →
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { n: "2 400+", l: "abonnés newsletter", sub: "data professionnels actifs en France" },
                    { n: "~55%",   l: "profils Engineering",  sub: "Data Engineer, Analytics Engineer, MLOps" },
                    { n: "~30%",   l: "profils Science & IA", sub: "Data Scientist, ML Engineer, Prompt Eng." },
                    { n: "Gratuit", l: "pour les recruteurs", sub: "pendant la phase de lancement" },
                  ].map(({ n, l, sub }) => (
                    <div key={l} style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, color: "#A78BFA", lineHeight: 1, flexShrink: 0 }}>{n}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{l}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {offres.map(job => {
              const cc = CONTRAT_COLORS[job.type_contrat] ?? { bg: "rgba(100,116,139,0.1)", color: "#64748B" };
              const salaire = fmtSalaire(job.salaire_min, job.salaire_max);
              return (
                <div key={job.id} className="card" style={{ padding: "24px 28px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
                    <div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                        <span style={{ padding: "3px 10px", borderRadius: 100, background: cc.bg, color: cc.color, fontSize: 12, fontWeight: 700 }}>
                          {job.type_contrat}
                        </span>
                        {job.remote && (
                          <span style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(22,163,74,0.1)", color: "#16A34A", fontSize: 12, fontWeight: 700 }}>
                            Remote
                          </span>
                        )}
                        {salaire && (
                          <span style={{ padding: "3px 10px", borderRadius: 100, background: "#F0FDF4", color: "#15803D", fontSize: 12, fontWeight: 700, border: "1px solid #BBF7D0" }}>
                            {salaire} brut/an
                          </span>
                        )}
                      </div>

                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                        {job.titre}
                      </h2>
                      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 12 }}>
                        {job.entreprise} · {job.lieu}
                      </p>

                      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, marginBottom: 14 }}>
                        {job.description.length > 200 ? job.description.slice(0, 200) + "…" : job.description}
                      </p>

                      {job.competences.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                          {job.competences.slice(0, 6).map(c => (
                            <span key={c} className="skill-pill" style={{ fontSize: 11 }}>{c}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: "#94A3B8" }}>Publiée le {fmtDate(job.created_at)}</span>
                      {job.lien_candidature ? (
                        <a
                          href={job.lien_candidature}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                          style={{ fontSize: 13, padding: "10px 20px" }}
                        >
                          Postuler →
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>Contact par email</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA Employeur */}
      <section style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", padding: "64px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 2.5vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>
            Tu recrutes en data ?
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, marginBottom: 28 }}>
            Publie ton offre gratuitement sur DataSphère et touche directement 2 400 professionnels data francophones qui lisent notre newsletter chaque semaine.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/jobs/deposer" className="btn-primary">
              Publier une offre gratuitement →
            </Link>
            <Link href="/newsletter" className="btn-secondary">
              En savoir plus sur l&apos;audience →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
