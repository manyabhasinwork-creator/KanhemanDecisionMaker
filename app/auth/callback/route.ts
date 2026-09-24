import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Supabase redirects here after the user clicks the magic link in their
// email. We exchange the one-time code for a real session, then send them
// on to wherever they were headed (default: /dashboard).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-failed`);
}
