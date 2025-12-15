import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PublicProfile } from "@/components/public/public-profile"

interface ProfilePageProps {
  params: Promise<{ nickname: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { nickname } = await params
  const supabase = await createClient()

  // Fetch user profile
  const { data: profile } = await supabase.from("users").select("*").eq("nickname", nickname).single()

  if (!profile) {
    notFound()
  }

  // Get current user to determine what links they can see
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch visible links based on user relationship
  let linksQuery = supabase.from("link_blocks").select("*").eq("user_id", profile.id).eq("is_active", true)

  if (user?.id === profile.id) {
    // Owner sees all links
    linksQuery = linksQuery.order("position", { ascending: true })
  } else if (user) {
    // Check if connected
    const { data: connection } = await supabase
      .from("connections")
      .select("status")
      .or(
        `and(requester_id.eq.${user.id},receiver_id.eq.${profile.id}),and(requester_id.eq.${profile.id},receiver_id.eq.${user.id})`,
      )
      .eq("status", "accepted")
      .single()

    if (connection) {
      // Connected users see public + friends links
      linksQuery = linksQuery.in("visibility", ["public", "friends"]).order("position", { ascending: true })
    } else {
      // Non-connected users see only public
      linksQuery = linksQuery.eq("visibility", "public").order("position", { ascending: true })
    }
  } else {
    // Anonymous users see only public
    linksQuery = linksQuery.eq("visibility", "public").order("position", { ascending: true })
  }

  const { data: links } = await linksQuery

  return <PublicProfile profile={profile} links={links || []} isOwner={user?.id === profile.id} />
}
