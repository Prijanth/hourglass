import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { BASE_URL } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(`${BASE_URL}/newsletter/desabonnement?erreur=lien-invalide`);
  }

  const supabase = getSupabase();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, unsubscribed_at")
    .eq("confirmation_token", token)
    .single();

  if (!data) {
    return NextResponse.redirect(`${BASE_URL}/newsletter/desabonnement?erreur=lien-invalide`);
  }

  if (data.unsubscribed_at) {
    return NextResponse.redirect(`${BASE_URL}/newsletter/desabonnement?deja=true`);
  }

  await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString(), confirmed: false })
    .eq("id", data.id);

  return NextResponse.redirect(`${BASE_URL}/newsletter/desabonnement`);
}
