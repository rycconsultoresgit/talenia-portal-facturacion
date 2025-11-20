/**
 * Convierte un salario del servidor (puede venir como "420.000") a número
 */
export const parseSalaryFromServer = (
  salaryValue: string | number | null | undefined,
): number => {
  if (!salaryValue) return 0;
  if (typeof salaryValue === "number") return salaryValue;
  // Remover puntos (separadores de miles) y convertir a número
  const cleanValue = salaryValue.toString().replace(/\./g, "");
  const numericValue = parseInt(cleanValue, 10);
  return isNaN(numericValue) ? 0 : numericValue;
};

/**
 * Formatea un número a formato de salario chileno
 */
export const formatSalaryToCLP = (
  value: string | number | null | undefined,
): string => {
  if (value === null || value === undefined || value === "") return "";
  const numberValue =
    typeof value === "string" ? parseSalaryFromServer(value) : Number(value);
  if (isNaN(numberValue) || numberValue === 0) return "No especificado";
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(numberValue);
};
