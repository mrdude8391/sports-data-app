import { api } from "@/lib/api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
// import type { MutationConfig } from "@/lib/react-query";

export const deleteAthlete = async (id: string) => {
  // console.log("Delete athlete", {id})
  await api.delete(`/athlete/${id}`);
};

export const useDeleteAthlete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAthlete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
    },
  });
};

/// Fancy stuff below that I don't need

// type UseDeleteAthleteOptions = {
//   mutationConfig?: MutationConfig<typeof deleteAthlete>;
// };

// export const useDeleteAthlete = ({
//   mutationConfig,
// }: UseDeleteAthleteOptions = {}) => {
//   const queryClient = useQueryClient();
//   const { onSuccess, ...restConfig } = mutationConfig || {};
//   return useMutation({
//     mutationFn: deleteAthlete,
//     onSuccess: (...args) => {
//       queryClient.invalidateQueries({ queryKey: ["athletes"] });
//       onSuccess?.(...args);
//     },
//     ...restConfig,
//   });
// };
