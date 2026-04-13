import { supabase } from "@/lib/supabase";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

/**
 * Sign up a new user with email + password.
 * Stores full name in user_metadata.
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
): Promise<AuthResult> {
  if (!supabase) {
    return { user: null, error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) return { user: null, error: error.message };
  const u = data.user;
  if (!u) return { user: null, error: "Sign up succeeded but no user returned. Check your email to confirm." };
  return {
    user: {
      id: u.id,
      email: u.email ?? email,
      name: (u.user_metadata?.full_name as string | undefined) ?? name,
      avatarUrl: u.user_metadata?.avatar_url as string | undefined,
      createdAt: u.created_at,
    },
    error: null,
  };
}

/**
 * Sign in with email + password.
 */
export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!supabase) {
    return { user: null, error: "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local" };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error: error.message };
  const u = data.user;
  if (!u) return { user: null, error: "Sign in failed." };
  return {
    user: {
      id: u.id,
      email: u.email ?? email,
      name: u.user_metadata?.full_name as string | undefined,
      avatarUrl: u.user_metadata?.avatar_url as string | undefined,
      createdAt: u.created_at,
    },
    error: null,
  };
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

/**
 * Get the currently authenticated user.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? "",
    name: u.user_metadata?.full_name as string | undefined,
    avatarUrl: u.user_metadata?.avatar_url as string | undefined,
    createdAt: u.created_at,
  };
}

/**
 * Update user profile (name).
 */
export async function updateProfile(
  name: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.auth.updateUser({
    data: { full_name: name },
  });
  return { error: error?.message ?? null };
}

/**
 * Send a password reset email.
 */
export async function resetPassword(
  email: string,
): Promise<{ error: string | null }> {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/settings?tab=security`,
  });
  return { error: error?.message ?? null };
}

/**
 * Subscribe to auth state changes. Returns unsubscribe function.
 */
export function onAuthChange(
  callback: (user: AuthUser | null) => void,
): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    const u = session?.user ?? null;
    if (!u) {
      callback(null);
      return;
    }
    callback({
      id: u.id,
      email: u.email ?? "",
      name: u.user_metadata?.full_name as string | undefined,
      avatarUrl: u.user_metadata?.avatar_url as string | undefined,
      createdAt: u.created_at,
    });
  });
  return () => data.subscription.unsubscribe();
}
