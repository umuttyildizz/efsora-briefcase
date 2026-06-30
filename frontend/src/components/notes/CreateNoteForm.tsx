"use client"

import { useState, FormEvent } from "react"
import { useTranslations } from "next-intl"
import { useCreateNote } from "@/hooks/useCreateNote"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

interface CreateNoteFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateNoteForm({ open, onOpenChange }: CreateNoteFormProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const t = useTranslations("notes")

  const { mutate, isPending, error } = useCreateNote()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutate(
      { title, content },
      {
        onSuccess: () => {
          setTitle("")
          setContent("")
          onOpenChange(false)
        },
      }
    )
  }

  if (!open) {
    return (
      <Button onClick={() => onOpenChange(true)}>
        + {t("newNote")}
      </Button>
    )
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: 20,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#111827" }}>
        {t("newNote")}
      </h2>

      {error && (
        <p style={{ margin: 0, fontSize: 14, color: "#dc2626" }}>
          {error.message === "content exceeds maximum length" ? t("contentTooLong") : error.message}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <Input
          label={t("title")}
          placeholder={t("titlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>
            {t("content")}
          </label>
          <textarea
            placeholder={t("contentPlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            maxLength={20000}
            rows={6}
            style={{
              padding: "8px 12px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              fontSize: 14,
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box",
              width: "100%",
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="submit" loading={isPending} style={{ minWidth: 110 }}>
            {t("save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            style={{ minWidth: 110 }}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </div>
  )
}
