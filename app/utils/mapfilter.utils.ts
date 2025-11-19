import LangFilter from "../components/Modals/Filters/LangFilter";
import { EducationLevel } from "../components/Modals/Filters/EducationalFilter";
import { GenderType } from "../components/Modals/Filters/GenderFilter";

// Define the API parameters interface
interface ApiFiltersParams {
  projectId: string;
  query?: string[];
  educationLevels?: string[];
  minExperience?: number;
  maxAge?: number;
  minSalary?: number;
  maxSalary?: number;
  gender?: string[];
  career?: string[];
  languages?: Array<{ name: string; level: string }>;
}

// Define a flexible input interface that can handle both typed and string inputs
interface FlexibleFiltersInput {
  education?: EducationLevel[] | string[];
  gender?: GenderType[] | string[];
  languages?: LangFilter[] | string[];
  career?: string[];
  age?: number;
  minSalary?: number;
  maxSalary?: number;
  experience?: number;
  query?: string[];
}

// utils/mapFiltersForApi.ts
export function mapFiltersForApi(
  filters: FlexibleFiltersInput,
  projectId: string,
): ApiFiltersParams {
  const params: ApiFiltersParams = {
    projectId,
    query: filters.query || [],
  };

  // Solo incluir educationLevels si está definido y es un array válido
  if (
    filters.education &&
    Array.isArray(filters.education) &&
    filters.education.length > 0
  ) {
    params.educationLevels = filters.education;
  }

  // Solo incluir minExperience si está definido y es un número válido
  if (filters.experience !== undefined && filters.experience !== null) {
    const exp = Number(filters.experience);
    if (!isNaN(exp) && exp > 0) {
      params.minExperience = exp;
    }
  }

  if (filters.age !== undefined && filters.age !== null) {
    const age = Number(filters.age);
    if (!isNaN(age) && age > 0) {
      // Changed > to >= to include 0
      params.maxAge = age;
    }
  }

  if (filters.minSalary !== undefined && filters.minSalary !== null) {
    const salary = Number(filters.minSalary);
    if (!isNaN(salary) && salary > 0) {
      params.minSalary = salary;
    }
  }

  if (filters.maxSalary !== undefined && filters.maxSalary !== null) {
    const salary = Number(filters.maxSalary);
    if (!isNaN(salary) && salary > 0) {
      params.maxSalary = salary;
    }
  }

  // Add gender filter if it exists and is not empty
  if (
    filters.gender &&
    Array.isArray(filters.gender) &&
    filters.gender.length > 0
  ) {
    params.gender = filters.gender;
  }

  // Handle career filter - ensure it's an array of strings
  if (filters.career) {
    if (Array.isArray(filters.career)) {
      // If it's an array, filter out any non-string values
      params.career = filters.career.filter(
        (item: unknown) => typeof item === "string",
      );
    } else if (typeof filters.career === "string") {
      // If it's a single string, convert to array
      params.career = [filters.career];
    }
    // Remove if empty after processing
    if (params.career && params.career.length === 0) {
      delete params.career;
    }
  }

  // Handle language filter - expect array of objects with id, name, and level, or array of strings
  if (
    filters.languages &&
    Array.isArray(filters.languages) &&
    filters.languages.length > 0
  ) {
    // Check if it's an array of LangFilter objects or strings
    if (
      typeof filters.languages[0] === "object" &&
      "name" in filters.languages[0]
    ) {
      // Array of LangFilter objects
      params.languages = (filters.languages as LangFilter[]).map((lang) => ({
        name: lang.name,
        level: lang.level,
      }));
    } else {
      // Array of strings - convert to the expected format with default level
      params.languages = (filters.languages as string[]).map((langName) => ({
        name: langName,
        level: "intermediate", // Default level for string inputs
      }));
    }

    // Remove if empty after processing
    if (params.languages.length === 0) {
      delete params.languages;
    }
  }

  return params;
}
