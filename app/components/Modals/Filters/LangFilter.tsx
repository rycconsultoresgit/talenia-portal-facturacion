import { useState, useEffect } from "react";
import { Checkbox, Spinner } from "@heroui/react";
import { toast } from "sonner";
import { languageService } from "@/app/api/languageService";

export interface LangFilter {
  id: string;
  name: string;
  level: string;
  projectId: string;
}

interface LangFilterProps {
  value?: LangFilter[];
  onChange?: (langFilter: LangFilter[]) => void;
  projectId: string;
}

export const LangFilter = ({
  value: externalValue = [],
  onChange,
  projectId,
}: LangFilterProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableLangs, setAvailableLangs] = useState<LangFilter[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<Set<string>>(new Set());

  // Cargar idiomas disponibles
  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const response = await languageService.getLangs(projectId);
        setAvailableLangs(response);
      } catch (error) {
        console.error("Error fetching langs:", error);
        toast.error("Error al cargar idiomas del requerimiento");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLangs();
  }, [projectId]);

  // Sincronizar con el valor externo cuando cambia
  useEffect(() => {
    setSelectedLangs(new Set(externalValue.map((l) => l.id)));
  }, [externalValue]);

  // Manejar cambio en un idioma individual
  const handleChange = (lang: LangFilter, isSelected: boolean) => {
    const newSelectedLangs = new Set(selectedLangs);

    if (isSelected) {
      newSelectedLangs.add(lang.id);
    } else {
      newSelectedLangs.delete(lang.id);
    }

    setSelectedLangs(newSelectedLangs);
    const updated = availableLangs.filter((l) => newSelectedLangs.has(l.id));
    onChange?.(updated);
  };

  // Manejar selección/deselección de todos los idiomas
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = availableLangs.map((c) => c.id);
      setSelectedLangs(new Set(allIds));
      onChange?.(availableLangs);
    } else {
      setSelectedLangs(new Set());
      onChange?.([]);
    }
  };

  // Verificar si todos los idiomas están seleccionados
  const allSelected =
    availableLangs.length > 0 &&
    availableLangs.every((lang) => selectedLangs.has(lang.id));

  // Verificar si hay alguna selección parcial
  const someSelected = selectedLangs.size > 0 && !allSelected;

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
        {availableLangs
          .toSorted((a, b) => a.name.localeCompare(b.name))
          .map((option) => (
            <Checkbox
              key={option.id}
              radius="sm"
              size="sm"
              color="secondary"
              isSelected={selectedLangs.has(option.id)}
              onChange={(e) => handleChange(option, e.target.checked)}
            >
              {option.name.charAt(0).toUpperCase() + option.name.slice(1)} -{" "}
              {option.level.charAt(0).toUpperCase() + option.level.slice(1)}
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

export default LangFilter;
