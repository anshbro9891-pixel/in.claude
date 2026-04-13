import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Role = "user" | "assistant";

interface MemoryMessage {
  userId: string;
  sessionId: string;
  role: Role;
  content: string;
  modelUsed?: string | null;
}

function createSupabaseServiceClient(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const serviceKey =
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_API ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const supabase = createSupabaseServiceClient();

export async function saveMessage(message: MemoryMessage): Promise<void> {
  if (!supabase) return;

  const { userId, sessionId, role, content, modelUsed } = message;

  await supabase.from("inclaw_memory").insert({
    user_id: userId,
    session_id: sessionId,
    role,
    content,
    model_used: modelUsed ?? null,
  });

  // Keep only the latest 20 messages per user
  const { data: oldMessages } = await supabase
    .from("inclaw_memory")
    .select("id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(20, 200);

  if (oldMessages && oldMessages.length > 0) {
    const idsToDelete = oldMessages.map((m) => m.id);
    await supabase.from("inclaw_memory").delete().in("id", idsToDelete);
  }
}

export async function getHistory(
  userId: string,
  sessionId: string,
  limit = 10
): Promise<{ role: Role; content: string; modelUsed?: string | null }[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("inclaw_memory")
    .select("role, content, model_used")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return data
    .map((row) => ({
      role: row.role as Role,
      content: row.content,
      modelUsed: row.model_used,
    }))
    .reverse();
}

export async function clearHistory(userId: string, sessionId: string): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("inclaw_memory")
    .delete()
    .eq("user_id", userId)
    .eq("session_id", sessionId);
}
