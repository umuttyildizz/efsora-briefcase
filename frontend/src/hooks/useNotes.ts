import { useQuery } from "@tanstack/react-query"
import { getNotes } from "@/lib/api/notes"

export function useNotes(tag?: string) {
  return useQuery({
    queryKey: ["notes", tag],
    queryFn: () => getNotes(tag),
  })
}