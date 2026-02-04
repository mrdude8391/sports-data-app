"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";

import PaginationComponent from "./PaginationComponent";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  // const [selectedStatCategory, setSelectedStatCategory] = useState([]);
  // const [select, setSelect] = useState("");

  const [columns, setColumns] = useState<any>([]);

  // const [page, setPage] = useState(0);
  // const [itemsPerPage, setItemsPerPage] = useState(10);

  // const firstStatIdx = page * itemsPerPage;
  // const lastStatIdx = firstStatIdx + itemsPerPage;
  // const currentStats = stats.slice(firstStatIdx, lastStatIdx);

  // const totalPages = Math.ceil(stats.length / itemsPerPage);

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

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const table = useReactTable({
    data: stats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id!,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleStatCategorySelectChange = (category: string) => {
    // Get fields of selected stat category
    const fields: any = STAT_INDEX.find((s) => s.category === category)!.fields;
    // setSelectedStatCategory(fields);
    // setSelect(statCategory);

    // Set the columns of the tanstack table
    setColumns(() => {
      const dateCol = {
        accessorKey: "recordedAt",
        header: "Date",
        cell: (info: { getValue: () => string | number | Date }) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-UB");
        },
      };
      const fieldCols = fields.map((field: any) => ({
        accessorKey: category + "." + field.key,
        header: field.label,
      }));
      return [dateCol, ...fieldCols];
    });
    // Perform any other actions with the selected statCategory here
  };
  return (
    <div className="card-container flex flex-col gap-4 py-4">
      <h1>Stats by category</h1>
      <Select onValueChange={handleStatCategorySelectChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {STAT_INDEX.map(({ category }) => (
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {capitalize(category)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComponent table={table}></PaginationComponent>

      {/* <Table className="min-w-full divide-y divide-gray-200 text-sm">
        {select == "" ? (
          <TableCaption>Select a category to display table</TableCaption>
        ) : (
          <TableCaption>Stat table by category</TableCaption>
        )}

        {select !== "" && (
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              {selectedStatCategory.map(({ key, label }) => (
                <TableHead key={key}>{label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        {select !== "" && (
          <TableBody>
            {currentStats?.map((stat) => (
              <TableRow key={stat._id}>
                <TableCell>
                  {stat.recordedAt.toLocaleDateString("en-UB")}
                </TableCell>
                {selectedStatCategory.map(({ key, label }) => (
                  <TableCell key={key}>{(stat as any)[select][key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table> */}

      {/* <Pagination>
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
      </Pagination> */}
    </div>
  );
};

export default AthleteStatTable;
