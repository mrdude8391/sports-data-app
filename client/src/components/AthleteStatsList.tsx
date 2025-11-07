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
import { useState, type ChangeEvent } from "react";
import { Input } from "./ui/input";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const firstStatIdx = page * itemsPerPage;
  const lastStatIdx = firstStatIdx + itemsPerPage;
  const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  const totalPages = Math.ceil(stats.length / itemsPerPage);

  const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const num = Number(value);
    if (!num) return;
    if (num > totalPages) {
      setPage(totalPages - 1);
      return;
    }
    if (num < 0) {
      setPage(1);
      return;
    }
    setPage(num - 1);
  };

  return (
    <div className="card-container flex flex-col gap-6">
      <h1>List of Games</h1>
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
          <PaginationItem hidden={page < 2}>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem
            hidden={firstStatIdx < stats.length || page !== totalPages - 1}
          >
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev - 2)}
            >
              {page - 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page === 0}>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev - 1)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive={true}>
              <Input
                type="tel"
                inputMode="numeric"
                placeholder={`${page + 1}`}
                onChange={handlePageChange}
                value={page + 1}
                onClick={(e: any) => (e.target.value = "")}
                onKeyDown={(e: any) => {
                  if (e.key === "Backspace") {
                    e.target.value = "";
                  }
                }}
              ></Input>
            </PaginationLink>
          </PaginationItem>
          <PaginationItem
            hidden={firstStatIdx + 1 * itemsPerPage > stats.length}
          >
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev + 1)}
            >
              {page + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem
            hidden={
              page !== 0 || firstStatIdx + 2 * itemsPerPage > stats.length
            }
          >
            <PaginationLink
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev + 2)}
            >
              {page + 3}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem hidden={page > totalPages - 3}>
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
