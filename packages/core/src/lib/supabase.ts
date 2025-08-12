// packages/core/src/lib/supabase.ts
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

// Get the environment variables
const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate the environment variables
if(!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be defined in the environment variables.');
}

// Create and export a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);