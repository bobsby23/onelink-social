"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profileUrl: string
  displayName: string
}

export function QRCodeDialog({ open, onOpenChange, profileUrl, displayName }: QRCodeDialogProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (open && canvasRef.current) {
      generateQRCode()
    }
  }, [open, profileUrl])

  const generateQRCode = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    try {
      await QRCode.toCanvas(canvasRef.current, profileUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      })
    } catch (error) {
      console.error("Failed to generate QR code:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const url = canvasRef.current.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `${displayName}-qr-code.png`
    link.href = url
    link.click()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile QR Code</DialogTitle>
          <DialogDescription>Share your OneLink profile with a QR code</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div className="rounded-lg border bg-white p-4">
            <canvas ref={canvasRef} />
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground break-all">{profileUrl}</p>
          </div>

          <Button onClick={handleDownload} className="w-full" disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
