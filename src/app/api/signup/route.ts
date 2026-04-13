import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  "";

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE ||
  "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, intent, role } = body ?? {};

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          stored: false,
          message: "Supabase credentials are not configured. Submission captured locally.",
        },
        { status: 200 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabase.from("inclaw_signups").insert({
      name,
      email,
      intent: intent || null,
      role: role || null,
      source: "web-signup",
    });

    if (error) {
      return NextResponse.json(
        { stored: false, message: error.message },
        { status: 200 }
      );
    }

    return NextResponse.json({ stored: true });
  } catch {
    return NextResponse.json({ error: "Unable to process signup." }, { status: 500 });
  }
}
