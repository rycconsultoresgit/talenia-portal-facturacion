import {
  Drawer,
  DrawerContent,
  DrawerBody,
  Progress,
  Chip,
} from "@heroui/react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BsHandThumbsUp } from "react-icons/bs";
import { LuMessageSquareWarning } from "react-icons/lu";
import { AiOutlineProfile } from "react-icons/ai";
import { RiGraduationCapLine } from "react-icons/ri";
import { MdOutlineListAlt } from "react-icons/md";
import { AiOutlineIdcard } from "react-icons/ai";
import { PiSuitcase } from "react-icons/pi";
import { LuComputer } from "react-icons/lu";
import { PiStudent } from "react-icons/pi";
import { GrUserExpert } from "react-icons/gr";
import BriefAnalysisModal from "../Modals/BriefAnalysisModal";
import MoreTechnologiesModal from "../Modals/MoreTechnologiesModal";
import {
  Education,
  Scores,
  Skills,
  Technologies,
} from "@/app/types/candidate.types";

type DrawerHandleCreateProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  candidate: {
    technologies: Technologies;
    skills: Skills;
    education: Education[];
    name: string;
    title: string;
    salaryExpectation: number;
    recommendation: string;
    experience: string;
    address: string;
    willingToRelocate: string;
    observations: string;
    lastPosition: {
      industry: string;
      position: string;
    };
    scores: Scores;
  } | null;
};

