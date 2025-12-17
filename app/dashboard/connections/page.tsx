import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ConnectionsTabs } from "@/components/connections/connections-tabs"

export default async function ConnectionsPage() {
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

  // Fetch all connections
  const { data: connections } = await supabase
    .from("connections")
    .select(
      `
      *,
      requester:requester_id(id, nickname, display_name, avatar_url),
      receiver:receiver_id(id, nickname, display_name, avatar_url)
    `,
    )
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  return (
    <DashboardShell user={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Friends</h1>
          <p className="text-muted-foreground">Manage your OneLink friends and friend requests</p>
        </div>

        <ConnectionsTabs connections={connections || []} currentUserId={user.id} />
      </div>
    </DashboardShell>
  )
}
