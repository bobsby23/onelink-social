"use client"

import type { LinkBlock } from "@/lib/types/database"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GripVertical, MoreVertical, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { EditLinkDialog } from "@/components/links/edit-link-dialog"

interface LinkCardProps {
  link: LinkBlock
  onDelete: (linkId: string) => void
  onUpdate: (link: LinkBlock) => void
}

export function LinkCard({ link, onDelete, onUpdate }: LinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })
  const [isEditOpen, setIsEditOpen] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleToggleActive = async () => {
    const supabase = createClient()
    const newIsActive = !link.is_active

    const { data, error } = await supabase
      .from("link_blocks")
      .update({ is_active: newIsActive })
      .eq("id", link.id)
      .select()
      .single()

    if (!error && data) {
      onUpdate(data)
    }
  }

  const handleDelete = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("link_blocks").delete().eq("id", link.id)

    if (!error) {
      onDelete(link.id)
    }
  }

  const visibilityColors = {
    public: "default",
    friends: "secondary",
    private: "outline",
  } as const

  return (
    <>
      <Card ref={setNodeRef} style={style} className={link.is_active ? "" : "opacity-50"}>
        <CardContent className="flex items-center gap-4 p-4">
          <button className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium truncate">{link.title}</h3>
              <Badge variant={visibilityColors[link.visibility]} className="text-xs">
                {link.visibility}
              </Badge>
              {!link.is_active && (
                <Badge variant="outline" className="text-xs">
                  Hidden
                </Badge>
              )}
            </div>
            {link.url && (
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                {link.url}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{link.click_count} clicks</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleToggleActive}>
                {link.is_active ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                {link.is_active ? "Hide" : "Show"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <EditLinkDialog link={link} open={isEditOpen} onOpenChange={setIsEditOpen} onUpdate={onUpdate} />
    </>
  )
}
