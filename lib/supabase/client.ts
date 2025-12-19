"use client"

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/lib/types/database"

let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_ONELINKSUPABASE_URL!,
    process.env.NEXT_PUBLIC_ONELINKSUPABASE_ANON_KEY!,
  )

  return client
}
