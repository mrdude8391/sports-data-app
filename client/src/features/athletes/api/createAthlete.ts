import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewAthlete, Athlete } from "../types/Athlete";
import type { MutationConfig } from "@/lib/react-query";

export const createAthlete = async (athlete: NewAthlete): Promise<Athlete> => {
  // console.log("Create athlete", athlete)
  const response = await api.post<Athlete>("/athlete/create", athlete);
  return response.data;
};

type UseCreateAthleteOptions = {
  mutationConfig?: MutationConfig<typeof createAthlete>;
};

export const useCreateAthlete = ({
  mutationConfig,
}: UseCreateAthleteOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    mutationFn: createAthlete,
    onSuccess: (...args) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      onSuccess?.(...args);
    },
    ...restConfig,
  });
};
