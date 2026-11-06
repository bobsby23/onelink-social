"use client"

import type { User, LinkBlock } from "@/lib/types/database"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getIconForLink } from "@/lib/social-icons"

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
        backgroundColor: theme.background || "#ffffff",
        color: theme.textColor || "#000000",
      }
    : {}

  const buttonStyle = hasTheme
    ? {
        backgroundColor: theme.primaryColor || "#000000",
        color: "#ffffff",
        borderRadius: theme.borderRadius || "8px",
      }
    : {}

  const handleLinkClick = async (linkId: string, url: string | null) => {
    if (!url) return

    // Increment click count
    const supabase = createClient()
    await supabase.rpc("increment_link_clicks", { link_id: linkId })

    // Open link
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen" style={containerStyle}>
      {profile.cover_photo && (
        <div className="h-64 w-full bg-gradient-to-r from-blue-500 to-purple-500">
          <img src={profile.cover_photo || "/placeholder.svg"} alt="Cover" className="h-full w-full object-cover" />
        </div>
      )}

      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
              <AvatarFallback className="text-3xl">{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{profile.display_name}</h1>
              <p className="text-sm opacity-80">@{profile.nickname}</p>
              {profile.bio && <p className="text-base opacity-90 max-w-md mx-auto">{profile.bio}</p>}
            </div>

            {isOwner && (
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">Edit Profile</a>
              </Button>
            )}
          </div>

          {/* Links */}
          <div className="space-y-3">
            {links.map((link) => {
              const { icon: LinkIcon, color: iconColor, name: platformName } = getIconForLink(link.url, link.type)

              return (
                <Card
                  key={link.id}
                  className="overflow-hidden cursor-pointer hover:opacity-90 transition-all hover:scale-[1.02] duration-200"
                  style={buttonStyle}
                  onClick={() => handleLinkClick(link.id, link.url)}
                >
                  <div className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/20"
                        style={{ color: hasTheme ? "inherit" : iconColor }}
                      >
                        <LinkIcon className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">{link.title}</span>
                        {platformName !== "Link" && <span className="text-xs opacity-70 truncate">{platformName}</span>}
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0" />
                  </div>
                </Card>
              )
            })}
          </div>

          {links.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No links to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
