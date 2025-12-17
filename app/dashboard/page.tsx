import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { ProfileCard } from "@/components/dashboard/profile-card"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link2, Users, Palette, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Fetch recent links
  const { data: recentLinks } = await supabase
    .from("link_blocks")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <DashboardShell user={profile}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome back, {profile.display_name.split(" ")[0]}!</h1>
          <p className="mt-2 text-muted-foreground">Here's an overview of your OneLink profile</p>
        </div>

        {/* Stats */}
        <QuickStats userId={user.id} />

        {/* Profile Card */}
        <ProfileCard profile={profile} />

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-2 transition-all hover:border-primary">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Link2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Manage Links</CardTitle>
              <CardDescription>Add, edit, or reorder your link blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/dashboard/links">
                  Go to Links
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Connections</CardTitle>
              <CardDescription>Connect with friends and share exclusive content</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/dashboard/connections">
                  View Connections
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Customize Theme</CardTitle>
              <CardDescription>Create AI-powered themes for your profile</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between" asChild>
                <Link href="/dashboard/theme">
                  Customize Theme
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Links */}
        {recentLinks && recentLinks.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Links</CardTitle>
                  <CardDescription>Your most recently added links</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/links">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.click_count} clicks</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/links">Edit</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  )
}
