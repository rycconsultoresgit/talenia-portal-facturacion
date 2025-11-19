"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Chip,
} from "@heroui/react";
import { FiTrash } from "react-icons/fi";
import {
  CloseModalButton,
  PrimaryButton,
  SecondaryButton,
} from "../../Common/Buttons";
import { toast } from "sonner";

import { EducationLevel } from "./EducationalFilter";
import { FiltersInterface } from "@/app/types/filters";
import { GenderType } from "./GenderFilter";
import { LangFilter } from "./LangFilter";
import { useCallback, useEffect, useMemo, useState } from "react";

interface DeleteFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: Partial<FiltersInterface>) => void;
  activeFilters: FiltersInterface;
}

type FilterValue = string | LangFilter;

const EDUCATION_LABELS: Record<EducationLevel, string> = {
  secundaria: "Enseñanza Media",
  tecnico: "Técnico",
  universitario: "Universitario",
  postgrado: "Postgrado/Doctorado",
};

const GENDER_LABELS: Record<GenderType, string> = {
  masculino: "Masculino",
  femenino: "Femenino",
  no_especificado: "No especificado",
};

export default function DeleteFiltersModal({
  isOpen,
  onClose,
  onApply,
  activeFilters,
}: Readonly<DeleteFiltersModalProps>) {
  const [localFilters, setLocalFilters] = useState<FiltersInterface>(() => {
    const filters = { ...activeFilters };
    // Ensure arrays are properly formatted
    if (filters.education && !Array.isArray(filters.education)) {
      filters.education = Object.values(filters.education);
    }
    if (filters.languages && !Array.isArray(filters.languages)) {
      filters.languages = Object.values(filters.languages);
    }
    return filters;
  });

  // Sync local filters when active filters change
  useEffect(() => {
    setLocalFilters(activeFilters);
  }, [activeFilters]);

  const handleRemoveFilter = useCallback(
    (filterType: keyof FiltersInterface, value?: FilterValue) => {
      setLocalFilters((prev) => {
        const newFilters = { ...prev };

        switch (filterType) {
          case "education":
            if (value && typeof value === "string") {
              newFilters.education = newFilters.education?.filter(
                (level) => level !== value,
              );
            }
            break;
          case "gender":
            if (value && typeof value === "string") {
              newFilters.gender = newFilters.gender?.filter(
                (gender) => gender !== value,
              );
            }
            break;
          case "career":
            if (value && typeof value === "string") {
              newFilters.career = newFilters.career?.filter(
                (career) => career !== value,
              );
            }
            break;
          case "languages":
            if (value && typeof value === "object" && "id" in value) {
              newFilters.languages = newFilters.languages?.filter(
                (lang) => lang.id !== value.id,
              );
            }
            break;
          default:
            newFilters[filterType] = undefined;
            break;
        }

        return newFilters;
      });
    },
    [],
  );

  const handleRemoveAll = useCallback(() => {
    const clearedFilters: FiltersInterface = {
      education: [],
      gender: [],
      languages: [],
      career: [],
      age: undefined,
      minSalary: undefined,
      maxSalary: undefined,
      experience: undefined,
    };
    setLocalFilters(clearedFilters);
  }, []);

  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    return JSON.stringify(localFilters) !== JSON.stringify(activeFilters);
  }, [localFilters, activeFilters]);

  const handleApply = useCallback(() => {
    onApply(localFilters);
    if (hasPendingChanges) {
      toast.success("Filtros modificados correctamente");
    }
    onClose();
  }, [localFilters, onApply, onClose, hasPendingChanges]);

  const handleClose = useCallback(() => {
    setLocalFilters(activeFilters);
    onClose();
  }, [activeFilters, onClose]);

  // Calculate total filter count
  const filterCount = useMemo(() => {
    const counts = [
      localFilters.education?.length || 0,
      localFilters.languages?.length || 0,
      localFilters.gender?.length || 0,
      localFilters.career?.length || 0,
      localFilters.experience && localFilters.experience > 0 ? 1 : 0,
      localFilters.age && localFilters.age > 0 ? 1 : 0,
      localFilters.minSalary && localFilters.minSalary > 0 ? 1 : 0,
      localFilters.maxSalary && localFilters.maxSalary > 0 ? 1 : 0,
    ];
    return counts.reduce((total, count) => total + count, 0);
  }, [localFilters]);

  const renderEducationFilters = useCallback(() => {
    const education = localFilters.education || [];
    if (education.length === 0) return null;

    return education.map((level) => (
      <Chip
        key={level}
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("education", level)}
      >
        {EDUCATION_LABELS[level] || level}
      </Chip>
    ));
  }, [localFilters.education, handleRemoveFilter]);

  const renderExperienceFilter = useCallback(() => {
    if (!localFilters.experience || localFilters.experience === 0) return null;

    return (
      <Chip
        key="experience"
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("experience")}
      >
        {`${localFilters.experience}+ años de experiencia`}
      </Chip>
    );
  }, [localFilters.experience, handleRemoveFilter]);

  const renderAgeFilter = useCallback(() => {
    if (!localFilters.age || localFilters.age === 0) return null;

    return (
      <Chip
        key="age"
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("age")}
      >
        {`Hasta ${localFilters.age} años de edad`}
      </Chip>
    );
  }, [localFilters.age, handleRemoveFilter]);

  const formatSalary = useCallback((value: number) => {
    return new Intl.NumberFormat("es-CL").format(value);
  }, []);

  const renderSalaryFilter = useCallback(() => {
    const hasMin = localFilters.minSalary && localFilters.minSalary > 0;
    const hasMax = localFilters.maxSalary && localFilters.maxSalary > 0;

    if (!hasMin && !hasMax) return null;

    return (
      <>
        {hasMin && (
          <Chip
            key="minSalary"
            variant="flat"
            size="md"
            radius="sm"
            className="rounded-xl bg-white text-cardText"
            onClose={() => handleRemoveFilter("minSalary")}
          >
            {`Salario > $${formatSalary(localFilters.minSalary)}`}
          </Chip>
        )}
        {hasMax && (
          <Chip
            key="maxSalary"
            variant="flat"
            size="md"
            radius="sm"
            className="rounded-xl bg-white text-cardText"
            onClose={() => handleRemoveFilter("maxSalary")}
          >
            {`Salario < $${formatSalary(localFilters.maxSalary)}`}
          </Chip>
        )}
      </>
    );
  }, [
    localFilters.minSalary,
    localFilters.maxSalary,
    handleRemoveFilter,
    formatSalary,
  ]);

  const renderGenderFilter = useCallback(() => {
    const genders = localFilters.gender || [];
    if (genders.length === 0) return null;

    return genders.map((gender) => (
      <Chip
        key={gender}
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("gender", gender)}
      >
        {GENDER_LABELS[gender] || gender}
      </Chip>
    ));
  }, [localFilters.gender, handleRemoveFilter]);

  const renderCareerFilter = useCallback(() => {
    const careers = localFilters.career || [];
    if (careers.length === 0) return null;

    return careers.map((career) => (
      <Chip
        key={career}
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("career", career)}
      >
        {career.charAt(0).toUpperCase() + career.slice(1)}
      </Chip>
    ));
  }, [localFilters.career, handleRemoveFilter]);

  const renderLanguageFilter = useCallback(() => {
    const languages = localFilters.languages || [];
    if (languages.length === 0) return null;

    return languages.map((language) => (
      <Chip
        key={language.id}
        variant="flat"
        size="md"
        radius="sm"
        className="rounded-xl bg-white text-cardText"
        onClose={() => handleRemoveFilter("languages", language)}
      >
        {language.name.charAt(0).toUpperCase() + language.name.slice(1)} -{" "}
        {language.level.charAt(0).toUpperCase() + language.level.slice(1)}
      </Chip>
    ));
  }, [localFilters.languages, handleRemoveFilter]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      placement="center"
      backdrop="blur"
      isDismissable={false}
      className="min-h-[460px] max-w-xl rounded-xl bg-white/80 backdrop-blur-sm"
      disableAnimation={true}
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center justify-between px-4 py-3">
          <h3 className="text-base font-medium text-primaryBlue">
            Filtros aplicados
          </h3>

          <CloseModalButton onClick={handleClose} />
        </ModalHeader>

        <ModalBody className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-lightGray">
              {filterCount} filtro{filterCount !== 1 ? "s" : ""} aplicado
              {filterCount !== 1 ? "s" : ""}
            </div>
            <div
              onClick={handleRemoveAll}
              className="flex items-center justify-between gap-2 rounded-md bg-white/50 p-2 text-sm font-medium text-purple hover:cursor-pointer"
            >
              <FiTrash />
              Quitar todo
            </div>
          </div>

          {hasPendingChanges && (
            <div className="mb-4 flex items-center justify-center gap-2 rounded-md bg-lightPurple ring-1 ring-lightPurple2/20 p-2 text-sm font-medium text-purple">
              <span className="h-2 w-2 rounded-full bg-lightPurple2"></span>
              <span>Hay cambios pendientes por aplicar</span>
            </div>
          )}

          <hr />

          <div className="flex w-full flex-wrap gap-4 overflow-y-auto">
            {/* Filtros de educación */}
            {renderEducationFilters()}
            {/* Filtro de experiencia */}
            {renderExperienceFilter()}
            {/* Filtro de edad */}
            {renderAgeFilter()}
            {/* Filtro de salario */}
            {renderSalaryFilter()}
            {/* Filtro de género */}
            {renderGenderFilter()}
            {/* Filtro de carrera */}
            {renderCareerFilter()}
            {/* Filtro de idioma */}
            {renderLanguageFilter()}
          </div>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton label="Cancelar" onClick={handleClose} />
          <PrimaryButton label="Aplicar" onClick={handleApply} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
