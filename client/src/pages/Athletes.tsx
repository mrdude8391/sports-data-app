import { EllipsisVertical, Loader } from "lucide-react";
import CreateAthlete from "@/features/athletes/components/CreateAthlete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AthleteList from "../features/athletes/components/AthleteList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAthletesPaginated } from "@/features/athletes/api/athletesApi";
import type { GetAthletePageParams } from "@/features/athletes/types/Athlete";

const Athletes = () => {
  const [isEdit, setIsEdit] = useState(false);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["athletes"],
    queryFn: getAthletesPaginated,
    initialPageParam: { cursor: "" } as GetAthletePageParams,
    getNextPageParam: (lastPage, _) => {
      if (lastPage.nextCursor) {
        return {
          cursor: lastPage.nextCursor,
        };
      }
      return undefined;
    },
  });
  if (status === "pending") return <Loader className="animate-spin" />;
  if (status === "error")
    return (
      <p>
        Error Loading Athletes <span>{error.message}</span>
      </p>
    );

  return (
    <div className="flex flex-col gap-6 w-full sm:w-lg items-center">
      <div className="w-full">
        <h1>Athletes</h1>
      </div>
      <div className="card-container w-full flex flex-col gap-6">
        <div className="flex justify-between">
          <CreateAthlete />
          <Button variant="outline" onClick={() => setIsEdit(!isEdit)}>
            <EllipsisVertical />
          </Button>
        </div>

        <AthleteList isEdit={isEdit} pages={data.pages} />

        {/* {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            <AthleteList isEdit={isEdit} athletes={group.athleteList} pages={data.pages} />
          </React.Fragment>
        ))} */}
        <div>
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetching}
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
                ? "Load More"
                : "Nothing more to load"}
          </button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>
    </div>
  );
};

export default Athletes;
