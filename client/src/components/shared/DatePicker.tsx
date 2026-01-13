import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

interface DatePickerProps {
  selectedDate: Date;
  changeDate: (newDate: Date) => void;
}

export const DatePicker = (props: DatePickerProps) => {
  const { selectedDate, changeDate } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className="w-48 justify-between font-normal"
        >
          {selectedDate ? selectedDate.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          captionLayout="dropdown"
          onSelect={(date) => {
            changeDate(date!);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
