import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_ONELINKSUPABASE_URL || process.env.NEXT_PUBLIC_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_ONELINKSUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables")
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  return client
}
