import { CandidateUI } from "../types/candidate.types";
import { CVEvent } from "../types/sse.types";
import { RecommendationType } from "./recommendationStyles.utils";

/**
 * Formatea los meses de experiencia en una cadena legible para humanos
 * @param totalMonths - Total de meses de experiencia
 * @returns Cadena de experiencia formateada (por ejemplo, "2 años 6 meses" o "1 año")
 */
export const formatExperience = (totalMonths: number): string => {
  // Redondear los meses al entero más cercano
  const roundedMonths = Math.round(totalMonths);
  const totalYears = Math.floor(roundedMonths / 12);
  const remainingMonths = roundedMonths % 12;

  // Si es menos de un mes, mostrarlo como "Menos de 1 mes"
  if (roundedMonths === 0) return "Sin experiencia";

  // Si es exactamente 1 mes
  if (roundedMonths === 1) return "1 mes";

  // Si es menos de 12 meses, mostrar solo los meses
  if (roundedMonths < 12) return `${roundedMonths} meses`;

  // Si es exactamente 1 año
  if (totalYears === 1 && remainingMonths === 0) return "1 año";

  // Si es más de 1 año sin meses adicionales
  if (totalYears > 1 && remainingMonths === 0) return `${totalYears} años`;

  // Para cualquier otro caso (años y meses)
  const yearText = totalYears === 1 ? "año" : "años";
  const monthText = remainingMonths === 1 ? "mes" : "meses";

  return `${totalYears} ${yearText} ${remainingMonths} ${monthText}`;
};

/**
 * Encuentra la nivelación educativa más alta de un conjunto de entradas de educación
 * @param education - Conjunto de entradas de educación con la propiedad 'level'
 * @returns El nivelación educativa más alta como una cadena de texto, o una cadena vacía si no se encuentra
 */
export const getHighestEducation = (
  education: Array<{ level: string }>,
): string => {
  if (!education?.length) return "";

  const levels = [
    "Secundaria",
    "Técnico",
    "Universitario",
    "Postgrado",
    "Doctorado",
  ];

  const highest = education.reduce((highest, current) => {
    const currentIndex = levels.indexOf(current.level);
    const highestIndex = levels.indexOf(highest.level);
    return currentIndex > highestIndex ? current : highest;
  }, education[0]);

  return highest?.level || "";
};

/**
 * Convierte un evento CV en un objeto CandidateUI
 * @param cv - Evento CV con datos del candidato
 * @returns Objeto CandidateUI con los datos del candidato, o null si los datos son incompletos
 */
export const convertCVToCandidate = (cv: CVEvent): CandidateUI | null => {
  const candidate = cv.cvData.candidate;
  const aggregatedValues = cv.cvData.aggregatedValues;

  // Validar que cv y sus propiedades existan
  if (!cv || !aggregatedValues || !candidate) {
    console.error("CV data is incomplete:", cv);
    return null;
  }

  const experience = formatExperience(aggregatedValues.totalMonths);

  return {
    id: cv.id,
    title: candidate.lastPosition?.position || "Cargo no especificado",
    name: candidate.name || "Nombre no especificado",
    salaryExpectation:
      candidate.salaryExpectation > 0
        ? candidate.salaryExpectation.toLocaleString()
        : "No especificado",
    experience,
    sex:
      candidate.sex?.explicit?.trim() ||
      candidate.sex?.inferred?.trim() ||
      "No especificado",
    age: candidate.age,
    address: candidate.address,
    willingToRelocate: candidate.willingToRelocate,
    selected: cv.selected || false,

    lastPosition: {
      position: candidate.lastPosition?.position || "",
      industry: candidate.lastPosition?.industry || "",
      company: candidate.lastPosition?.company || "",
    },

    technologies: {
      all: candidate.technologies?.all || [],
      relevant: candidate.technologies?.relevant || [],
    },

    skills: {
      soft: candidate.skills?.soft || [],
      technical: candidate.skills?.technical || [],
    },

    languages: candidate.languages || [],
    education: candidate.education || [],
    certifications: candidate.certifications || [],
    industryFit: {
      level: candidate.industryFit?.level || "No evaluado",
      justification: candidate.industryFit?.justification || "",
    },
    achievements: candidate.achievements || "",
    observations: candidate.observations || "",
    keyObservations: candidate.keyObservations || "",
    recommendation: candidate.recommendation as RecommendationType,
    scores: candidate.scores,
    aggregatedValues: aggregatedValues,
  };
};
