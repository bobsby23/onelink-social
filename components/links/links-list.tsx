"use client"

import type { LinkBlock } from "@/lib/types/database"
import { LinkCard } from "@/components/links/link-card"
import { useState } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { createClient } from "@/lib/supabase/client"

interface LinksListProps {
  initialLinks: LinkBlock[]
  userId: string
}

export function LinksList({ initialLinks, userId }: LinksListProps) {
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id)
      const newIndex = links.findIndex((link) => link.id === over.id)

      const newLinks = arrayMove(links, oldIndex, newIndex)
      setLinks(newLinks)

      // Update positions in database
      const supabase = createClient()
      const updates = newLinks.map((link, index) => ({
        id: link.id,
        position: index,
      }))

      for (const update of updates) {
        await supabase.from("link_blocks").update({ position: update.position }).eq("id", update.id)
      }
    }
  }

  const handleDelete = async (linkId: string) => {
    setLinks(links.filter((link) => link.id !== linkId))
  }

  const handleUpdate = (updatedLink: LinkBlock) => {
    setLinks(links.map((link) => (link.id === updatedLink.id ? updatedLink : link)))
  }

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <p className="text-lg font-medium">No links yet</p>
        <p className="text-sm text-muted-foreground">Create your first link block to get started</p>
      </div>
    )
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} onDelete={handleDelete} onUpdate={handleUpdate} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
