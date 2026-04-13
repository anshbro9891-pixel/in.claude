import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Supabase client for browser-side usage.
 * Falls back gracefully when env vars are not set (demo mode).
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string | null;
          model_id: string;
          user_id: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string | null;
          model_id: string;
          user_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["chat_sessions"]["Insert"]>;
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          created_at: string;
          role: "user" | "assistant";
          content: string;
          model_id: string | null;
          thinking_steps: Json | null;
          tokens_used: number | null;
        };
        Insert: {
          id?: string;
          session_id: string;
          created_at?: string;
          role: "user" | "assistant";
          content: string;
          model_id?: string | null;
          thinking_steps?: Json | null;
          tokens_used?: number | null;
        };
        Update: Partial<Database["public"]["Tables"]["chat_messages"]["Insert"]>;
      };
    };
  };
}
