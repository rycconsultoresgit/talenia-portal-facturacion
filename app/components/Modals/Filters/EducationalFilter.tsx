import { useState, useEffect, useRef } from "react";
import { Checkbox } from "@heroui/react";

export type EducationLevel =
  | "secundaria"
  | "tecnico"
  | "universitario"
  | "postgrado";

interface EducationalFilterProps {
  value?: EducationLevel[];
  onChange?: (levels: EducationLevel[]) => void;
}

const educationOptions: { value: EducationLevel; label: string }[] = [
  { value: "universitario", label: "Universitario" },
  { value: "postgrado", label: "Postgrado/Doctorado" },
  { value: "tecnico", label: "Técnico" },
  { value: "secundaria", label: "Enseñanza Media" },
];

export const EducationalFilter = ({
  value: externalValue = [],
  onChange,
}: EducationalFilterProps) => {
  const [selectedLevels, setSelectedLevels] = useState<Set<EducationLevel>>(
    new Set(externalValue),
  );
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  // Sync with external value when it changes
  useEffect(() => {
    setSelectedLevels(new Set(externalValue));
  }, [externalValue]);

  // Update indeterminate state of select all checkbox
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const isIndeterminate =
        selectedLevels.size > 0 &&
        selectedLevels.size < educationOptions.length;
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedLevels]);

  const handleChange = (level: EducationLevel, isSelected: boolean) => {
    const newSelectedLevels = new Set(selectedLevels);

    if (isSelected) {
      newSelectedLevels.add(level);
    } else {
      newSelectedLevels.delete(level);
    }

    setSelectedLevels(newSelectedLevels);
    onChange?.(Array.from(newSelectedLevels));
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allLevels = educationOptions.map((opt) => opt.value);
      setSelectedLevels(new Set(allLevels));
      onChange?.(allLevels);
    } else {
      setSelectedLevels(new Set());
      onChange?.([]);
    }
  };
  return (
    <div className="mt-3 flex w-full flex-col items-end gap-3">
      <Checkbox
        ref={selectAllCheckboxRef}
        color="secondary"
        size="sm"
        radius="sm"
        isSelected={selectedLevels.size === educationOptions.length}
        isIndeterminate={
          selectedLevels.size > 0 &&
          selectedLevels.size < educationOptions.length
        }
        onChange={(e) => handleSelectAll(e.target.checked)}
      >
        Seleccionar todo
      </Checkbox>
      <div className="grid h-fit w-full grid-cols-2 flex-wrap items-center justify-items-start gap-2 overflow-y-scroll rounded-md bg-white/80 p-3 scrollbar-hide">
        {educationOptions.map((option) => (
          <Checkbox
            key={option.value}
            size="sm"
            radius="sm"
            color="secondary"
            isSelected={selectedLevels.has(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </div>
  );
};

export default EducationalFilter;
