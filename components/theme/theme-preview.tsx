"use client"

import type { User } from "@/lib/types/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ThemePreviewProps {
  theme: Record<string, any>
  profile: User
}

export function ThemePreview({ theme, profile }: ThemePreviewProps) {
  const hasTheme = theme && Object.keys(theme).length > 0

  const previewStyle = hasTheme
    ? {
        backgroundColor: theme.background || "#ffffff",
        color: theme.textColor || "#000000",
      }
    : {}

  const buttonStyle = hasTheme
    ? {
        backgroundColor: theme.primaryColor || "#000000",
        color: "#ffffff",
      }
    : {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-hidden">
          <div className="p-8 space-y-6" style={previewStyle}>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.display_name} />
                <AvatarFallback className="text-2xl">{profile.display_name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                <p className="text-sm opacity-80">@{profile.nickname}</p>
                {profile.bio && <p className="text-sm opacity-90 max-w-md">{profile.bio}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <Button className="w-full" style={buttonStyle}>
                Example Link 1
              </Button>
              <Button className="w-full" style={buttonStyle}>
                Example Link 2
              </Button>
              <Button className="w-full" style={buttonStyle}>
                Example Link 3
              </Button>
            </div>
          </div>
        </div>

        {!hasTheme && (
          <p className="text-sm text-muted-foreground text-center mt-4">Generate a theme to see it previewed here</p>
        )}
      </CardContent>
    </Card>
  )
}
