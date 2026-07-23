import { createClient } from '@supabase/supabase-js';

// Production Automatic Supabase Credentials from Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://meeyoo-demo.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
