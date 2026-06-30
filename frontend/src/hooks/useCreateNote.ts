import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createNote } from "@/lib/api/notes"

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ title, content }: { title: string; content: string }) =>
      createNote(title, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notes"] })
      }, 4000)
    },
  })
}