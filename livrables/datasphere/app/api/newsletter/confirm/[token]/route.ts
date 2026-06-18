import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://Data Universe.fr";
  const { token } = await params;

  const supabase = getSupabase();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, confirmed, confirmation_sent_at")
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

  await supabase
    .from("newsletter_subscribers")
    .update({ confirmed: true, confirmed_at: new Date().toISOString(), confirmation_token: null })
    .eq("id", data.id);

  return NextResponse.redirect(`${BASE_URL}/newsletter/confirme`);
}
