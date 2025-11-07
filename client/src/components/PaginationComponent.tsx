import React from "react";
import { Button } from "./ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Stat } from "@/types/Stat";
import type { Table } from "@tanstack/react-table";

interface PaginationComponentProps {
  table: Table<Stat>;
}

const PaginationComponent = (props: PaginationComponentProps) => {
  const { table } = props;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
      <div className="flex items-center justify-center gap-4 ">
        <Button
          variant={!table.getCanPreviousPage() ? "ghost" : "outline"}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="w-12 sm:w-24"
        >
          <ChevronLeftIcon />
          <span className="hidden sm:block ">Previous</span>
        </Button>
        <Button
          variant={!table.getCanNextPage() ? "ghost" : "outline"}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="w-12 sm:w-24"
        >
          <span className="hidden sm:block ">Next</span>
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="flex items-center justify-center  gap-2 ">
        <div>
          <Label className="flex items-center gap-1">
            <p>Page</p>
            <Input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              onKeyDown={(e: any) => {
                if (e.key === "Backspace") {
                  if (e.target.value.length === 1) {
                    e.target.value = "";
                  }
                  e.target.value.slice(0, -1);
                }
              }}
              className="border p-1 rounded w-16"
            />
            <strong>of {table.getPageCount().toLocaleString()}</strong>
          </Label>
        </div>

        <div>
          <Select
            onValueChange={(pageSize) => {
              table.setPageSize(Number(pageSize));
            }}
            defaultValue="10"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toLocaleString()}>
                    Show {pageSize}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PaginationComponent;
