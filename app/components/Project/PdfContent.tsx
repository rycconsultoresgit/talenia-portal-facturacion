"use client";
import React from "react";
import Image from "next/image";
import GPLogo from "@/app/assets/gp_logo.png";
import TaleniaLogo from "@/app/assets/logo_sumary.png";
import { CandidateUI } from "@/app/types/candidate.types";
import { parseSalaryFromServer } from "@/app/utils/salary.utils";

interface pdfContentProps {
  selectedCvs: string[];
  allCandidates: CandidateUI[];
  project: string;
}

const formatExperience = (years: number, months: number): string => {
  if (years === 0 && months === 0) return "0 meses";
  if (years === 0) return `${months} ${months === 1 ? "mes" : "meses"}`;
  if (months === 0) return `${years} ${years === 1 ? "año" : "años"}`;
  return `${years} ${years === 1 ? "año" : "años"} y ${months} ${months === 1 ? "mes" : "meses"}`;
};




export default function PdfContent({
  selectedCvs,
  allCandidates,
  project,
}: Readonly<pdfContentProps>) {
  return (
    <div id="pdf-content" className="w-[794px] text-[16px] text-darkPurple">
      <div className="flex h-fit w-[98%] flex-col ">
        <div className="flex w-full items-center justify-between min-h-[124px]">
          <Image
            alt=""
            src={GPLogo}
            className="h-fit w-[25%] object-contain"
          ></Image>
          <Image
            alt=""
            src={TaleniaLogo}
            className="h-fit w-[25%] object-contain"
          ></Image>
        </div>
        <div className="flex min-h-[1000px]  flex-col items-start justify-center gap-2 px-8 py-4 ">
          <p className="text-[24px] font-[600]">
            TALENIA - INFORME EJECUTIVO DE PRESELECCIÓN
          </p>
          <p>Cargo evaluado: {project}</p>
          <p>Fecha del informe: {new Date().toLocaleDateString()}</p>
          <p>
            Este informe presenta los resultados obtenidos mediante el motor de
            preselección automática de TalenIA, procesando{" "}
            {allCandidates.length} candidatos y destacando los {selectedCvs.length} con mayor
            ajuste técnico, experiencia y compatibilidad con el perfil
            solicitado.
          </p>
        </div>

        <div className="flex flex-col gap-10 px-8 min-h-[1124px]">
          <p className="text-[24px] font-[600]">1. Resumen ejecutivo</p>

          {/*GRID*/}
          <div className="grid w-full grid-cols-2 grid-rows-8 px-10 pb-10 pt-1">
            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">
              Candidatos evaluados
            </p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {allCandidates.length}{" "}
            </p>

            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">
              Preseleccionados
            </p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {selectedCvs.length}{" "}
            </p>

            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">Aptos</p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {
                allCandidates.filter((cv) => cv.recommendation == "Apto" && selectedCvs.includes(cv.id)).length
              }{" "}
            </p>

            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">
              Observados
            </p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {
                allCandidates.filter((cv) => cv.recommendation == "Observado" && selectedCvs.includes(cv.id))
                  .length
              }{" "}
            </p>

            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">No aptos</p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {
                allCandidates.filter((cv) => cv.recommendation == "No apto" && selectedCvs.includes(cv.id))
                  .length
              }{" "}
            </p>

            <p className="w-full place-self-start border px-4 pb-4 bg-darkPurple text-white">
              Experiencia promedio del grupo
            </p>
            <p className="w-full place-self-start border px-4 pb-4">
              {" "}
              {selectedCvs.length > 0
                ? (() => {
                    const selectedCandidates = allCandidates.filter(
                      (candidate) =>
                        selectedCvs.includes(candidate.id) &&
                        candidate.aggregatedValues 
                    );

                    if (selectedCandidates.length === 0) return "No disponible";

                    // Si solo hay un candidato, mostramos su experiencia directamente
                    if (selectedCandidates.length === 1) {
                      const months =
                        selectedCandidates[0].aggregatedValues?.totalMonths ||
                        0;
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

            <div className="w-full border px-4 py-1 bg-darkPurple text-white">
              Renta promedio esperada
            </div>
            <div className="w-full border px-4 py-1">
              {" "}
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

                    if (candidatesWithSalary.length === 0)
                      return "No disponible";

                    const totalSalary = candidatesWithSalary.reduce(
                      (sum, candidate) =>
                        sum +
                        parseSalaryFromServer(candidate.salaryExpectation),
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
                : "No disponible"}{" "}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10 px-8 min-h-[1124px]">
          <p className="text-[24px] font-[600]">
            2. Top {selectedCvs.length} candidatos seleccionados
          </p>

          <div className="flex w-full flex-col items-center justify-center px-10">
            <div className="grid w-full grid-cols-5 items-center justify-center gap-2 bg-darkPurple px-4 text-white">
              <p className="self-center pb-4">Nombre</p>
              <p className="self-center pb-4">Estado</p>
              <p className="self-center pb-4">Experiencia</p>
              <p className="self-center pb-4">Renta</p>
              <p className="self-center pb-4">Tecnologias</p>
            </div>

            {allCandidates.filter(candidate => selectedCvs.includes(candidate.id) ).map((item, index) => {
              return (
                <div
                  key={index}
                  className="grid w-full grid-cols-5 border px-4 pb-4"
                >
                  <p>{item.name}</p>
                  <p>{item.recommendation}</p>
                  <p>{item.experience}</p>
                  <p>{item.salaryExpectation}</p>
                  <div className="w-full text-clip text-wrap">
                    {item.technologies.relevant.map((item, index) => (
                      <p key={index}>{item}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
