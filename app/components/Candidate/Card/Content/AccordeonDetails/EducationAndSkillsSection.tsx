import { PiStudent } from "react-icons/pi";
import { AiOutlineProfile } from "react-icons/ai";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { HiOutlineAcademicCap, HiOutlineEmojiHappy } from "react-icons/hi";
import { CandidateUI } from "@/app/types/candidate.types";
import { getHighestEducation } from "@/app/utils/candidate.utils";
import { ExpandArrowIcon } from "../../ExpandIcons";
import { capitalize } from "@/app/utils/string.utils";

const EducationAndSkillsSection = ({
  education,
  certifications,
  languages,
  softSkills,
  isExpanded,
  setIsExpanded,
}: {
  education: CandidateUI["education"];
  certifications: CandidateUI["certifications"];
  languages: CandidateUI["languages"];
  softSkills: string[];
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}) => {
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
          <HiOutlineAcademicCap className="size-4 flex-shrink-0 text-purple" />
          <h3 className="cursor-pointer select-none text-base font-semibold">
            Formación y competencias personales
          </h3>
        </div>
        <ExpandArrowIcon isExpanded={isExpanded} />
      </div>
      <div
        className={`w-full select-text items-center justify-center rounded-lg ${
          isExpanded ? "flex w-full flex-col gap-2" : "hidden"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fila 1 */}
        <div className="flex w-full flex-row gap-2">
          {/* Education */}
          <div className="flex w-2/3 flex-col rounded-md bg-white/50 p-4">
            <div className="flex w-full flex-row items-center">
              <PiStudent className="h-3 w-3 text-primaryBlue" />
              <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                Nivel educacional
              </h3>
            </div>
            <div className="mt-2 grid h-fit w-full grid-cols-2 gap-1">
              {education && education.length > 0 ? (
                education.slice(0, 2).map((edu, index) => (
                  <div key={index} className="">
                    <label className="block cursor-default text-sm font-medium text-purple">
                      Nivel:{" "}
                      <span className="text-sm font-light text-darkPurple">
                        {edu.level}
                      </span>
                    </label>
                    <label className="block cursor-default truncate text-sm font-medium text-purple">
                      Carrera:{" "}
                      <span className="text-sm font-light text-darkPurple">
                        {edu.name}
                      </span>
                    </label>
                    <label className="block cursor-default truncate text-sm font-medium text-purple">
                      Institución:{" "}
                      <span className="text-sm font-light text-darkPurple">
                        {edu.institution}
                      </span>
                    </label>
                  </div>
                ))
              ) : (
                <>
                  <label className="cursor-default text-sm font-medium text-purple">
                    Nivel educativo:{" "}
                    <span className="font-light text-darkPurple">
                      {getHighestEducation(education) ?? "No especificado"}
                    </span>
                  </label>
                  <label className="cursor-default text-sm font-medium text-purple">
                    Estado:{" "}
                    <span className="font-light text-darkPurple">
                      No especificado
                    </span>
                  </label>
                  <label className="cursor-default text-sm font-medium text-purple">
                    Carrera:{" "}
                    <span className="font-light text-darkPurple">
                      No especificado
                    </span>
                  </label>
                  <label className="cursor-default text-sm font-medium text-purple">
                    Institución:{" "}
                    <span className="font-light text-darkPurple">
                      No especificado
                    </span>
                  </label>
                </>
              )}
            </div>
          </div>
          <div className="h-full w-1/3 rounded-lg bg-white/50 p-4">
            <div className="flex flex-col rounded-md">
              <div className="flex w-full flex-row items-center">
                <BiMessageRoundedDetail className="h-3 w-3 text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Idiomas
                </h3>
              </div>
              <div className="mt-2 w-full">
                {languages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    {languages.slice(0, 4).map((lang, index) => (
                      <label
                        key={index}
                        className="mb-1 cursor-default place-self-start text-sm font-medium text-purple"
                      >
                        {capitalize(lang.language)}:{" "}
                        <span className="font-light text-darkPurple">
                          {capitalize(lang.level)}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <h3 className="cursor-default text-sm font-light text-darkPurple">
                      No se encontraron idiomas relevantes
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Fila 2 */}
        <div className="flex w-full flex-row gap-2">
          {/* Certifications */}
          <div className="h-full w-1/2 text-pretty rounded-lg bg-white/50">
            <div className="flex flex-col rounded-md p-4">
              <div className="flex h-[25px] w-full flex-row items-center">
                <AiOutlineProfile className="h-3 w-3 text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Certificaciones
                </h3>
              </div>

              {certifications.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {certifications.slice(0, 5).map((cert, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <span className="text-sm font-light text-darkPurple">
                        &#9679;
                      </span>
                      <span className="text-sm font-light text-darkPurple">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <h3 className="cursor-default place-self-start text-sm font-light text-purple">
                  No se especificaron certificaciones
                </h3>
              )}
            </div>
          </div>
          {/* Soft Skills */}
          <div className="flex h-full w-1/2 rounded-lg bg-white/50 p-4">
            <div className="flex w-full flex-col rounded-md">
              <div className="flex h-[25px] w-full flex-row items-center">
                <HiOutlineEmojiHappy className="h-3 w-3 text-primaryBlue" />
                <h3 className="ml-2 cursor-default text-base font-normal text-primaryBlue">
                  Habilidades blandas
                </h3>
              </div>
              <div className="mt-2 h-full w-full">
                {softSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {softSkills.slice(0, 6).map((skill, index) => (
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
                      No se encontraron habilidades blandas relevantes
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

export default EducationAndSkillsSection;
