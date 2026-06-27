import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

console.log('Current Directory:', process.cwd());
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'FOUND' : 'MISSING');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? 'FOUND' : 'MISSING');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'FOUND' : 'MISSING');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Missing Supabase URL or Anon Key in environment variables.');
}

// Normal Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  },
  realtime: {
    transport: ws
  }
});

// Admin Client
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      realtime: {
        transport: ws
      }
    })
  : supabase;

console.log(`Supabase Client initialized. Admin bypass active: ${!!supabaseServiceRoleKey}`);

console.log(
  "SERVICE ROLE PREFIX:",
  supabaseServiceRoleKey.substring(0, 20)
);