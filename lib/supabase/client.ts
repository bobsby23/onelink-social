import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lvfohmsqcpcxndrtvneh.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2Zm9obXNxY3BjeG5kcnR2bmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3MTAwODMsImV4cCI6MjA4MTI4NjA4M30.mm39ZcHyf-4JL5J4rWjdbENlrh8r5NWMKzdm3sUF-lI"

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
