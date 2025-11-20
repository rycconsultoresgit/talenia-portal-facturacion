"use client";

import { Input } from "@heroui/react";
import { useState, useEffect } from "react";

interface SalaryFilterProps {
  minSalary?: number;
  maxSalary?: number;
  onMinSalaryChange: (value: number) => void;
  onMaxSalaryChange: (value: number) => void;
}

export const SalaryFilter = ({
  minSalary,
  maxSalary,
  onMinSalaryChange,
  onMaxSalaryChange,
}: SalaryFilterProps) => {
  const [localMin, setLocalMin] = useState<string>("");
  const [localMax, setLocalMax] = useState<string>("");

  // Only update from props if they have explicit values
  useEffect(() => {
    if (minSalary !== undefined) {
      setLocalMin(minSalary.toString());
    }
  }, [minSalary]);

  useEffect(() => {
    if (maxSalary !== undefined) {
      setLocalMax(maxSalary.toString());
    }
  }, [maxSalary]);

  const handleMinChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    setLocalMin(cleanValue);

    const numValue = cleanValue ? parseInt(cleanValue) : undefined;
    onMinSalaryChange(numValue);
  };

  const handleMaxChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    setLocalMax(cleanValue);

    const numValue = cleanValue ? parseInt(cleanValue) : undefined;
    onMaxSalaryChange(numValue);
  };

  // Check if current values are valid
  const isMinValid =
    minSalary === undefined ||
    maxSalary === undefined ||
    minSalary <= maxSalary;
  const isMaxValid =
    minSalary === undefined ||
    maxSalary === undefined ||
    maxSalary >= minSalary;

  // Apply visual feedback for invalid states
  const minInputClass = !isMinValid ? "border-danger" : "";
  const maxInputClass = !isMaxValid ? "border-danger" : "";
  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex w-full items-center justify-center gap-4">
        <Input
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">$</span>
            </div>
          }
          label="Mínimo"
          labelPlacement="outside"
          placeholder="0"
          size="md"
          type="number"
          value={localMin}
          onChange={(e) => handleMinChange(e.target.value)}
          variant="bordered"
          isInvalid={!isMinValid}
          errorMessage={
            !isMinValid ? "El mínimo no puede ser mayor al máximo" : undefined
          }
          classNames={{
            label: "text-xs",
            inputWrapper: `rounded-md bg-white ${minInputClass}`,
            input: "text-sm py-0",
          }}
        />
        <span className="mt-6 text-sm font-normal text-lightGray">-</span>
        <Input
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-default-400">$</span>
            </div>
          }
          label="Máximo"
          labelPlacement="outside"
          placeholder="0"
          size="md"
          min={1}
          type="number"
          value={localMax}
          onChange={(e) => handleMaxChange(e.target.value)}
          variant="bordered"
          isInvalid={!isMaxValid}
          errorMessage={
            !isMaxValid ? "El máximo no puede ser menor al mínimo" : undefined
          }
          classNames={{
            label: "text-xs",
            inputWrapper: `rounded-md bg-white ${maxInputClass}`,
            input: "text-sm py-0",
          }}
        />
      </div>

      <p className="text-sm font-normal text-lightGray">
        Corresponde al salario declarado por el candidato en su currículum
      </p>
    </div>
  );
};

export default SalaryFilter;
