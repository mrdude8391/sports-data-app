import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import DeleteAthleteStat from "./DeleteAthleteStat";
import EditAthleteStat from "./EditAthleteStat";
import { useState } from "react";
import PaginationComponent from "./PaginationComponent";
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface AthleteStatsListProps {
  stats: Stat[];
}

const AthleteStatsList = (props: AthleteStatsListProps) => {
  const { stats } = props;

  // const [page, setPage] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // const firstStatIdx = page * itemsPerPage;
  // const lastStatIdx = firstStatIdx + itemsPerPage;
  // // const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  // const totalPages = Math.ceil(stats.length / itemsPerPage);

  const [columns] = useState<any>([]);

  const table = useReactTable({
    data: stats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const handlePageChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { value } = e.target;
  //   const num = Number(value);
  //   if (!num) return;
  //   if (num > totalPages) {
  //     setPage(totalPages - 1);
  //     return;
  //   }
  //   if (num < 0) {
  //     setPage(1);
  //     return;
  //   }
  //   setPage(num - 1);
  // };

  return (
    <div className="card-container flex flex-col gap-6">
      <h1>List of Games</h1>

      <Accordion type="single" collapsible className="w-full">
        {table.getRowModel().rows.map((row) => {
          const stat = row.original;
          return (
            <AccordionItem key={stat.id} value={`game-${row.id + 1}`}>
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span>
                    Game {Number(row.id) + 1} —{" "}
                    {new Date(stat.recordedAt).toLocaleDateString("en-US")}
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
                      <div className="grid grid-cols-2 gap-1 text-sm  ">
                        {fields.map(({ key, label }) => (
                          <div
                            key={key}
                            className="flex justify-between transition-all ease-out hover:bg-accent rounded-sm px-2 "
                          >
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
                  <DeleteAthleteStat statId={stat.id} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <PaginationComponent table={table}></PaginationComponent>
    </div>
  );
};

export default AthleteStatsList;
