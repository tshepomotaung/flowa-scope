import { createClient } from "@supabase/supabase-js"

// Lazy-initialised so the module can be imported at build time
// without requiring env vars to be present during static analysis.
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error("Missing Supabase env vars")
  return createClient(url, key)
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error("Missing Supabase service role env vars")
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
