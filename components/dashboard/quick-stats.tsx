"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Link2, Eye, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface QuickStatsProps {
  userId: string
}

export function QuickStats({ userId }: QuickStatsProps) {
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalViews: 0,
    totalConnections: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      // Get total links
      const { count: linksCount } = await supabase
        .from("link_blocks")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true)

      // Get total clicks
      const { data: clicksData } = await supabase.from("link_blocks").select("click_count").eq("user_id", userId)

      const totalClicks = clicksData?.reduce((sum, link) => sum + (link.click_count || 0), 0) || 0

      // Get total connections
      const { count: connectionsCount } = await supabase
        .from("connections")
        .select("*", { count: "exact", head: true })
        .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq("status", "accepted")

      setStats({
        totalLinks: linksCount || 0,
        totalViews: totalClicks,
        totalConnections: connectionsCount || 0,
      })
    }

    fetchStats()
  }, [userId])

  const statItems = [
    {
      label: "Active Links",
      value: stats.totalLinks,
      icon: Link2,
    },
    {
      label: "Total Clicks",
      value: stats.totalViews,
      icon: Eye,
    },
    {
      label: "Connections",
      value: stats.totalConnections,
      icon: Users,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {statItems.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
