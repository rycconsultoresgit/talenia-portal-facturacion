"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  DropdownItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../../Common/Buttons";
import { EducationalFilter } from "./EducationalFilter";
import ExperienceFilter from "./ExperienceFilter";

import { FiltersInterface } from "@/app/types/filters";
import AgeFilter from "./AgeFilter";
import SalaryFilter from "./SalaryFilter";
import GenderFilter from "./GenderFilter";
import CareerFilter from "./CareersFilter";
import LangFilter from "./LangFilter";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: FiltersInterface) => void;
  activeFilters?: FiltersInterface;
  projectId: string;
}

export default function FilterModal3({
  projectId,
  isOpen,
  onClose,
  onApply,
  activeFilters,
}: Readonly<FilterModalProps>) {
  //Manejadores de contenido
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Helper functions for better readability
  const isEductionFiltering = activeFilter === "Education";
  const isSalaryFiltering = activeFilter === "Salary";
  const isAgeFiltering = activeFilter === "Age";
  const isGenderFiltering = activeFilter === "Gender";
  const isCareerFiltering = activeFilter === "Career";
  const isLanguageFiltering = activeFilter === "Language";
  const isExperienceFiltering = activeFilter === "Experience";

  // Estados de los filtros
  const [filters, setFilters] = useState<FiltersInterface>(() => {
    const initialFilters: FiltersInterface = {
      education: [],
      gender: [],
      languages: [],
      career: [],
      minSalary: undefined,
      maxSalary: undefined,
      experience: 0,
      age: 0,
      ...activeFilters,
    };

    // Convert education to array if it's an object
    if (activeFilters?.education) {
      initialFilters.education = Array.isArray(activeFilters.education)
        ? [...activeFilters.education]
        : Object.values(activeFilters.education);
    } else {
      initialFilters.education = [];
    }

    // Asegurar que experience sea un número
    if (activeFilters?.experience !== undefined) {
      initialFilters.experience = Number(activeFilters.experience) || 0;
    }

    // Asegurar que age sea un número
    if (activeFilters?.age !== undefined) {
      initialFilters.age = Number(activeFilters.age) || 0;
    }

    // Asegurar que minSalary y maxSalary sean números
    if (activeFilters?.minSalary !== undefined) {
      const val = Number(activeFilters.minSalary);
      initialFilters.minSalary = isNaN(val) ? undefined : val;
    }
    if (activeFilters?.maxSalary !== undefined) {
      const val = Number(activeFilters.maxSalary);
      initialFilters.maxSalary = isNaN(val) ? undefined : val;
    }

    // Asegurar que gender sea un array
    if (activeFilters?.gender) {
      initialFilters.gender = Array.isArray(activeFilters.gender)
        ? [...activeFilters.gender]
        : [activeFilters.gender];
    } else {
      initialFilters.gender = [];
    }

    // Asegurar que career sea un array
    if (activeFilters?.career) {
      initialFilters.career = Array.isArray(activeFilters.career)
        ? [...activeFilters.career]
        : [activeFilters.career];
    } else {
      initialFilters.career = [];
    }

    // Reset active filter when modal is opened or activeFilters change
    setActiveFilter(null);

    return initialFilters;
  });

  // Reset local state when modal is opened/closed or activeFilters change
  useEffect(() => {
    if (isOpen && activeFilters) {
      setFilters((prev) => {
        const newFilters = {
          ...prev,
          ...activeFilters,
          education: Array.isArray(activeFilters.education)
            ? [...activeFilters.education]
            : activeFilters.education === undefined
              ? []
              : [activeFilters.education],
          gender: Array.isArray(activeFilters.gender)
            ? [...activeFilters.gender]
            : activeFilters.gender === undefined
              ? []
              : [activeFilters.gender],
          experience:
            activeFilters.experience !== undefined
              ? Number(activeFilters.experience) || 0
              : 0,
          age:
            activeFilters.age !== undefined
              ? Number(activeFilters.age) || 0
              : 0,
          minSalary:
            activeFilters.minSalary !== undefined
              ? Number(activeFilters.minSalary)
              : undefined,
          maxSalary:
            activeFilters.maxSalary !== undefined
              ? Number(activeFilters.maxSalary)
              : undefined,
          career: Array.isArray(activeFilters.career)
            ? [...activeFilters.career]
            : activeFilters.career === undefined
              ? []
              : [activeFilters.career],
        };
        return newFilters;
      });
    }
  }, [isOpen, activeFilters]);

  // Reset active filter when modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      setActiveFilter(null);
    }
  }, [isOpen]);

  const setAllFiltersInFalse = () => {
    setActiveFilter(null);
  };

  const handleApply = () => {
    onApply(filters);
    setAllFiltersInFalse();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="max-w-md rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">Filtrar</h3>

          <CloseModalButton onClick={onClose} />
        </ModalHeader>

        <ModalBody className="flex items-center justify-center gap-5 px-4 py-3 text-darkPurple">
          <p className="w-full text-center text-sm font-normal">
            Selecciona los filtros para encontrar a los candidatos que mejor se
            ajusten al perfil.
          </p>
          <Dropdown
            className="rounded-md bg-white/80 backdrop-blur-sm"
            showArrow
            size="md"
            classNames={{
              content: "rounded-md",
              trigger:
                "aria-expanded:scale-1 data-[focus-visible=true]:border-0 rounded-md",
            }}
            aria-label="Menú de filtros"
          >
            <DropdownTrigger className="rounded-md hover:cursor-pointer focus:border-0">
              <div className="flex w-80 items-center justify-between rounded-md bg-white/80 px-4 py-2 text-sm text-darkPurple">
                {isEductionFiltering && (
                  <p className="line-clamp-1">
                    Nivel educacional
                    {filters.education?.length > 0
                      ? ` (${filters.education.length} seleccionados)`
                      : ""}
                  </p>
                )}
                {isCareerFiltering && (
                  <p className="line-clamp-1">
                    Carreras relacionadas
                    {filters.career?.length > 0
                      ? ` (${filters.career.length} seleccionados)`
                      : ""}
                  </p>
                )}
                {isAgeFiltering &&
                  (() => {
                    let ageLabel = "";
                    if (Array.isArray(filters.age) && filters.age[1] > 0) {
                      ageLabel = `: ${filters.age[0]}-${filters.age[1]} años`;
                    } else if (filters.age) {
                      ageLabel = `: ${filters.age} años`;
                    }
                    return (
                      <p className="line-clamp-1">
                        Edad máxima
                        {ageLabel}
                      </p>
                    );
                  })()}
                {isGenderFiltering && (
                  <p className="line-clamp-1">
                    Género del aplicante
                    {filters.gender?.length > 0
                      ? ` (${filters.gender.length} seleccionados)`
                      : ""}
                  </p>
                )}
                {/*{isRegionFiltering && <p>Región de residencia{filters.?.length > 0 ? ` (${filters.region.length})` : ''}</p>}*/}
                {isExperienceFiltering &&
                  (() => {
                    let experienceLabel = "";
                    if (
                      Array.isArray(filters.experience) &&
                      filters.experience[1] > 0
                    ) {
                      experienceLabel = `: ${filters.experience[0]}-${filters.experience[1]} años`;
                    } else if (filters.experience) {
                      experienceLabel = `: ${filters.experience} años`;
                    }
                    return (
                      <p className="line-clamp-1">
                        Años de experiencia
                        {experienceLabel}
                      </p>
                    );
                  })()}
                {isLanguageFiltering && (
                  <p className="line-clamp-1">
                    Idiomas
                    {filters.languages?.length > 0
                      ? ` (${filters.languages.length} seleccionados)`
                      : ""}
                  </p>
                )}
                {isSalaryFiltering && (
                  <p className="line-clamp-1">
                    P. de renta
                    {!!(filters.minSalary || filters.maxSalary) &&
                      (() => {
                        let result = ": ";
                        if (filters.minSalary) {
                          result +=
                            "min $" + filters.minSalary.toLocaleString("es-CL");
                        }
                        if (filters.minSalary && filters.maxSalary) {
                          result += " - ";
                        }
                        if (filters.maxSalary) {
                          result +=
                            "max $" + filters.maxSalary.toLocaleString("es-CL");
                        }
                        return result;
                      })()}
                  </p>
                )}
                {!activeFilter && <p>Seleccione un filtro</p>}
                <MdKeyboardArrowDown />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              onAction={(e) => {
                // Toggle the selected filter
                setActiveFilter((prev) => (prev === e ? null : (e as string)));
              }}
              classNames={{ base: "w-80 p-0 rounded-md" }}
              itemClasses={{
                base: [
                  "text-darkPurple",
                  "rounded-md",
                  "data-[hover=true]:bg-purple",
                  "data-[hover=true]:text-white",
                ],
              }}
            >
              <DropdownItem key={"Education"}>Nivel educacional</DropdownItem>
              <DropdownItem key={"Age"}>Edad máxima</DropdownItem>
              <DropdownItem key={"Gender"}>Género del aplicante</DropdownItem>
              <DropdownItem key={"Career"}>Carreras relacionadas</DropdownItem>

              {/*
              <DropdownItem
                key={"Region"}
                classNames={{ base: " text-darkPurple rounded-md" }}
              >
                Región de residencia
              </DropdownItem>
              */}
              <DropdownItem key={"Experience"}>
                Años de experiencia
              </DropdownItem>
              <DropdownItem key={"Language"}>Idiomas</DropdownItem>
              <DropdownItem key={"Salary"}>Pretensión de renta</DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/*Contenido del filtro */}

          {/* Filtro de nivel educacional */}
          {isEductionFiltering && (
            <EducationalFilter
              value={filters.education || []}
              onChange={(newEducation) => {
                setFilters((prev) => ({
                  ...prev,
                  education: newEducation,
                }));
              }}
            />
          )}

          {/* Filtro de años de experiencia */}
          {isExperienceFiltering && (
            <ExperienceFilter
              value={filters.experience}
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  experience: value,
                }));
              }}
            />
          )}

          {isAgeFiltering && (
            <AgeFilter
              value={filters.age}
              onChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  age: value,
                }));
              }}
            />
          )}

          {/* Filtro de pretencion de renta */}
          {isSalaryFiltering && (
            <SalaryFilter
              minSalary={filters.minSalary}
              maxSalary={filters.maxSalary}
              onMinSalaryChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  minSalary: value,
                }));
              }}
              onMaxSalaryChange={(value) => {
                setFilters((prev) => ({
                  ...prev,
                  maxSalary: value,
                }));
              }}
            />
          )}

          {/* Filtro de genero */}
          {isGenderFiltering && (
            <GenderFilter
              value={filters.gender || []}
              onChange={(newGender) => {
                setFilters((prev) => ({
                  ...prev,
                  gender: newGender,
                }));
              }}
            />
          )}

          {/* Filtro de idiomas */}
          {isLanguageFiltering && (
            <LangFilter
              value={filters.languages || []}
              onChange={(newLanguages) => {
                setFilters((prev) => ({
                  ...prev,
                  languages: newLanguages,
                }));
              }}
              projectId={projectId}
            />
          )}

          {/* Filtro de regiones */}
          {/*isRegionFiltering ? (
            <div className="flex flex-col items-end">
              <Checkbox
                radius="none"
                classNames={{
                  base: ["my-2"],
                  label: ["text-sm "],
                }}
                aria-label="Seleccionar todos los idiomas"
              >
                Seleccionar todo
              </Checkbox>
              <div className="flex h-fit max-h-[136px] w-[368px] flex-wrap items-start gap-4 overflow-y-scroll bg-white p-2 scrollbar-hide">
                <Checkbox
                  radius="full"
                  size="sm"
                  color="secondary"
                  classNames={{
                    label: ["text-sm "],
                    base: ["w-fit h-fit"],
                    hiddenInput: "rounded-lg",
                  }}
                >
                  Atacama
                </Checkbox>
                <Checkbox
                  radius="full"
                  size="sm"
                  color="secondary"
                  classNames={{
                    label: ["text-sm "],
                    base: ["w-fit h-fit"],
                    hiddenInput: "rounded-lg",
                  }}
                >
                  Metropolitana
                </Checkbox>
                <Checkbox
                  radius="full"
                  size="sm"
                  color="secondary"
                  classNames={{
                    label: ["text-sm "],
                    base: ["w-fit h-fit"],
                    hiddenInput: "rounded-lg",
                  }}
                >
                  Maule
                </Checkbox>
              </div>
            </div>
          ) : (
            <></>
          )*/}

          {/* Filtro de carreras */}
          {isCareerFiltering && (
            <CareerFilter
              value={filters.career}
              onChange={(newCareer) => {
                setFilters((prev) => ({
                  ...prev,
                  career: newCareer,
                }));
              }}
              projectId={projectId}
            />
          )}
        </ModalBody>

        <ModalFooter>
          <SecondaryButton
            label="Cancelar"
            onClick={() => {
              setAllFiltersInFalse();
              onClose();
            }}
          />

          <PrimaryButton label="Aplicar" onClick={handleApply} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
