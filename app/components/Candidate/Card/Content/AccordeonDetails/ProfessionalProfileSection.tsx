import { PiSuitcase } from "react-icons/pi";
import { LuComputer } from "react-icons/lu";
import { AiOutlineProfile } from "react-icons/ai";
import { CandidateUI } from "@/app/types/candidate.types";
import { GrUserExpert } from "react-icons/gr";
import { IoMdAddCircle } from "react-icons/io";
import { ExpandArrowIcon } from "../../ExpandIcons";
import { MdContactEmergency } from "react-icons/md";

interface ProfessionalProfileProps {
  candidateUI: CandidateUI;
  onViewAllTechnologies: () => void;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

const ProfessionalProfile = ({
  candidateUI,
  onViewAllTechnologies,
  isExpanded,
  setIsExpanded,
}: ProfessionalProfileProps) => {
  return (
    <div className="flex h-fit w-full flex-col items-center justify-between gap-4 border-t-1 border-divider/30 p-2">
      <div
        className="flex w-full cursor-pointer items-center justify-between"
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
      >
        <div className="ml-5 flex items-center gap-3">
          <AiOutlineProfile className="size-4 flex-shrink-0 text-purple" />
          <h3 className="cursor-pointer select-none text-base font-semibold">
            Perfil profesional
          </h3>
        </div>
        <ExpandArrowIcon isExpanded={isExpanded} />
      </div>
      <div
        className={`w-full select-text items-center justify-center rounded-lg ${
          isExpanded ? "flex flex-col gap-2" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full gap-2">
          <div className="w-1/3 rounded-md border bg-white/50 p-4">
            <div className="flex h-[99px] flex-col rounded-md">
              <div className="flex h-[25px] w-full flex-row items-center">
                <MdContactEmergency className="h-3 w-3 text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Datos básicos
                </h3>
              </div>
              <div className="mt-2 flex w-full flex-col">
                <label className="cursor-default text-sm font-light text-darkPurple">
                  Edad:{" "}
                  {candidateUI.age == 0
                    ? "No mencionado"
                    : candidateUI.age + " años"}
                </label>
                <label className="cursor-default text-sm font-light text-darkPurple">
                  Sexo: {candidateUI.sex ?? "No mencionado"}
                </label>
              </div>
            </div>
          </div>

          {/* Experience Card */}
          <div className="w-1/3 rounded-md border bg-white/50 p-4">
            <div className="flex flex-col rounded-md">
              <div className="flex w-full flex-row items-center">
                <GrUserExpert size={12} className="text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Experiencia
                </h3>
              </div>
              <div className="mt-1 flex w-full flex-col">
                {(() => {
                  const totalMonths = candidateUI.aggregatedValues.totalMonths;
                  const years = totalMonths ? Math.floor(totalMonths / 12) : 0;
                  const months = totalMonths ? totalMonths % 12 : 0;
                  const monthsText = months > 0 ? `${months} meses` : "";
                  return (
                    <h3 className="cursor-default text-sm font-light text-darkPurple">
                      Total:{" "}
                      {totalMonths
                        ? `${years} años ${monthsText}`.trim()
                        : candidateUI.experience}
                    </h3>
                  );
                })()}
                {(() => {
                  const relevantMonths =
                    candidateUI.aggregatedValues.relevantMonths;
                  let relevantText = "No especificado";
                  if (relevantMonths) {
                    const years = Math.floor(relevantMonths / 12);
                    const months = relevantMonths % 12;
                    relevantText = (
                      years +
                      " años" +
                      (months > 0 ? " " + months + " meses" : "")
                    ).trim();
                  }
                  return (
                    <h3 className="cursor-default text-sm font-light text-darkPurple">
                      Relevante: {relevantText}
                    </h3>
                  );
                })()}
                <h3 className="cursor-default text-sm font-light text-darkPurple">
                  Prom. permanencia:{" "}
                  {candidateUI.aggregatedValues.totalAverageMonths
                    ? Math.round(
                        candidateUI.aggregatedValues.totalAverageMonths,
                      )
                    : 0}{" "}
                  meses
                </h3>
              </div>
            </div>
          </div>

          {/* Last Position Card */}
          <div className="w-1/3 rounded-md border bg-white/50 p-4">
            <div className="flex flex-col rounded-md">
              <div className="flex w-full flex-row items-center">
                <PiSuitcase size={12} className="text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Último cargo
                </h3>
              </div>
              <div className="mt-2 flex w-full flex-col">
                <label className="cursor-default text-sm font-light text-darkPurple">
                  Cargo:{" "}
                  {candidateUI.lastPosition?.position || "No especificado"}
                </label>
                <label className="cursor-default text-sm font-light text-darkPurple">
                  Sector:{" "}
                  {candidateUI.lastPosition?.industry || "No especificado"}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-2">
          {/* Technologies Used */}
          <div className="h-fit w-7/12 rounded-md border bg-white/50 p-4">
            <div className="flex h-fit flex-col rounded-md">
              <div className="flex w-full flex-row items-center">
                <LuComputer size={12} className="text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Tecnologías utilizadas
                </h3>
              </div>
              <div className="mt-2 grid h-fit w-full grid-cols-2 gap-1">
                <div className="w-full space-y-1">
                  <h3 className="place-self-start text-sm font-normal text-darkPurple">
                    Relevantes
                  </h3>
                  <div className="flex w-full flex-wrap gap-2">
                    {candidateUI.technologies.relevant
                      .slice(0, 15)
                      .sort((a, b) => a.localeCompare(b))
                      .map((tech, index) => (
                        <div
                          title={`${tech}`}
                          key={index}
                          className="flex-shrink-0 rounded-xl bg-activeTab px-2"
                        >
                          <span className="text-xs font-normal text-darkPurple">
                            {tech}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="w-full space-y-1">
                  <h3 className="place-self-start text-sm font-normal text-darkPurple">
                    Todas
                  </h3>
                  <div className="flex w-full flex-wrap gap-2">
                    {candidateUI.technologies.all
                      .slice(0, 13)
                      .sort((a, b) => a.localeCompare(b))
                      .map((tech, index) => (
                        <div
                          title={`${tech}`}
                          key={index}
                          className="flex-shrink-0 rounded-xl bg-activeTab px-2"
                        >
                          <span className="text-xs font-normal text-darkPurple">
                            {tech}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div
                className="mt-4 flex w-fit items-center justify-center gap-1 place-self-end rounded-md bg-white px-2 py-1 text-xs font-medium text-darkPurple hover:cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewAllTechnologies();
                }}
              >
                <IoMdAddCircle size={16} color="#372AAC" /> Ver más
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="w-5/12 rounded-md border bg-white/50 p-4">
            <div className="flex flex-1 flex-col rounded-md">
              <div className="flex h-[25px] w-full flex-row items-center">
                <AiOutlineProfile size={12} className="text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Habilidades técnicas
                </h3>
              </div>
              <div className="mt-2 h-full w-full">
                {candidateUI.skills.technical.length > 0 ? (
                  <div className="grid grid-cols-2 grid-rows-3 gap-x-4 gap-y-0">
                    {candidateUI.skills.technical
                      .slice(0, 6)
                      .map((skill, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <span className="text-sm font-light text-darkPurple">
                            &#9679;
                          </span>
                          <span className="text-sm font-light text-darkPurple">
                            {skill}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="cursor-default text-sm font-light text-darkPurple">
                      No se encontraron habilidades técnicas relevantes
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
