"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { useTranslations } from "next-intl"
import { useNotes } from "@/hooks/useNotes"
import { useDeleteNote } from "@/hooks/useDeleteNote"
import { useResummarize } from "@/hooks/useResummarize"
import { NoteCard } from "@/components/notes/NoteCard"
import { TagBadge } from "@/components/ui/TagBadge"
import { Input } from "@/components/ui/Input"

interface NoteListProps {
  activeTag?: string
  onTagClick: (tag: string) => void
  onClearTag: () => void
  isCreateFormOpen: boolean
}

export function NoteList({ activeTag, onTagClick, onClearTag, isCreateFormOpen }: NoteListProps) {
  const [searchValue, setSearchValue] = useState("")
  const t = useTranslations("notes")
  const { data: notes, isLoading, error } = useNotes(activeTag)
  const deleteMutation = useDeleteNote()
  const resummarizeMutation = useResummarize()

  useEffect(() => {
    setSearchValue(activeTag ?? "")
  }, [activeTag])

  function handleSearchKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && searchValue.trim()) {
      onTagClick(searchValue.trim())
    }
  }

  if (isLoading) {
    return <p style={{ color: "#6b7280", fontSize: 14 }}>{t("loading")}</p>
  }

  if (error) {
    return <p style={{ color: "#dc2626", fontSize: 14 }}>{t("error")}</p>
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {!isCreateFormOpen && (
        <Input
          placeholder={t("searchPlaceholder")}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      )}
      {deleteMutation.isError && (
        <p style={{ margin: 0, fontSize: 14, color: "#dc2626" }}>{t("deleteFailed")}</p>
      )}

      {activeTag && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, color: "#6b7280" }}>{t("filteredBy")}</span>
          <TagBadge tag={activeTag} active />
          <button
            onClick={onClearTag}
            style={{
              background: "none",
              border: "none",
              fontSize: 13,
              color: "#2563eb",
              cursor: "pointer",
              padding: 0,
            }}
          >
            {t("clearFilter")}
          </button>
        </div>
      )}

      {notes?.length === 0 && (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>
          {t("empty")}
        </p>
      )}

      {notes?.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          activeTag={activeTag}
          onTagClick={onTagClick}
          onDelete={(id) => deleteMutation.mutate(id)}
          onResummarize={(id) => resummarizeMutation.mutate(id)}
          isDeleting={deleteMutation.isPending && deleteMutation.variables === note.id}
          isResummarizing={resummarizeMutation.isPending && resummarizeMutation.variables === note.id}
        />
      ))}
    </div>
  )
}
