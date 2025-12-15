"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConnectionsList } from "@/components/connections/connections-list"
import { SearchUsers } from "@/components/connections/search-users"
import { Badge } from "@/components/ui/badge"

interface ConnectionsTabsProps {
  connections: any[]
  currentUserId: string
}

export function ConnectionsTabs({ connections, currentUserId }: ConnectionsTabsProps) {
  // Separate connections by status
  const accepted = connections.filter((c) => c.status === "accepted")
  const pending = connections.filter((c) => c.status === "pending" && c.receiver_id === currentUserId)
  const sent = connections.filter((c) => c.status === "pending" && c.requester_id === currentUserId)

  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList>
        <TabsTrigger value="all">
          All
          {accepted.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {accepted.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="pending">
          Requests
          {pending.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {pending.length}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="sent">Sent</TabsTrigger>
        <TabsTrigger value="search">Find Users</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        <ConnectionsList connections={accepted} currentUserId={currentUserId} type="accepted" />
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        <ConnectionsList connections={pending} currentUserId={currentUserId} type="pending" />
      </TabsContent>

      <TabsContent value="sent" className="space-y-4">
        <ConnectionsList connections={sent} currentUserId={currentUserId} type="sent" />
      </TabsContent>

      <TabsContent value="search" className="space-y-4">
        <SearchUsers currentUserId={currentUserId} />
      </TabsContent>
    </Tabs>
  )
}
