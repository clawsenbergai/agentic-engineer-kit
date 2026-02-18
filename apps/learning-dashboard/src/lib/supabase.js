import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && (serviceRoleKey || anonKey));
}

let cachedClient;

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) return null;
  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl, serviceRoleKey || anonKey, {
      auth: {
        persistSession: false,
      },
      db: {
        schema: "learning",
      },
    });
  }
  return cachedClient;
}
