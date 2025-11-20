import { useState, useEffect, useCallback } from "react";
import debounce from "debounce";

/**
 * Hook para manejar la búsqueda
 * @param initialValue Valor inicial del input
 * @param delay Retardo en ms para la búsqueda
 * @returns Objeto con las propiedades searchInput, setSearchInput, debouncedSearchTerm, isSearching, error, clearSearch, setIsSearching, setError
 */
export const useSearch = (initialValue = "", delay = 500) => {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Crear la función debounce una sola vez
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, delay),
    [delay],
  );

  // Actualizar el término de búsqueda con debounce cuando searchInput cambie
  useEffect(() => {
    if (searchInput.trim() === "") {
      // Si el input está vacío, actualizar inmediatamente
      setDebouncedSearchTerm("");
    } else {
      // De lo contrario, usar el debounce
      debouncedSetSearchTerm(searchInput);
    }

    return () => {
      debouncedSetSearchTerm.clear();
    };
  }, [searchInput, debouncedSetSearchTerm]);

  const clearSearch = () => {
    setSearchInput("");
    setError(null);
  };

  return {
    searchInput,
    setSearchInput,
    debouncedSearchTerm,
    isSearching,
    error,
    clearSearch,
    setIsSearching,
    setError,
  };
};
