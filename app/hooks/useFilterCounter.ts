import { useCallback } from "react";
import { FiltersInterface } from "../types/filters";

/**
 * Hook para contar los filtros activos
 * @param filters Objeto con los filtros
 * @returns Objeto con la propiedad countActiveFilters
 */
const useFilterCounter = (filters: FiltersInterface) => {
  const countActiveFilters = useCallback(() => {
    let count = 0;

    // Contar elementos en cada array de filtros
    if (Array.isArray(filters.education)) {
      count += filters.education.length;
    }
    if (Array.isArray(filters.gender)) {
      count += filters.gender.length;
    }
    if (Array.isArray(filters.languages)) {
      count += filters.languages.length;
    }
    if (Array.isArray(filters.career)) {
      count += filters.career.length;
    }

    // Contar filtros numéricos mayores a 0
    const age = filters.age;
    const minSalary = filters.minSalary;
    const maxSalary = filters.maxSalary;
    const experience = filters.experience;

    // Solo contar valores numéricos mayores a 0 que no sean arrays
    if (typeof age === "number" && age > 0) count++;
    if (typeof minSalary === "number" && minSalary > 0) count++;
    if (typeof maxSalary === "number" && maxSalary > 0) count++;
    if (typeof experience === "number" && experience > 0) count++;

    return count;
  }, [filters]);

  return { countActiveFilters };
};

export default useFilterCounter;
