import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editStat } from "../api/statsApi";

export const useEditStat = (props: { athleteId: string }) => {
  const { athleteId } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editStat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats", athleteId] });
    },
  });
};
