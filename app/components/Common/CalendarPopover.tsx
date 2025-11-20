import {
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  DateValue,
} from "@heroui/react";
import { BsCalendar2Week } from "react-icons/bs";

interface CalendarPopoverProps {
  selectedDate: DateValue | null;
  onDateChange: (date: DateValue | null) => void;
}

const CalendarPopover = ({
  selectedDate,
  onDateChange,
}: CalendarPopoverProps) => {
  return (
    <Popover
      disableAnimation={true}
      placement="bottom-end"
      showArrow
      offset={8}
    >
      <PopoverTrigger>
        <div
          className={`relative flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-md bg-purple transition-opacity hover:opacity-90`}
        >
          <BsCalendar2Week className="h-5 w-5 text-white" />
          {selectedDate && (
            <div
              className="absolute -right-1 -top-1 h-2 w-2 cursor-pointer rounded-full bg-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onDateChange(null);
              }}
            ></div>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          value={selectedDate}
          onChange={onDateChange}
          firstDayOfWeek="mon"
          aria-label="Seleccionar fecha"
          classNames={{
            cell: "data-[hovered=true]:bg-primaryBlue data-[hovered=true]:text-white",
            cellButton:
              "text-sm data-[selected=true]:bg-purple rounded-md data-[hovered=true]:bg-red-400 data-[hovered=true]:text-white text-drawerDarkPurple data-[disabled=true]:text-customPurple",
            header: "text-primaryBlue",
            gridHeaderRow:
              "text-primaryBlue py-1 font-medium text-base bg-white/50",
            gridBody: "bg-white",
            nextButton: "text-drawerDarkPurple",
            prevButton: "text-drawerDarkPurple",
            title:
              "text-purple text-base whitespace-nowrap font-medium capitalize",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarPopover;
