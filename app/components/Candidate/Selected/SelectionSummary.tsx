import { LiaUsersSolid } from "react-icons/lia";
import { GrUserExpert } from "react-icons/gr";
import { TbReportMoney } from "react-icons/tb";
import { CandidateUI } from "@/app/types/candidate.types";
import { parseSalaryFromServer } from "@/app/utils/salary.utils";

const formatExperience = (years: number, months: number): string => {
  if (years === 0 && months === 0) return "0 meses";
  if (years === 0) return `${months} ${months === 1 ? "mes" : "meses"}`;
  if (months === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} y ${months} ${months === 1 ? "mes" : "meses"}`;
};

interface SelectionSummaryProps {
  selectedCvs: string[];
  allCandidates: CandidateUI[];
}

export function SelectionSummary({
  selectedCvs,
  allCandidates,
}: Readonly<SelectionSummaryProps>) {
  return (
    <div className="flex w-1/2 flex-col gap-2">
      <h3 className="text-base font-semibold text-purple">
        Resumen de seleccionados
      </h3>

      <div className="grid w-fit grid-cols-2 justify-items-start gap-1">
        <div className="flex flex-row items-center gap-2">
          <LiaUsersSolid className="size-5 text-purple" />
          <p className="text-darkPurple">
            {selectedCvs.length} candidatos seleccionados
          </p>
        </div>

        <div className="flex flex-row items-center gap-3">
          <GrUserExpert className="size-4 translate-x-1 text-purple" />
          <p className="text-darkPurple">
            Experiencia promedio:{" "}
            {selectedCvs.length > 0
              ? (() => {
                  const selectedCandidates = allCandidates.filter(
                    (candidate) =>
                      selectedCvs.includes(candidate.id) &&
                      candidate.aggregatedValues,
                  );

                  if (selectedCandidates.length === 0) return "No disponible";

                  // Si solo hay un candidato, mostramos su experiencia directamente
                  if (selectedCandidates.length === 1) {
                    const months =
                      selectedCandidates[0].aggregatedValues?.totalMonths || 0;
                    const years = Math.floor(months / 12);
                    const remainingMonths = months % 12;
                    return formatExperience(years, remainingMonths);
                  }

                  // Para 2 o más candidatos, calculamos el promedio
                  const totalMonths = selectedCandidates.reduce(
                    (sum, candidate) =>
                      sum + (candidate.aggregatedValues?.totalMonths || 0),
                    0,
                  );

                  const averageMonths = Math.round(
                    totalMonths / selectedCandidates.length,
                  );
                  const years = Math.floor(averageMonths / 12);
                  const remainingMonths = averageMonths % 12;
                  return formatExperience(years, remainingMonths);
                })()
              : "0 meses"}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <TbReportMoney className="size-5 text-purple" />
          <p className="text-darkPurple">
            Renta promedio:{" "}
            {selectedCvs.length > 0
              ? (() => {
                  const candidatesWithSalary = allCandidates.filter(
                    (candidate) => {
                      const salary = parseSalaryFromServer(
                        candidate.salaryExpectation,
                      );
                      return selectedCvs.includes(candidate.id) && salary > 0;
                    },
                  );

                  if (candidatesWithSalary.length === 0) return "No disponible";

                  const totalSalary = candidatesWithSalary.reduce(
                    (sum, candidate) =>
                      sum + parseSalaryFromServer(candidate.salaryExpectation),
                    0,
                  );

                  const averageSalary = Math.round(
                    totalSalary / candidatesWithSalary.length,
                  );

                  const formatter = new Intl.NumberFormat("es-CL", {
                    style: "currency",
                    currency: "CLP",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    useGrouping: true,
                  });

                  const formattedSalary = formatter.format(averageSalary);

                  return `${formattedSalary}`;
                })()
              : "No disponible"}
          </p>
        </div>
      </div>
    </div>
  );
}
