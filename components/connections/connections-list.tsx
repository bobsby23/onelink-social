"use client"

import { ConnectionCard } from "@/components/connections/connection-card"

interface ConnectionsListProps {
  connections: any[]
  currentUserId: string
  type: "accepted" | "pending" | "sent"
}

export function ConnectionsList({ connections, currentUserId, type }: ConnectionsListProps) {
  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">
          {type === "accepted" && "No friends yet"}
          {type === "pending" && "No pending requests"}
          {type === "sent" && "No sent requests"}
        </p>
        <p className="text-sm text-muted-foreground">
          {type === "accepted" && "Connect with other OneLink users to see their friends-only content"}
          {type === "pending" && "You have no pending friend requests"}
          {type === "sent" && "You haven't sent any friend requests"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {connections.map((connection) => (
        <ConnectionCard key={connection.id} connection={connection} currentUserId={currentUserId} type={type} />
      ))}
    </div>
  )
}
