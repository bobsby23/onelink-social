"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, X, Trash2, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

interface ConnectionCardProps {
  connection: any
  currentUserId: string
  type: "accepted" | "pending" | "sent"
}

export function ConnectionCard({ connection, currentUserId, type }: ConnectionCardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Determine which user to display
  const otherUser = connection.requester_id === currentUserId ? connection.receiver : connection.requester

  const handleAccept = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("connections").update({ status: "accepted" }).eq("id", connection.id)

    if (!error) {
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleReject = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("connections").update({ status: "rejected" }).eq("id", connection.id)

    if (!error) {
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("connections").delete().eq("id", connection.id)

    if (!error) {
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherUser.avatar_url || undefined} alt={otherUser.display_name} />
          <AvatarFallback>{otherUser.display_name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{otherUser.display_name}</h3>
            {type === "accepted" && (
              <Badge variant="secondary" className="text-xs">
                Connected
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{otherUser.nickname}</p>
        </div>

        <div className="flex items-center gap-2">
          {type === "pending" && (
            <>
              <Button size="sm" onClick={handleAccept} disabled={isLoading}>
                <Check className="mr-1 h-4 w-4" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={handleReject} disabled={isLoading}>
                <X className="mr-1 h-4 w-4" />
                Decline
              </Button>
            </>
          )}

          {type === "sent" && (
            <Button size="sm" variant="outline" onClick={handleDelete} disabled={isLoading}>
              <Trash2 className="mr-1 h-4 w-4" />
              Cancel
            </Button>
          )}

          {type === "accepted" && (
            <>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/u/${otherUser.nickname}`}>
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View Profile
                </Link>
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDelete} disabled={isLoading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
