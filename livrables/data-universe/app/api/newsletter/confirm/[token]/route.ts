import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { BASE_URL } from "@/lib/constants";
import { randomUUID } from "crypto";
import { Resend } from "resend";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const supabase = getSupabase();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmed, confirmation_sent_at, email, prenom")
    .eq("confirmation_token", token)
    .single();

  if (!data) {
    return NextResponse.redirect(`${BASE_URL}/newsletter?erreur=lien-invalide`);
  }

  if (data.confirmed) {
    return NextResponse.redirect(`${BASE_URL}/newsletter/confirme?deja=true`);
  }

  const sentAt = new Date(data.confirmation_sent_at);
  const expiredAt = new Date(sentAt.getTime() + 24 * 60 * 60 * 1000);
  if (new Date() > expiredAt) {
    return NextResponse.redirect(`${BASE_URL}/newsletter?erreur=lien-expire`);
  }

  const unsubscribeToken = randomUUID();
  await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), confirmation_token: unsubscribeToken })
    .eq("id", data.id);

  // Email de bienvenue avec le lien de désabonnement
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const prenomDisplay = data.prenom ? ` ${data.prenom}` : "";
    const unsubscribeUrl = `${BASE_URL}/api/newsletter/unsubscribe?token=${unsubscribeToken}`;

    await resend.emails.send({
      from: "Data Universe <contact@data-universe.fr>",
      to: data.email,
      subject: "Bienvenue dans la newsletter Data Universe !",
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 22px; font-weight: 800; color: #0F172A;">Data<span style="color: #7C3AED;"> Universe</span></span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #0F172A; margin-bottom: 16px;">
            Tu es abonné${prenomDisplay} !
          </h1>
          <p style="font-size: 16px; color: #475569; line-height: 1.7; margin-bottom: 24px;">
            Bienvenue dans la communauté <strong>Data Universe</strong>. Tu recevras chaque semaine les actualités data &amp; IA les plus importantes — triées, traduites et expliquées en français.
          </p>
          <p style="font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 32px;">
            En attendant la première édition, tu peux explorer l'encyclopédie, les fiches outils et les certifications directement sur le site.
          </p>
          <a href="${BASE_URL}" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none;">
            Explorer Data Universe →
          </a>
          <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 32px 0;" />
          <p style="font-size: 12px; color: #94A3B8; line-height: 1.6;">
            Data Universe · Le hub data &amp; IA francophone<br/>
            <a href="${BASE_URL}/confidentialite" style="color: #94A3B8;">Politique de confidentialité</a>
            &nbsp;·&nbsp;
            <a href="${BASE_URL}/mentions-legales" style="color: #94A3B8;">Mentions légales</a>
            &nbsp;·&nbsp;
            <a href="${unsubscribeUrl}" style="color: #94A3B8;">Se désabonner</a>
          </p>
        </div>
      `,
    }).catch(() => {
      // L'email de bienvenue est best-effort, on ne bloque pas la confirmation
    });
  }

  return NextResponse.redirect(`${BASE_URL}/newsletter/confirme`);
}
