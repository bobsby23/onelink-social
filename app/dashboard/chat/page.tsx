import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"

export default async function ChatPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get accepted connections with user details
  const { data: connections } = await supabase
    .from("connections")
    .select(
      `
      id,
      requester_id,
      receiver_id,
      created_at,
      requester:users!connections_requester_id_fkey(id, nickname, display_name, avatar_url),
      receiver:users!connections_receiver_id_fkey(id, nickname, display_name, avatar_url)
    `,
    )
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false })

  // Transform connections to include friend details
  const friends =
    connections?.map((conn: any) => {
      const friend = conn.requester_id === user.id ? conn.receiver : conn.requester
      return {
        connectionId: conn.id,
        ...friend,
      }
    }) || []

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ChatInterface currentUserId={user.id} friends={friends} />
    </div>
  )
}
