import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Provide a dummy valid URL if the env var isn't set up yet to prevent the app from crashing on load
const validUrl = supabaseUrl.startsWith('http') ? supabaseUrl : 'https://example.supabase.co';

export const supabase = createClient(validUrl, supabaseAnonKey);
