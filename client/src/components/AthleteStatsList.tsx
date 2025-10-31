import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import DeleteAthleteStat from "./DeleteAthleteStat";
import EditAthleteStat from "./EditAthleteStat";
import { useState } from "react";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  const [page, setPage] = useState(0);
  const [count, setCount] = useState(10);

  const firstStatIdx = page * count;
  const lastStatIdx = firstStatIdx + count;
  const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  return (
    <div className="card-container flex flex-col gap-6">
      <h3>List of Games</h3>
      <Accordion type="single" collapsible className="w-full">
        {currentStats.map((stat, index) => (
          <AccordionItem key={stat._id} value={`game-${index + firstStatIdx}`}>
            <AccordionTrigger>
              <div className="flex justify-between w-full">
                <span>
                  Game {index + 1 + firstStatIdx} —{" "}
                  {new Date(stat.recordedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2 "></div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-2">
                {STAT_INDEX.map(({ category, fields }) => (
                  <div key={category}>
                    <h4 className="font-semibold capitalize mb-1">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      {fields.map(({ key, label }) => (
                        <div key={key} className="flex justify-between">
                          <span>{label}</span>
                          <span>{(stat as any)[category][key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end pt-3 gap-3">
                <EditAthleteStat stat={stat} />
                <DeleteAthleteStat statId={stat._id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={
                page === 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer"
              }
              onClick={() =>
                setPage((prev) => {
                  if (prev > 0) {
                    return prev - 1;
                  }
                  return 0;
                })
              }
            />
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx < stats.length}>
            <PaginationLink>{page - 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page === 0}>
            <PaginationLink>{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={true}>{page + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={lastStatIdx > stats.length}>
            <PaginationLink>{page + 2}</PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page !== 0}>
            <PaginationLink>{page + 3}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={
                lastStatIdx > stats.length
                  ? "cursor-not-allowed opacity-20"
                  : "cursor-pointer"
              }
              onClick={() =>
                setPage((prev) => {
                  if (lastStatIdx < stats.length) return prev + 1;
                  return prev;
                })
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default AthleteStatsList;
