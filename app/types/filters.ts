import { EducationLevel } from "@/app/components/Modals/Filters/EducationalFilter";
import { GenderType } from "@/app/components/Modals/Filters/GenderFilter";
import LangFilter from "../components/Modals/Filters/LangFilter";

export interface FiltersInterface {
  education?: EducationLevel[];
  gender?: GenderType[];
  languages?: LangFilter[];
  career?: string[];
  age?: number;
  minSalary?: number;
  maxSalary?: number;
  experience?: number;
}
