"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Message } from "@/lib/types/database"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Loader2, ArrowLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

interface Friend {
  connectionId: string
  id: string
  nickname: string
  display_name: string
  avatar_url: string | null
}

interface ChatInterfaceProps {
  currentUserId: string
  friends: Friend[]
}

export function ChatInterface({ currentUserId, friends }: ChatInterfaceProps) {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(friends[0] || null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (!selectedFriend) return

    const loadMessages = async () => {
      setIsLoading(true)
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("connection_id", selectedFriend.connectionId)
        .order("created_at", { ascending: true })

      if (data) {
        setMessages(data)
        await supabase
          .from("messages")
          .update({ read: true })
          .eq("connection_id", selectedFriend.connectionId)
          .eq("receiver_id", currentUserId)
          .eq("read", false)
      }
      setIsLoading(false)
    }

    loadMessages()

    const channel = supabase
      .channel(`messages:${selectedFriend.connectionId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `connection_id=eq.${selectedFriend.connectionId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message])
          if ((payload.new as Message).receiver_id === currentUserId) {
            supabase
              .from("messages")
              .update({ read: true })
              .eq("id", (payload.new as Message).id)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedFriend, currentUserId])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedFriend || isSending) return

    setIsSending(true)
    try {
      const messageContent = newMessage.trim()
      const tempId = `temp-${Date.now()}`

      const optimisticMessage: Message = {
        id: tempId,
        connection_id: selectedFriend.connectionId,
        sender_id: currentUserId,
        receiver_id: selectedFriend.id,
        content: messageContent,
        encrypted: false,
        read: false,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, optimisticMessage])
      setNewMessage("")

      const { data, error } = await supabase
        .from("messages")
        .insert({
          connection_id: selectedFriend.connectionId,
          sender_id: currentUserId,
          receiver_id: selectedFriend.id,
          content: messageContent,
          encrypted: false,
        })
        .select()
        .single()

      if (error) {
        console.error("Failed to send message:", error)
        setMessages((prev) => prev.filter((m) => m.id !== tempId))
        setNewMessage(messageContent)
      } else if (data) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? data : m)))
      }
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setIsSending(false)
    }
  }

  if (friends.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium">No friends yet</p>
          <p className="text-sm text-muted-foreground">Add friends to start chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full gap-4">
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {friends.map((friend) => (
              <button
                key={friend.id}
                onClick={() => setSelectedFriend(friend)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedFriend?.id === friend.id ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <Avatar>
                  <AvatarImage src={friend.avatar_url || undefined} alt={friend.display_name} />
                  <AvatarFallback>{friend.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{friend.display_name}</p>
                  <p className="text-sm text-muted-foreground truncate">@{friend.nickname}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {selectedFriend ? (
        <Card className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedFriend.avatar_url || undefined} alt={selectedFriend.display_name} />
              <AvatarFallback>{selectedFriend.display_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedFriend.display_name}</h3>
              <p className="text-sm text-muted-foreground">@{selectedFriend.nickname}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.sender_id === currentUserId
                  return (
                    <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] space-y-1 ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={scrollRef} />
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={isSending}
              />
              <Button type="submit" size="icon" disabled={isSending || !newMessage.trim()}>
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Select a friend to start chatting</p>
        </Card>
      )}
    </div>
  )
}
