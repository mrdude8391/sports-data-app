import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type {
  BaseStatData,
  NewStat,
  StatCategory,
  StatFieldKey,
} from "../types/Stat";
import { STAT_LABEL_INDEX } from "@/constants";

const StatForm = (props: {
  form: NewStat;
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: <C extends keyof BaseStatData, K extends StatFieldKey<C>>(
    category: C,
    key: K,
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleChangeDate: (date: Date | undefined) => void;
}) => {
  const { form, handleSubmit, handleChange, handleChangeDate } = props;

  const categories = Object.keys(STAT_LABEL_INDEX) as StatCategory[];
  return (
    <form id="statForm" className="overflow-y-auto " onSubmit={handleSubmit}>
      {/* Stat Area */}
      <div className="space-y-4 p-4">
        {/* Date Picker */}
        <div className=" flex flex-col gap-3">
          <Label htmlFor="date" className="px-1">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-48 justify-between font-normal"
              >
                {form.recordedAt
                  ? form.recordedAt.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={form.recordedAt}
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleChangeDate(date);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Stat Categories */}
        {categories.map((category) => (
          <fieldset key={category} className="border p-4 rounded-md ">
            <legend className="font-bold capitalize">{category}</legend>

            <div className="grid grid-cols-2 gap-4 mt-2">
              {STAT_LABEL_INDEX[category].map(({ key, label }) => (
                <Label key={key} className="flex flex-col">
                  <span className="text-sm">{label}</span>
                  <Input
                    type="number"
                    value={form[category][key as StatFieldKey<typeof category>]}
                    onChange={handleChange(
                      category,
                      key as StatFieldKey<typeof category>,
                    )}
                    className="border rounded p-2"
                  />
                </Label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </form>
  );
};

export default StatForm;
