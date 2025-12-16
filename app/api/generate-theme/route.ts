import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // For now, generate a simple theme based on keywords
    // In production, this would use Google Gemini API
    const theme = generateThemeFromPrompt(prompt)

    return NextResponse.json({ theme })
  } catch (error) {
    console.error("Error generating theme:", error)
    return NextResponse.json({ error: "Failed to generate theme" }, { status: 500 })
  }
}

function generateThemeFromPrompt(prompt: string): Record<string, any> {
  const lowerPrompt = prompt.toLowerCase()

  // Simple keyword-based theme generation
  // In production, this would use AI to generate themes
  let primaryColor = "#3b82f6" // Default blue
  let background = "#ffffff"
  let textColor = "#000000"

  // Color detection
  if (lowerPrompt.includes("blue")) primaryColor = "#3b82f6"
  if (lowerPrompt.includes("purple") || lowerPrompt.includes("violet")) primaryColor = "#9333ea"
  if (lowerPrompt.includes("green")) primaryColor = "#22c55e"
  if (lowerPrompt.includes("red")) primaryColor = "#ef4444"
  if (lowerPrompt.includes("orange")) primaryColor = "#f97316"
  if (lowerPrompt.includes("pink")) primaryColor = "#ec4899"
  if (lowerPrompt.includes("yellow")) primaryColor = "#eab308"
  if (lowerPrompt.includes("teal") || lowerPrompt.includes("cyan")) primaryColor = "#14b8a6"

  // Theme detection
  if (lowerPrompt.includes("dark")) {
    background = "#0a0a0a"
    textColor = "#ffffff"
  }

  if (lowerPrompt.includes("light")) {
    background = "#ffffff"
    textColor = "#000000"
  }

  if (lowerPrompt.includes("neon")) {
    background = "#000000"
    textColor = "#ffffff"
    if (!lowerPrompt.includes("blue") && !lowerPrompt.includes("green") && !lowerPrompt.includes("pink")) {
      primaryColor = "#00ff00" // Neon green
    }
  }

  return {
    primaryColor,
    background,
    textColor,
    fontFamily: lowerPrompt.includes("modern") ? "Inter, sans-serif" : "system-ui, sans-serif",
    borderRadius: lowerPrompt.includes("rounded") ? "12px" : "8px",
  }
}
