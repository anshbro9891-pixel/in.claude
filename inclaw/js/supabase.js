/**
 * Creates and returns a singleton Supabase client from window globals.
 */
export function getSupabaseClient() {
  try {
    if (window.__inclawSupabase) return window.__inclawSupabase;
    if (!window.supabase?.createClient) {
      throw new Error('Supabase CDN not loaded');
    }
    const url = window.SUPABASE_URL || localStorage.getItem('SUPABASE_URL') || '';
    const key = window.SUPABASE_ANON_KEY || localStorage.getItem('SUPABASE_ANON_KEY') || '';
    if (!url || !key) {
      console.warn('[INCLAW] Supabase keys missing; auth and persistence are disabled until configured.');
      return null;
    }
    window.__inclawSupabase = window.supabase.createClient(url, key);
    return window.__inclawSupabase;
  } catch (error) {
    console.error('[INCLAW] Supabase init failed', error);
    return null;
  }
}

/**
 * Saves a pending payment row in Supabase pending_payments table.
 */
export async function savePendingPayment(data) {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase not configured');
    const { error } = await client.from('pending_payments').insert([data]);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[INCLAW] savePendingPayment failed', error);
    throw error;
  }
}
