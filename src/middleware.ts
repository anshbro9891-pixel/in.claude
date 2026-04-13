import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const MAX_MESSAGES_PER_HOUR = 30;

function createSupabaseClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";
  const key =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_API ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function currentHourWindow() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours()));
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname !== "/api/chat") {
    return NextResponse.next();
  }

  const userId = req.headers.get("x-inclaw-user-id") || "anonymous";
  const sessionId = req.headers.get("x-inclaw-session-id") || "unknown";
  const supabase = createSupabaseClient();

  if (!supabase) return NextResponse.next();

  const windowStart = currentHourWindow();
  const windowEnd = new Date(windowStart.getTime() + 60 * 60 * 1000);

  try {
    const { data } = await supabase
      .from("inclaw_usage")
      .select("id, message_count, hour_window")
      .eq("user_id", userId)
      .order("hour_window", { ascending: false })
      .limit(1)
      .single();

    if (data && data.hour_window && new Date(data.hour_window) >= windowStart) {
      if (data.message_count >= MAX_MESSAGES_PER_HOUR) {
        const minutesLeft = Math.max(1, Math.ceil((windowEnd.getTime() - Date.now()) / 60000));
        return NextResponse.json(
          { error: `You've reached the free limit. INCLAW will be back for you in ${minutesLeft} minutes.` },
          { status: 429 }
        );
      }

      await supabase
        .from("inclaw_usage")
        .update({ message_count: data.message_count + 1 })
        .eq("id", data.id);
    } else {
      await supabase.from("inclaw_usage").insert({
        user_id: userId,
        hour_window: windowStart.toISOString(),
        message_count: 1,
      });
    }

    console.info(`[inclaw-usage] user=${userId} session=${sessionId} window=${windowStart.toISOString()}`);
    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/api/chat"],
};
