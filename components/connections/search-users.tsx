"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface SearchUsersProps {
  currentUserId: string
}

export function SearchUsers({ currentUserId }: SearchUsersProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    const supabase = createClient()

    // Search by nickname or display name
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", currentUserId)
      .or(`nickname.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
      .limit(10)

    if (!error && data) {
      // Check connection status for each user
      const usersWithStatus = await Promise.all(
        data.map(async (user) => {
          const { data: connection } = await supabase
            .from("connections")
            .select("status")
            .or(
              `and(requester_id.eq.${currentUserId},receiver_id.eq.${user.id}),and(requester_id.eq.${user.id},receiver_id.eq.${currentUserId})`,
            )
            .single()

          return {
            ...user,
            connectionStatus: connection?.status || null,
          }
        }),
      )

      setResults(usersWithStatus)
    }
    setIsSearching(false)
  }

  const handleConnect = async (userId: string) => {
    setLoadingUserId(userId)
    const supabase = createClient()

    const { error } = await supabase.from("connections").insert({
      requester_id: currentUserId,
      receiver_id: userId,
      status: "pending",
    })

    if (!error) {
      // Update the local state
      setResults(results.map((user) => (user.id === userId ? { ...user, connectionStatus: "pending" } : user)))
      router.refresh()
    }
    setLoadingUserId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by nickname or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url || undefined} alt={user.display_name} />
                  <AvatarFallback>{user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{user.display_name}</h3>
                  <p className="text-sm text-muted-foreground">@{user.nickname}</p>
                  {user.bio && <p className="text-sm text-muted-foreground truncate mt-1">{user.bio}</p>}
                </div>

                <div>
                  {user.connectionStatus === "accepted" && (
                    <Badge variant="secondary">
                      <Check className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  )}
                  {user.connectionStatus === "pending" && <Badge variant="outline">Request Sent</Badge>}
                  {!user.connectionStatus && (
                    <Button size="sm" onClick={() => handleConnect(user.id)} disabled={loadingUserId === user.id}>
                      <UserPlus className="mr-1 h-4 w-4" />
                      {loadingUserId === user.id ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {results.length === 0 && searchQuery && !isSearching && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm text-muted-foreground">Try searching with a different nickname or name</p>
        </div>
      )}
    </div>
  )
}
