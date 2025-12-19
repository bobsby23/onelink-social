import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/types/database"

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_ONELINKSUPABASE_URL!,
    process.env.NEXT_PUBLIC_ONELINKSUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    },
  )

  await supabase.auth.getUser()

  return response
}
