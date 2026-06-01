import { createClient } from '@supabase/supabase-js';

// Read values from environment or meta.env
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Create client only if both are present to prevent crashes on startup.
// Uses our lazy, safe initialization strategy.
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[Fitins & Cute Collections] Supabase is not configured yet. The platform is running in fully interactive Local-Durable offline mode. To sync with a real database, configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.',
    'color: #c5a880; font-weight: bold; font-family: monospace;'
  );
}
