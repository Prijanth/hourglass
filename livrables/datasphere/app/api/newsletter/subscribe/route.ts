import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";
import { Resend } from "resend";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessaie dans une minute." }, { status: 429 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://Data Universe.fr";
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });

  const { email, prenom, frequence } = body as { email?: string; prenom?: string; frequence?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
  }

  const token = randomUUID();

  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmed")
    .eq("email", email.toLowerCase())
    .single();

  if (existing?.confirmed) {
    return NextResponse.json({ error: "Cette adresse est déjà abonnée." }, { status: 409 });
  }

  if (existing) {
    await supabase
      .from("newsletter_subscribers")
      .update({ prenom: prenom ?? null, frequence: frequence ?? "hebdo", confirmation_token: token, confirmation_sent_at: new Date().toISOString() })
      .eq("email", email.toLowerCase());
  } else {
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: email.toLowerCase(),
      prenom: prenom ?? null,
      frequence: frequence ?? "hebdo",
      confirmed: false,
      confirmation_token: token,
      confirmation_sent_at: new Date().toISOString(),
    });
    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Erreur lors de l'inscription. Réessaie." }, { status: 500 });
    }
  }

  const confirmUrl = `${BASE_URL}/api/newsletter/confirm/${token}`;
  const prenomDisplay = prenom ? ` ${prenom}` : "";

  await resend.emails.send({
    from: "Data Universe <onboarding@resend.dev>",
    to: email,
    subject: "Confirme ton inscription à la newsletter Data Universe",
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px;">
        <div style="margin-bottom: 32px;">
          <span style="font-size: 22px; font-weight: 800; color: #0F172A;">Data<span style="color: #7C3AED;">Sphère</span></span>
        </div>
        <h1 style="font-size: 24px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">
          Bienvenue${prenomDisplay} !
        </h1>
        <p style="font-size: 16px; color: #475569; line-height: 1.7; margin-bottom: 28px;">
          Tu es à un clic de rejoindre <strong>2 400 professionnels de la data</strong> qui reçoivent
          chaque semaine les actualités data & IA les plus importantes — triées et expliquées en français.
        </p>
        <a href="${confirmUrl}" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">
          Confirmer mon inscription →
        </a>
        <p style="font-size: 13px; color: #94A3B8; margin-top: 28px; line-height: 1.6;">
          Ce lien est valable 24 heures. Si tu n'as pas demandé cette inscription, ignore simplement cet email.
        </p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
        <p style="font-size: 12px; color: #94A3B8;">
          Data Universe · Le hub data & IA francophone ·
          <a href="${BASE_URL}/confidentialite" style="color: #94A3B8;">Politique de confidentialité</a>
        </p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
