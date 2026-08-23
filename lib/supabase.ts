// supabase.ts
import { createClient } from '@supabase/supabase-js';

// Pull values from your Expo environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);