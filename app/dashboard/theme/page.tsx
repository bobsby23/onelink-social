import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ThemeGenerator } from "@/components/theme/theme-generator"
import { ThemePreview } from "@/components/theme/theme-preview"

export default async function ThemePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  return (
    <DashboardShell user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile Theme</h1>
          <p className="text-muted-foreground">Customize your profile appearance with AI-generated themes</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ThemeGenerator userId={profile.id} currentTheme={profile.theme_config} />
          <ThemePreview theme={profile.theme_config} profile={profile} />
        </div>
      </div>
    </DashboardShell>
  )
}
