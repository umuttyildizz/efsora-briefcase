import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteNote } from "@/lib/api/notes"

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
    onError: (error: Error) => {
      console.error("Failed to delete note:", error)
    },
  })
}