"use client"

import type { User, LinkBlock } from "@/lib/types/database"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Lock, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface PublicProfileProps {
  profile: User
  links: LinkBlock[]
  isOwner: boolean
}

export function PublicProfile({ profile, links, isOwner }: PublicProfileProps) {
  const theme = profile.theme_config || {}
  const hasTheme = Object.keys(theme).length > 0

  const containerStyle = hasTheme
    ? {
        backgroundColor: theme.background || undefined,
        color: theme.textColor || undefined,
      }
    : {}

  const buttonStyle = hasTheme
    ? {
        backgroundColor: theme.primaryColor || undefined,
        color: "#ffffff",
        borderRadius: theme.borderRadius || "12px",
      }
    : {}

  const handleLinkClick = async (linkId: string, url: string | null) => {
    if (!url) return

    // Increment click count
    const supabase = createClient()
    await supabase.rpc("increment_link_clicks", { link_id: linkId })

    // Open link
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const getVisibilityBadge = (visibility: string) => {
    if (visibility === "private") {
      return (
        <Badge variant="secondary" className="gap-1">
          <Lock className="h-3 w-3" />
          Private
        </Badge>
      )
    }
    if (visibility === "friends") {
      return (
        <Badge variant="secondary" className="gap-1">
          <Users className="h-3 w-3" />
          Friends Only
        </Badge>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background" style={containerStyle}>
      {profile.cover_photo && (
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
          <img src={profile.cover_photo || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
        </div>
      )}

      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
              <AvatarFallback className="text-3xl font-bold">
                {profile.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-balance text-4xl font-bold tracking-tight">{profile.display_name}</h1>
              <p className="text-sm text-muted-foreground">@{profile.nickname}</p>
              {profile.bio && <p className="mx-auto max-w-md text-pretty text-base leading-relaxed">{profile.bio}</p>}
            </div>

            {isOwner && (
              <Button variant="outline" asChild>
                <a href="/dashboard">Edit Profile</a>
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {links.map((link) => {
              const customStyle = hasTheme ? buttonStyle : {}

              return (
                <Card
                  key={link.id}
                  className="group cursor-pointer overflow-hidden border-2 transition-all hover:scale-[1.02] hover:shadow-md"
                  style={customStyle}
                  onClick={() => handleLinkClick(link.id, link.url)}
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex flex-1 items-center gap-3">
                      {link.icon && (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background/10">
                          <span className="text-xl">{link.icon}</span>
                        </div>
                      )}
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-semibold">{link.title}</span>
                        {isOwner && getVisibilityBadge(link.visibility)}
                      </div>
                    </div>
                    <ExternalLink className="h-5 w-5 opacity-60 transition-opacity group-hover:opacity-100" />
                  </div>
                </Card>
              )
            })}
          </div>

          {links.length === 0 && (
            <Card className="border-2 border-dashed">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-4">
                  <ExternalLink className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No links yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isOwner ? "Add your first link to get started" : "This profile has no links to display"}
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
