import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStat } from "../api/statsApi";

export const useDeleteStat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};
