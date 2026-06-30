import { request } from "./client"
import { Note } from "@/types"

export function getNotes(tag?: string): Promise<Note[]> {
  return request<Note[]>(`/notes${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`)
}

export function createNote(title: string, content: string): Promise<Note> {
  return request<Note>("/notes", {
    method: "POST",
    body: JSON.stringify({ title, content }),
  })
}

export function deleteNote(id: string): Promise<void> {
  return request<void>(`/notes/${id}`, { method: "DELETE" })
}

export function resummarize(id: string): Promise<Note> {
  return request<Note>(`/notes/${id}/summarize`, { method: "POST" })
}