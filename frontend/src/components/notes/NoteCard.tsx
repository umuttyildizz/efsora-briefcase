"use client"

import { useTranslations } from "next-intl"
import { Note } from "@/types"
import { TagBadge } from "@/components/ui/TagBadge"
import { Button } from "@/components/ui/Button"

interface NoteCardProps {
  note: Note
  activeTag?: string
  onTagClick: (tag: string) => void
  onDelete: (id: string) => void
  onResummarize: (id: string) => void
  isDeleting: boolean
  isResummarizing: boolean
}

export function NoteCard({
  note,
  activeTag,
  onTagClick,
  onDelete,
  onResummarize,
  isDeleting,
  isResummarizing,
}: NoteCardProps) {
  const t = useTranslations("notes")

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 20,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {note.title && (
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>
          {note.title}
        </h3>
      )}

      <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
        {note.content.length > 200 ? `${note.content.slice(0, 200)}...` : note.content}
      </p>

      {note.summary ? (
        <div
          style={{
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 6,
            padding: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            <strong>{t("summary")}</strong> {note.summary}
          </p>
        </div>
      ) : (
        <p style={{ margin: 0, fontSize: 13, color: "#9ca3af", fontStyle: "italic" }}>
          {t("generatingSummary")}
        </p>
      )}

      {note.tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {note.tags.map((tag) => (
            <TagBadge
              key={tag}
              tag={tag}
              active={activeTag === tag}
              onClick={() => onTagClick(tag)}
            />
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {new Date(note.created_at).toLocaleString()}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="secondary"
            onClick={() => onResummarize(note.id)}
            loading={isResummarizing}
            style={{ minWidth: 110 }}
          >
            {t("resummarize")}
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(note.id)}
            loading={isDeleting}
            style={{ minWidth: 110 }}
          >
            {t("delete")}
          </Button>
        </div>
      </div>
    </div>
  )
}
