import Link from "next/link"
import { ArrowLeft, Eye, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PublicProfile } from "@/components/public/public-profile"
import type { LinkBlock, User } from "@/lib/types/database"

const demoProfile: User = {
  id: "demo-profile",
  email: "alex@example.com",
  nickname: "alexcarter",
  display_name: "Alex Carter",
  bio: "Independent designer helping thoughtful brands find their signal.",
  avatar_url: null,
  cover_photo: null,
  public_key: null,
  theme_config: {
    background: "#0b1020",
    textColor: "#f8fafc",
    primaryColor: "#8b5cf6",
    borderRadius: "16px",
  },
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
}

const demoLinks: LinkBlock[] = [
  { id: "demo-1", user_id: demoProfile.id, type: "link", title: "Explore my latest work", url: "https://example.com", icon: "✦", visibility: "public", encrypted_blob: null, position: 0, is_active: true, click_count: 128, created_at: demoProfile.created_at, updated_at: demoProfile.updated_at },
  { id: "demo-2", user_id: demoProfile.id, type: "social", title: "Follow along on Instagram", url: "https://instagram.com", icon: "◎", visibility: "public", encrypted_blob: null, position: 1, is_active: true, click_count: 86, created_at: demoProfile.created_at, updated_at: demoProfile.updated_at },
  { id: "demo-3", user_id: demoProfile.id, type: "file", title: "Download my brand guide", url: "https://example.com", icon: "↗", visibility: "public", encrypted_blob: null, position: 2, is_active: true, click_count: 64, created_at: demoProfile.created_at, updated_at: demoProfile.updated_at },
  { id: "demo-4", user_id: demoProfile.id, type: "link", title: "Private newsletter archive", url: "https://example.com", icon: "▣", visibility: "friends", encrypted_blob: null, position: 3, is_active: true, click_count: 41, created_at: demoProfile.created_at, updated_at: demoProfile.updated_at },
]

export default function DemoProfilePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">OL</span>
          OneLink
        </Link>
        <Button asChild variant="outline" size="sm"><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back home</Link></Button>
      </div>

      <section className="border-y border-border bg-muted/20 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2"><Badge><Eye className="mr-1 h-3 w-3" />Live preview</Badge><Badge variant="secondary"><Sparkles className="mr-1 h-3 w-3" />Demo profile</Badge></div>
              <h1 className="text-3xl font-bold tracking-tight">See OneLink from your audience&apos;s point of view.</h1>
              <p className="mt-2 max-w-2xl text-muted-foreground">This is what a finished profile can look like after you add your links, story, and privacy settings.</p>
            </div>
            <Button asChild><Link href="/auth/sign-up">Create your profile</Link></Button>
          </div>

          <div className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] shadow-2xl shadow-primary/10">
            <div className="flex items-center justify-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-slate-400"><Lock className="h-3 w-3" /> Public view with privacy controls built in</div>
            <PublicProfile profile={demoProfile} links={demoLinks} isOwner={false} demo />
          </div>
        </div>
      </section>
    </main>
  )
}
