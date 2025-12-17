import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { userId, theme } = await request.json()

    if (!userId || !theme) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user's theme config
    const { error } = await supabase.from("users").update({ theme_config: theme }).eq("id", userId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving theme:", error)
    return NextResponse.json({ error: "Failed to save theme" }, { status: 500 })
  }
}
