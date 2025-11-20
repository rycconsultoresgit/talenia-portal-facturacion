import { useState, useCallback } from "react";
import { DateValue } from "@internationalized/date";
import { useDebouncedCallback } from "use-debounce";

const useFolderSearch = (
  initialSearch = "",
  initialDate: DateValue | null = null,
) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [inputSearch, setInputSearch] = useState(initialSearch);
  const [selectedDate, setSelectedDate] = useState<DateValue | null>(
    initialDate,
  );

  // Usamos useDebouncedCallback para manejar el debounce del input
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 500);

  const handleSearchChange = useCallback(
    (value: string) => {
      // Actualizamos el input inmediatamente para mejor experiencia de usuario
      setInputSearch(value);
      // Usamos la función debounce para actualizar searchTerm
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  return {
    searchTerm,
    inputSearch,
    selectedDate,
    setSelectedDate,
    handleSearchChange,
  };
};

export default useFolderSearch;
