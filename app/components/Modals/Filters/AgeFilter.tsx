"use client";

import { Slider } from "@heroui/react";

interface AgeFilterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
}

export const AgeFilter = ({
  value,
  onChange,
  min = 0,
  step = 1,
}: AgeFilterProps) => {
  return (
    <div className="flex w-full flex-col justify-center gap-5 rounded-md bg-white/80 p-3">
      <Slider
        aria-label="Edad"
        showTooltip={true}
        size="sm"
        minValue={min}
        radius="full"
        maxValue={99}
        step={step}
        marks={[
          { value: min, label: min.toString() },
          { value: 99, label: "99" },
        ]}
        value={value}
        onChange={onChange}
        renderThumb={(props) => (
          <div
            {...props}
            className="group top-1/2 cursor-grab rounded-full data-[dragging=true]:cursor-grabbing"
          >
            <span className="block h-5 w-5 rounded-full bg-primaryBlue shadow-small transition-transform group-data-[dragging=true]:scale-125" />
          </div>
        )}
        classNames={{
          track: "bg-lightPurple",
          filler: "bg-primaryBlue",
        }}
        tooltipProps={{
          offset: 10,
          placement: "top",
          classNames: {
            base: [
              // arrow color
              "before:bg-taleniaBlue",
            ],
            content: ["py-2 shadow-xl", "text-white bg-taleniaBlue"],
          },
        }}
      />

      <p className="text-sm font-normal text-lightGray">
        Corresponde a la edad declarada por el candidato en su currículum
      </p>
    </div>
  );
};

export default AgeFilter;
