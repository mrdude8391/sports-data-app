import { useInfiniteQuery } from "@tanstack/react-query";
import { getAthletesPaginated } from "../api/athletesApi";
import type { GetAthletePageParams } from "../types/Athlete";

export const useAthletes = () => {
  return useInfiniteQuery({
    queryKey: ["athletes"],
    queryFn: getAthletesPaginated,
    initialPageParam: { cursor: null, limit: 5 } as GetAthletePageParams,
    getNextPageParam: (lastPage, _) => {
      if (lastPage.nextCursor) {
        return {
          cursor: lastPage.nextCursor,
          limit: 5,
        };
      }
      return undefined;
    },
  });
};
