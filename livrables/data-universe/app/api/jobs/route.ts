import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(ip, 3, 300_000)) {
    return NextResponse.json({ error: "Trop de soumissions. Réessaie dans 5 minutes." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Données invalides." }, { status: 400 });

  const { titre, entreprise, type_contrat, lieu, remote, salaire_min, salaire_max, description, competences, lien_candidature, email_contact } = body;

  if (!titre || !entreprise || !type_contrat || !lieu || !description || !email_contact) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  if (typeof titre !== "string" || titre.length > 200) return NextResponse.json({ error: "Titre invalide." }, { status: 400 });
  if (typeof entreprise !== "string" || entreprise.length > 200) return NextResponse.json({ error: "Entreprise invalide." }, { status: 400 });
  if (typeof description !== "string" || description.length > 10_000) return NextResponse.json({ error: "Description trop longue." }, { status: 400 });
  if (typeof lieu !== "string" || lieu.length > 200) return NextResponse.json({ error: "Lieu invalide." }, { status: 400 });

  const CONTRATS_VALIDES = ["CDI", "CDD", "Freelance", "Stage", "Alternance"];
  if (!CONTRATS_VALIDES.includes(type_contrat)) return NextResponse.json({ error: "Type de contrat invalide." }, { status: 400 });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  if (lien_candidature) {
    try { new URL(lien_candidature); } catch { return NextResponse.json({ error: "URL de candidature invalide." }, { status: 400 }); }
  }

  const sMin = salaire_min ? Number(salaire_min) : null;
  const sMax = salaire_max ? Number(salaire_max) : null;
  if (sMin !== null && (isNaN(sMin) || sMin < 0 || sMin > 500_000)) return NextResponse.json({ error: "Salaire minimum invalide." }, { status: 400 });
  if (sMax !== null && (isNaN(sMax) || sMax < 0 || sMax > 500_000)) return NextResponse.json({ error: "Salaire maximum invalide." }, { status: 400 });
  if (sMin !== null && sMax !== null && sMin > sMax) return NextResponse.json({ error: "Le salaire minimum doit être inférieur au maximum." }, { status: 400 });

  if (!Array.isArray(competences) || competences.length > 20) return NextResponse.json({ error: "Compétences invalides." }, { status: 400 });

  const { error } = await getSupabase().from("job_offers").insert({
    titre: titre.trim(),
    entreprise: entreprise.trim(),
    type_contrat,
    lieu: lieu.trim(),
    remote: Boolean(remote),
    salaire_min: sMin,
    salaire_max: sMax,
    description: description.trim(),
    competences: competences.slice(0, 20).map((c: unknown) => String(c).slice(0, 100)),
    lien_candidature: lien_candidature || null,
    email_contact: email_contact.toLowerCase().trim(),
    approved: false,
  });

  if (error) {
    console.error("Job insert error:", error);
    return NextResponse.json({ error: "Erreur lors de la soumission." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
