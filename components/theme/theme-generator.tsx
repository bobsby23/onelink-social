"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Save } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface ThemeGeneratorProps {
  userId: string
  currentTheme: Record<string, any>
}

export function ThemeGenerator({ userId, currentTheme }: ThemeGeneratorProps) {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [generatedTheme, setGeneratedTheme] = useState<Record<string, any> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a theme description")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate theme")
      }

      const data = await response.json()
      setGeneratedTheme(data.theme)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate theme")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if (!generatedTheme) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch("/api/save-theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, theme: generatedTheme }),
      })

      if (!response.ok) {
        throw new Error("Failed to save theme")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save theme")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Theme Generator</CardTitle>
        <CardDescription>Describe your ideal profile theme and let AI create it for you</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Theme Description</Label>
          <Textarea
            id="prompt"
            placeholder="E.g., 'Modern and minimal with blue accents' or 'Dark theme with neon colors'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            disabled={isGenerating}
          />
          <p className="text-xs text-muted-foreground">Be specific about colors, style, and mood</p>
        </div>

        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Theme
            </>
          )}
        </Button>

        {generatedTheme && (
          <div className="space-y-3 pt-4 border-t">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Generated Theme</h4>
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Primary Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded border" style={{ backgroundColor: generatedTheme.primaryColor }} />
                    <code className="text-xs">{generatedTheme.primaryColor}</code>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded border" style={{ backgroundColor: generatedTheme.background }} />
                    <code className="text-xs">{generatedTheme.background}</code>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Text Color:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded border" style={{ backgroundColor: generatedTheme.textColor }} />
                    <code className="text-xs">{generatedTheme.textColor}</code>
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-transparent" variant="outline">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Apply Theme
                </>
              )}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}
