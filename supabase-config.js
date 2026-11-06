// Public browser configuration. This key is intended for client-side use with Supabase RLS.
(() => {
  const SUPABASE_URL = 'https://lbjtcqwbsjnhrubpkctb.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_yGKVsHDfIOZRzvs9Jset1g_mPykkpYa';
  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase JS library did not load.');
    return;
  }
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
})();
