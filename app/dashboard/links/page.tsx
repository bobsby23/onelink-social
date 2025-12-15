import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { LinksList } from "@/components/links/links-list"
import { AddLinkButton } from "@/components/links/add-link-button"

export default async function LinksPage() {
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

  // Fetch user's links
  const { data: links } = await supabase
    .from("link_blocks")
    .select("*")
    .eq("user_id", user.id)
    .order("position", { ascending: true })

  return (
    <DashboardShell user={profile}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Links</h1>
            <p className="text-muted-foreground">Manage your link blocks and visibility</p>
          </div>
          <AddLinkButton />
        </div>

        <LinksList initialLinks={links || []} userId={user.id} />
      </div>
    </DashboardShell>
  )
}
