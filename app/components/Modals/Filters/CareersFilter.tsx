import { useState, useEffect } from "react";
import { Checkbox, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { careersService } from "@/app/api/careersService";

export interface Career {
  id: string;
  name: string;
  projectId: string;
}

interface CareerFilterProps {
  value?: string[];
  onChange?: (careerNames: string[]) => void;
  projectId: string;
}

export const CareerFilter = ({
  value: externalValue = [],
  onChange,
  projectId,
}: CareerFilterProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
  const [selectedCareers, setSelectedCareers] = useState<Set<string>>(
    new Set(externalValue || []),
  );

  // Cargar carreras disponibles
  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await careersService.getCareers(projectId);
        setAvailableCareers(response);
      } catch (error) {
        console.error("Error fetching careers:", error);
        toast.error("Error al cargar carreras del requerimiento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCareers();
  }, [projectId]);

  // Sincronizar con el valor externo cuando cambia
  useEffect(() => {
    setSelectedCareers(new Set(externalValue));
  }, [externalValue]);

  // Manejar cambio en una carrera individual
  const handleChange = (career: Career, isSelected: boolean) => {
    const newSelectedCareers = new Set(selectedCareers);
    const careerName = career.name;

    if (isSelected) {
      newSelectedCareers.add(careerName);
    } else {
      newSelectedCareers.delete(careerName);
    }

    setSelectedCareers(newSelectedCareers);
    onChange?.(Array.from(newSelectedCareers));
  };

  // Manejar selección/deselección de todas las carreras
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      // Seleccionar todas las carreras disponibles
      const allCareers = availableCareers.map((c) => c.name);
      setSelectedCareers(new Set(allCareers));
      onChange?.(allCareers);
    } else {
      // Deseleccionar todo
      setSelectedCareers(new Set());
      onChange?.([]);
    }
  };

  // Verificar si todas las carreras disponibles están seleccionadas
  const allSelected =
    availableCareers.length > 0 &&
    availableCareers.every((career) => selectedCareers.has(career.name));

  // Verificar si hay alguna selección parcial
  const someSelected = selectedCareers.size > 0 && !allSelected;

  if (isLoading) {
    return <Spinner className={`py-4`} />;
  }

  return (
    <div className="mt-3 flex w-full flex-col items-end gap-3">
      <Checkbox
        size="sm"
        color="secondary"
        isSelected={allSelected}
        isIndeterminate={someSelected}
        onChange={(e) => handleSelectAll(e.target.checked)}
      >
        Seleccionar todo
      </Checkbox>

      <div className="custom-scroll grid h-32 w-full grid-cols-1 flex-wrap items-center justify-items-start gap-3 overflow-y-auto overflow-x-hidden rounded-md bg-white/80 p-3">
        {availableCareers
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((option) => (
            <Checkbox
              key={option.id}
              radius="sm"
              size="sm"
              color="secondary"
              isSelected={selectedCareers.has(option.name)}
              onChange={(e) => handleChange(option, e.target.checked)}
            >
              {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
            </Checkbox>
          ))}
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 5px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default CareerFilter;
