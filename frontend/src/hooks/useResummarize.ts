import { useMutation, useQueryClient } from "@tanstack/react-query"
import { resummarize } from "@/lib/api/notes"

export function useResummarize() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => resummarize(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
    },
  })
}