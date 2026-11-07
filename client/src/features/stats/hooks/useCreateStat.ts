import { logger } from "@/lib/logger";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStat } from "../api/statsApi";
import { type Stat } from "../types/Stat";

export const useCreateStat = (props: {
  athleteId: string;
  resetForm: () => void;
}) => {
  const { athleteId, resetForm } = props;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStat,
    onSuccess: (stat: Stat) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["stats", athleteId] });
      resetForm();
      logger.info(
        "[useCreateStat.ts::onSuccess]\nSuccessfully created new stat.",
        { stat },
      );
    },
  });
};
