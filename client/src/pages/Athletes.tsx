import { EllipsisVertical, Loader } from "lucide-react";
import CreateAthlete from "@/features/athletes/components/CreateAthlete";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AthleteList from "../features/athletes/components/AthleteList";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAthletes } from "@/features/athletes/api/athletesApi";
import React from "react";

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
    queryFn: getAthletes,
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
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

        {data.pages.map((group, i) => (
          <React.Fragment key={i}>
            <AthleteList isEdit={isEdit} athletes={group.athleteList} />
          </React.Fragment>
        ))}
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
