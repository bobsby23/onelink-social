"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_ONELINKSUPABASE_URL!

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_ONELINKSUPABASE_ANON_KEY!

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

  return client
}
