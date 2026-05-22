import { api } from "@/lib/api";
import {
  mutationOptions,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
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

// in this way if we want to pass in any special options we can do it with the hook.
// the options need to be typed though and it normally infers it from the mutationFn
// a simple solution we can do is just manually plug in the types
// UseMutationOptions<Athlete, Error, NewAthlete>
// but we want to do this programatically so we made a MutationConfig Type that takes the ApiMethod and does this for us.
// so the mutationConfig object is the correct UseMutationOptions object type.
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
