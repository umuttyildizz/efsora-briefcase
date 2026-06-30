"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { CreateNoteForm } from "@/components/notes/CreateNoteForm"
import { NoteList } from "@/components/notes/NoteList"

export default function HomePage() {
  const router = useRouter()
  const [activeTag, setActiveTag] = useState<string | undefined>()
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login")
    }
  }, [router])

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 48px" }}>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <CreateNoteForm open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen} />
        <NoteList
          activeTag={activeTag}
          onTagClick={(tag) => setActiveTag(tag)}
          onClearTag={() => setActiveTag(undefined)}
          isCreateFormOpen={isCreateFormOpen}
        />
      </div>
    </div>
  )
}
