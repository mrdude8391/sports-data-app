"use client";
import {
  Table,
  TableBody,
  TableCaption,
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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useState, type ChangeEvent } from "react";
import { STAT_INDEX } from "@/constants";
import type { Stat } from "@/types/Stat";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface AthleteStatTableProps {
  stats: Stat[];
}

const AthleteStatTable = (props: AthleteStatTableProps) => {
  const { stats } = props;
  const [selectedStatCategory, setSelectedStatCategory] = useState([]);
  const [select, setSelect] = useState("");

  const [columns, setColumns] = useState<any>([]);

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

  const capitalize = (str: string) => {
    if (str == undefined || str.length === 0) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const table = useReactTable({
    data: stats,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow._id!,
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleValueChange = (value: string) => {
    const selection: any = STAT_INDEX.find((s) => s.category === value)?.fields;
    setSelectedStatCategory(selection);
    setSelect(value);
    setColumns(() => {
      const dateCol = {
        accessorKey: "recordedAt",
        header: "Date",
        cell: (info: { getValue: () => string | number | Date }) => {
          const date = new Date(info.getValue());
          return date.toLocaleDateString("en-UB");
        },
      };
      const data = selection.map((o: any) => ({
        accessorKey: value + "." + o.key,
        header: o.label,
      }));
      return [dateCol, ...data];
    });
    // Perform any other actions with the selected value here
  };
  return (
    <div className="card-container flex flex-col gap-6">
      <Select onValueChange={handleValueChange}>
        <SelectTrigger className="w-full text-2xl font-semibold py-6">
          <SelectValue
            className=""
            placeholder="Select a category to display table"
          />
        </SelectTrigger>
        <SelectContent>
          {STAT_INDEX.map(({ category, fields }) => (
            <SelectGroup key={category}>
              <SelectItem
                key={category}
                value={category}
                className="capitalize"
              >
                {capitalize(category)}
              </SelectItem>
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>

      <div className="overflow-hidden rounded-md border">
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
                            header.getContext()
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
                        cell.getContext()
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Label className="flex items-center gap-1">
          Go to page:
          <Input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </Label>
      </div>

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
    </div>
  );
};

export default AthleteStatTable;
