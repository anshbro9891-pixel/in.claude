import { getSupabaseClient } from './supabase.js';

/**
 * Loads current user and updates page auth UI.
 */
export async function initAuthUi() {
  try {
    const client = getSupabaseClient();
    if (!client) return;
    const { data } = await client.auth.getUser();
    const user = data?.user;
    const authBtn = document.getElementById('auth-btn');
    if (authBtn && user) {
      authBtn.textContent = user.email?.[0]?.toUpperCase() || 'U';
      authBtn.href = 'dashboard.html';
    }
  } catch (error) {
    console.error('[INCLAW] initAuthUi failed', error);
  }
}

/**
 * Binds login and signup handlers to login form buttons.
 */
export function bindLoginPage() {
  const form = document.getElementById('auth-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const client = getSupabaseClient();
      if (!client) throw new Error('Supabase not configured');
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const mode = document.querySelector('input[name="auth-mode"]:checked')?.value || 'login';
      if (mode === 'signup') {
        const { error } = await client.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      location.href = 'dashboard.html';
    } catch (error) {
      console.error('[INCLAW] auth submit failed', error);
      document.getElementById('auth-status').textContent = error.message;
    }
  });

  document.getElementById('oauth-google')?.addEventListener('click', () => oauth('google'));
  document.getElementById('oauth-github')?.addEventListener('click', () => oauth('github'));
}

/**
 * Starts OAuth sign-in flow with selected provider.
 */
async function oauth(provider) {
  try {
    const client = getSupabaseClient();
    if (!client) throw new Error('Supabase not configured');
    const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: location.origin + '/inclaw/dashboard.html' } });
    if (error) throw error;
  } catch (error) {
    console.error('[INCLAW] OAuth failed', error);
    const status = document.getElementById('auth-status');
    if (status) status.textContent = error.message;
  }
}