const ViewCV = ({
  isOpen,
  onOpenChange,
  onClose,
  candidate,
}: DrawerHandleCreateProps) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openFormation, setOpenFormation] = useState(false);
  const [allOpen, setAllOpen] = useState(false);
  const [isBriefAnalyseVisible, setIsBriefAnalyseVisible] = useState(false);
  const [isMoreTechVisible, setIsMoreTechVisible] = useState(false);

  const openAll = () => {
    setAllOpen(true);
    setOpenDetails(true);
    setOpenProfile(true);
    setOpenFormation(true);
  };

  const closeAll = () => {
    setAllOpen(false);
    setOpenDetails(false);
    setOpenProfile(false);
    setOpenFormation(false);
  };

  return (
    <>
      <Drawer
        size="4xl"
        placement="right"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        className="rounded-none"
        onClose={() => {
          onClose();
          closeAll();
        }}
      >
        <DrawerContent className="overflow-y-scroll rounded-xl border-1 border-primary bg-[#ECF4FF] py-6 text-[14px] font-[300] text-[#251D3F] opacity-75">
          <>
            <DrawerBody className="flex h-fit flex-col gap-3">
              {/*Seccion inicial*/}
              <div className="flex h-fit w-full flex-col gap-4 rounded-lg px-4 py-2">
                <div className="flex w-full justify-between">
                  <div>
                    <p className="text-[16px] font-[600] text-[#372AAC]">
                      {candidate?.name}
                    </p>
                    <p className="font-[300]">{candidate?.title}</p>
                    <p className="text-[14px] font-[600] text-[#372AAC]">
                      Renta: {candidate?.salaryExpectation}
                    </p>
                  </div>
                  <p
                    className={`h-fit w-fit rounded-lg border-slate-700 px-2 py-1 ${candidate?.recommendation == "Apto" ? "bg-[#E6FFE3] text-[#38BD57]" : candidate?.recommendation == "Observado" ? "bg-[#FFF4CF] text-[#FF9900]" : "bg-[#FFE3E3] text-[#DF5F5F]"}`}
                  >
                    {candidate?.recommendation}
                  </p>
                </div>
                <div className="grid w-full grid-cols-3 gap-2">
                  <div>
                    <p className="text-[16px] font-[600] text-[#372AAC]">
                      {candidate?.experience}
                    </p>
                    <p>de experiencia</p>
                  </div>

                  <div>
                    <p className="text-[16px] font-[500] text-[#372AAC]">
                      Ubicacion: {candidate?.address}
                    </p>

                    <p>Reubicacion: {candidate?.willingToRelocate}</p>
                  </div>
                  <div>
                    <p className="text-[16px] font-[500] text-[#372AAC]">
                      Nivel de educacion
                    </p>
                    <p>Universitario</p>
                  </div>
                </div>
              </div>

              {/*Detalles*/}
              <div
                className={`${openDetails ? "h-fit" : "h-[60px]"} flex w-full flex-col justify-between gap-4 px-4 py-4`}
                onClick={() => {
                  setOpenDetails(!openDetails);
                }}
              >
                <div className="flex w-full justify-between">
                  <div className="flex cursor-pointer items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <LuMessageSquareWarning /> Detalles del analisis
                  </div>
                  {openDetails ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                <div
                  className={`h-fit w-full gap-2 rounded-[5px] bg-white px-4 py-6 ${openDetails ? "flex flex-col" : "hidden"}`}
                >
                  <div className="flex items-center gap-2 text-[16px] font-[400] text-primaryBlue">
                    <BsHandThumbsUp /> Ajuste a la industria
                  </div>
                  <div className="flex w-full items-center justify-between gap-2">
                    <Progress
                      value={candidate?.scores.industryScore.score}
                      color={
                        candidate?.scores.industryScore.score > 75
                          ? "success"
                          : candidate?.scores.industryScore.score > 25
                            ? "warning"
                            : "danger"
                      }
                    ></Progress>
                    <p>
                      {candidate?.scores.industryScore.score > 75
                        ? "Alto"
                        : candidate?.scores.industryScore.score > 25
                          ? "Medio"
                          : "Bajo"}
                    </p>
                  </div>
                  <p>{candidate?.scores.industryScore.justification}</p>
                </div>
                <div
                  className={`h-fit w-full gap-2 rounded-[5px] bg-white px-4 py-6 ${openDetails ? "flex flex-col" : "hidden"}`}
                >
                  <div className="flex items-center gap-2 text-[16px] font-[400] text-primaryBlue">
                    <MdOutlineListAlt /> Observaciones y recomendaciones
                  </div>
                  <p>{candidate?.observations}</p>
                </div>
              </div>

              {/*Perfil*/}
              <div
                className={`${openProfile ? "h-fit" : "h-[60px]"} flex w-full flex-col justify-between gap-4 px-4 py-4`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenProfile(!openProfile);
                }}
              >
                <div className="flex w-full justify-between">
                  <div className="flex cursor-pointer items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <AiOutlineProfile /> Perfil profesional
                  </div>
                  {openProfile ? (
                    <IoIosArrowUp className="cursor-pointer" />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </div>
                <div
                  className={`grid h-fit w-full grid-cols-3 gap-4 py-2 ${openProfile ? "flex" : "hidden"}`}
                >
                  <div className="h-full w-full rounded-lg bg-white px-4 py-5">
                    <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                      <AiOutlineIdcard />
                      <p>Datos basicos</p>
                    </div>
                    <p>Edad: 25</p>
                    <p>Sexo: Masculino</p>
                  </div>
                  <div className="h-full w-full rounded-lg bg-white px-4 py-5">
                    <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                      <GrUserExpert />
                      <p>Experiencia</p>
                    </div>
                    <p>Totales: 5 años</p>
                    <p>Relevantes: 2 años</p>
                  </div>
                  <div className="h-full w-full rounded-lg bg-white px-4 py-5">
                    <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                      <PiSuitcase />
                      Ultimo cargo
                    </div>
                    <p>Cargo: {candidate?.lastPosition?.position}</p>
                    <p>Sector: {candidate?.lastPosition?.industry}</p>
                  </div>
                </div>
                <div
                  className={`h-fit min-h-[182px] w-full gap-3 bg-white px-4 py-5 ${openProfile ? "flex flex-col" : "hidden"}`}
                >
                  <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <LuComputer />
                    Tecnologias utilizadas
                  </div>
                  <div className="grid h-fit w-full grid-cols-2 gap-2">
                    <div className="flex h-full w-full flex-col gap-2">
                      <p>Relevantes</p>

                      {candidate?.technologies.relevant.length > 0 ? (
                        <div className="grid w-[90%] grid-cols-4 gap-2">
                          {candidate?.technologies.relevant.map(
                            (technology: string, index: number) => {
                              return (
                                <Chip
                                  key={index}
                                  variant="flat"
                                  size="sm"
                                  radius="sm"
                                  className="min-w-[100%] overflow-clip text-clip bg-activeTab text-xs text-purple"
                                >
                                  <p className="w-[65px] truncate">
                                    {technology.charAt(0).toUpperCase() +
                                      technology.slice(1)}
                                  </p>
                                </Chip>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <div>No posee habilidades tecnicas relevantes</div>
                      )}
                    </div>
                    <div className="flex h-full w-full flex-col gap-2">
                      <p>Todas</p>
                      <div className="grid w-full grid-cols-5 gap-2">
                        {candidate?.technologies.all
                          .slice(0, 20)
                          .map((technology: string, index: number) => {
                            return (
                              <>
                                <Chip
                                  key={index}
                                  variant="flat"
                                  size="sm"
                                  radius="sm"
                                  className="min-w-[100%] overflow-clip text-clip bg-activeTab text-xs text-purple"
                                >
                                  <p className="w-[50px] truncate">
                                    {technology.charAt(0).toUpperCase() +
                                      technology.slice(1)}
                                  </p>
                                </Chip>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMoreTechVisible(true);
                    }}
                    className="flex justify-end"
                  >
                    <div className="w-[10%] cursor-pointer rounded-md border bg-white py-1 text-center text-black">
                      Ver mas
                    </div>
                  </div>
                </div>
                <div
                  className={`h-fit w-full gap-2 bg-white px-4 py-5 ${openProfile ? "flex flex-col" : "hidden"}`}
                >
                  <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <AiOutlineProfile />
                    Habilidades tecnicas
                  </div>
                  <div className="grid h-fit w-full grid-cols-2">
                    {candidate?.skills.technical.length > 0 ? (
                      candidate?.skills.technical.map(
                        (hability: string, index) => {
                          return <div key={index}>{hability}</div>;
                        },
                      )
                    ) : (
                      <div>No posee habilidades tecnicas destacables</div>
                    )}
                  </div>
                </div>
              </div>

              {/*Formacion*/}
              <div
                className={`${openFormation ? "h-fit" : "h-[60px]"} flex w-full flex-col justify-between gap-4 px-4 py-4`}
                onClick={() => {
                  setOpenFormation(!openFormation);
                }}
              >
                <div className="flex w-full justify-between">
                  <div className="flex cursor-pointer items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <RiGraduationCapLine /> Formacion educacional
                  </div>
                  {openFormation ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
                <div
                  className={`min-h-[155px] h-fit  w-full gap-3 bg-white px-4 py-5 ${openFormation ? "flex flex-col" : "hidden"}`}
                >
                  <div className="flex items-center gap-2 text-[16px] font-[400] text-[#372AAC]">
                    <PiStudent />
                    Nivel educacional
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2">
                    {candidate?.education.map((education: Education, index) => {
                      return (
                        <div key={index}>
                          <p>Nivel educativo: {education.level}</p>
                          <p>Carrera: {education.name}</p>
                          <p>Institucion: {education.institution}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/*Botones*/}
              <div className="flex w-full justify-end gap-4 px-4">
                {!allOpen ? (
                  <div
                    onClick={openAll}
                    className="flex h-[32px] w-[122px] cursor-pointer items-center justify-center rounded-[5px] bg-[#251D3F] text-[14px] font-[500] text-white"
                  >
                    Abrir todo
                  </div>
                ) : (
                  <div
                    onClick={closeAll}
                    className="flex h-[32px] w-[122px] cursor-pointer items-center justify-center rounded-[5px] bg-[#251D3F] text-[14px] font-[500] text-white"
                  >
                    Cerrar todo
                  </div>
                )}
                <div
                  onClick={() => {
                    setIsBriefAnalyseVisible(true);
                  }}
                  className="flex h-[32px] w-[122px] cursor-pointer items-center justify-center rounded-[5px] bg-[#384DF6] text-[14px] font-[500] text-white"
                >
                  Analisis breve
                </div>
              </div>
            </DrawerBody>
          </>
        </DrawerContent>
      </Drawer>
      <BriefAnalysisModal
        info={candidate?.scores}
        isOpen={isBriefAnalyseVisible}
        onClose={() => {
          setIsBriefAnalyseVisible(false);
        }}
      />
      <MoreTechnologiesModal
        isOpen={isMoreTechVisible}
        onClose={() => {
          setIsMoreTechVisible(false);
        }}
        technologies={candidate?.technologies.all ?? []}
      />
    </>
  );
};
export default ViewCV;
