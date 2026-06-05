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

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_contact)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const { error } = await getSupabase().from("job_offers").insert({
    titre, entreprise, type_contrat, lieu,
    remote: Boolean(remote),
    salaire_min: salaire_min ? Number(salaire_min) : null,
    salaire_max: salaire_max ? Number(salaire_max) : null,
    description,
    competences: Array.isArray(competences) ? competences : [],
    lien_candidature: lien_candidature || null,
    email_contact,
    approved: false,
  });

  if (error) {
    console.error("Job insert error:", error);
    return NextResponse.json({ error: "Erreur lors de la soumission." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
