import { RecommendationType } from "../utils/recommendationStyles.utils";
import { AggregatedValues } from "./sse.types";

export interface Language {
  language: string;
  level: string;
}

export interface Sex {
  explicit: "Masculino" | "Femenino" | "No especificado" | null | undefined;
  inferred: "Masculino" | "Femenino" | "No concluyente" | null | undefined;
}

export interface Score {
  score: number;
  justification: string;
  weight: number;
  weightedScore: number;
}

export interface Scores {
  experienceScore: Score;
  technologiesScore: Score;
  educationScore: Score;
  softSkillsScore: Score;
  industryScore: Score;
  languagesScore: Score;
  achievementsScore: Score;
}

export interface LastPosition {
  position: string;
  industry: string;
  company: string;
}

export interface Education {
  level: string;
  name: string;
  institution: string;
}

export interface IndustrialFit {
  level: string;
  justification: string;
}

export interface Technologies {
  all: string[];
  relevant: string[];
}

export interface Skills {
  soft: string[];
  technical: string[];
}

export interface ExperienceHistory {
  position: string;
  company: string | null | undefined;
  industry: string | null | undefined;
  startDate: string;
  endDate: string | null | undefined;
  isCurrent: boolean;
  isRelevant: boolean;
  yearsOfExperience: number;
  monthsOfExperience: number;
}

// Objecto que representa el candidato como lo recibe la API
export interface CandidateAPI {
  name: string;
  salaryExpectation: number | null | undefined;
  experienceHistory: ExperienceHistory[];
  lastPosition: LastPosition;
  technologies: Technologies;
  address: string | null | undefined;
  willingToRelocate: string | null | undefined;
  sex: Sex;
  skills: Skills;
  languages: Language[];
  education: Education[];
  certifications: string[];
  industryFit: IndustrialFit;
  achievements: string | null | undefined;
  observations: string;
  keyObservations: string | null | undefined;
  recommendation: string | null | undefined;
  scores: Scores;
  age?: number | null;
}

// Objeto que representa el candidato como se muestra en la UI
export interface CandidateUI {
  id: string;
  title: string;
  name: string;
  salaryExpectation: string;
  experience: string;
  sex: string;
  age: number | null | undefined;
  address: string | null | undefined;
  willingToRelocate: string | null | undefined;
  lastPosition: LastPosition;
  technologies: Technologies;
  skills: Skills;
  languages: Language[];
  education: Education[];
  certifications: string[];
  industryFit: IndustrialFit;
  achievements: string;
  observations: string;
  keyObservations: string;
  recommendation: RecommendationType | null | undefined;
  scores: Scores;
  aggregatedValues: AggregatedValues;
  selected?: boolean;
}
