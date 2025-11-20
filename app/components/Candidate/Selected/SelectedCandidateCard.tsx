import { CandidateUI } from "@/app/types/candidate.types";
import {
  RecommendationType,
  getRecommendationStyles,
} from "@/app/utils/recommendationStyles.utils";
import {
  Select,
  SelectItem,
  Button,
  Chip,
  Checkbox,
  Input,
  SharedSelection,
} from "@heroui/react";
import { GrUserExpert } from "react-icons/gr";
import { IoLocationOutline } from "react-icons/io5";
import { TbReportMoney, TbPlus } from "react-icons/tb";
import { LuComputer } from "react-icons/lu";
import { PrimaryButton, SecondaryButton } from "../../Common/Buttons";
import { formatExperience } from "@/app/utils/candidate.utils";
import { capitalize } from "@/app/utils/string.utils";
import AddTechnologiesModal from "../../Modals/AddTechnologiesModal";
import { useState, useEffect } from "react";
import {
  formatSalaryToCLP,
  parseSalaryFromServer,
} from "@/app/utils/salary.utils";
import { FiEdit3 } from "react-icons/fi";
import { BiSave } from "react-icons/bi";
import { candidateService } from "@/app/api/candidateService";
import { toast } from "sonner";


interface SelectedCandidateCardProps {
  candidate: CandidateUI & { recommendation?: RecommendationType };
  onViewCV?: (candidateId: CandidateUI) => void;
  isSelected?: boolean;
  onToggleSelect?: (candidateId: string, isSelected: boolean) => void;
  onUpdate?: () => void; // Callback para refrescar datos
  onDirtyChange?: (isDirty: boolean) => void; // Callback para notificar cambios pendientes
}

const recommendations = [
  { key: "Apto", label: "Apto" },
  { key: "Observado", label: "Observado" },
  { key: "No apto", label: "No apto" },
];

export const SelectedCandidateCard = ({
  candidate,
  onViewCV,
  isSelected = false,
  onToggleSelect,
  onUpdate,
  onDirtyChange,
}: SelectedCandidateCardProps) => {
  const [isAddTechnologiesModalOpen, setIsAddTechnologiesModalOpen] =
    useState(false);

  const [formValues, setFormValues] = useState({
    salary: parseSalaryFromServer(candidate.salaryExpectation),
    address: candidate.address || "",
    technologies: [...(candidate.technologies?.all || [])],
    recommendation: candidate.recommendation || ("" as RecommendationType),
  });

  const [originalValues, setOriginalValues] = useState({
    salary: parseSalaryFromServer(candidate.salaryExpectation),
    address: candidate.address || "",
    technologies: [...(candidate.technologies?.all || [])],
    recommendation: candidate.recommendation || ("" as RecommendationType),
  });

  const [editingField, setEditingField] = useState<"salary" | "address" | null>(
    null,
  );

  // Verifica si hay cambios pendientes
  const hasChanges =
    // Verificar cambios en los campos del formulario
    formValues.salary !== originalValues.salary ||
    formValues.address !== originalValues.address ||
    // Verificar cambios en la recomendación
    formValues.recommendation !== originalValues.recommendation ||
    // Verificar cambios en las tecnologías
    JSON.stringify(formValues.technologies) !==
      JSON.stringify(originalValues.technologies);

  useEffect(() => {
    onDirtyChange?.(hasChanges);
  }, [hasChanges, onDirtyChange]);

  // Usar la utilidad global para formatear salario
  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // El usuario puede ingresar con puntos, así que limpiamos y convertimos
    const rawValue = e.target.value.replace(/\./g, "").replace(/\D/g, "");
    const numericValue = rawValue ? parseInt(rawValue, 10) : 0;
    setFormValues((prev) => ({
      ...prev,
      salary: numericValue,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      address: e.target.value,
    }));
  };

  const startEditing = (field: "salary" | "address") => {
    setEditingField(field);
  };

  const cancelEditing = () => {
    setFormValues((prev) => ({
      ...prev,
      [editingField as string]:
        originalValues[editingField as keyof typeof originalValues],
    }));
    setEditingField(null);
  };

  const handleAddTechnology = async (technology: string) => {
    const tech = technology.trim();
    if (!tech || formValues.technologies.includes(tech)) return;

    try {
      // Actualizar el estado local
      setFormValues((prev) => ({
        ...prev,
        technologies: [...prev.technologies, tech],
      }));

      return Promise.resolve();
    } catch (error) {
      console.error("Error al agregar tecnología:", error);
      return Promise.reject(new Error(String(error)));
    } finally {
      setIsAddTechnologiesModalOpen(false);
    }
  };

  const handleRemoveTechnology = (technology: string) => {
    setFormValues((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((tech) => tech !== technology),
    }));
  };

  const handleRecommendationChange = (keys: SharedSelection) => {
    const selectedKey = Array.from(keys)[0] as string;
    if (selectedKey) {
      // Solo actualizar el estado local del componente
      setFormValues((prev) => ({
        ...prev,
        recommendation: selectedKey as RecommendationType,
      }));
    }
  };

  // Obtener los estilos dinámicamente según la recomendación seleccionada
  const recommendationStyles = formValues.recommendation
    ? getRecommendationStyles(formValues.recommendation)
    : { bgColor: "bg-gray-100", textColor: "text-gray-500" };

  const sendUpdate = async () => {
    try {
      await candidateService.updateCandidate(candidate.id, {
        candidate: {
          salaryExpectation:
            parseSalaryFromServer(formValues.salary) ||
            parseSalaryFromServer(candidate.salaryExpectation),
          address: formValues.address || candidate.address,
          technologies: {
            all: formValues.technologies,
          },
          recommendation: formValues.recommendation || candidate.recommendation,
        },
      });

      // Actualizar originalValues para reflejar los cambios guardados
      setOriginalValues({
        salary: parseSalaryFromServer(formValues.salary),
        address: formValues.address,
        technologies: [...formValues.technologies],
        recommendation: formValues.recommendation,
      });

      toast.success("Candidato actualizado exitosamente");

      // Llamar al callback para refrescar los datos
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error al actualizar candidato:", error);
      toast.error("Error al actualizar candidato");
    } finally {
      cancelEditing();
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl bg-white/55 p-5 backdrop-blur-sm">
      <div className="flex w-full flex-row items-center justify-start gap-2 pb-4">
        <Checkbox
          size="md"
          color="secondary"
          isSelected={isSelected}
          isDisabled={false}
          aria-label={
            isSelected
              ? `Deseleccionar a ${candidate.name}`
              : `Seleccionar a ${candidate.name}`
          }
          onChange={(e) => {
            e.stopPropagation();
          }}
          onValueChange={() => {
            if (onToggleSelect) {
              onToggleSelect(candidate.id, !isSelected);
            }
          }}
        />

        <h3 className="line-clamp-1 text-lg font-bold text-primaryBlue">
          {capitalize(candidate.name)}
        </h3>

        <Select
          className="ml-auto w-32"
          placeholder="Seleccionar recomendación"
          radius="lg"
          variant="flat"
          aria-label={`Seleccionar recomendación para ${candidate.name}`}
          selectedKeys={
            formValues.recommendation ? [formValues.recommendation] : []
          }
          onSelectionChange={handleRecommendationChange}
          classNames={{
            trigger: `${recommendationStyles.bgColor} text-darkPurple border-none shadow-sm h-9 min-h-0 px-3`,
            value: `text-sm font-medium ${recommendationStyles.textColor}`,
            popoverContent: "rounded-xl ",
            innerWrapper: "gap-0",
          }}
        >
          {recommendations.map((rec) => (
            <SelectItem key={rec.key} className={`rounded-md text-black`}>
              {rec.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex flex-row items-center gap-2">
          <GrUserExpert className="translate-x-0.5 text-purple" />
          <p className="text-lightGray">
            Experiencia de{" "}
            {formatExperience(candidate.aggregatedValues.totalMonths)}
          </p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <div className="flex-shrink-0">
            <IoLocationOutline className="size-4 text-purple" />
          </div>
          {editingField === "address" ? (
            <div className="relative flex-1">
              <Input
                autoFocus
                variant="bordered"
                value={formValues.address}
                placeholder="Ingrese la ubicación"
                onChange={handleAddressChange}
                endContent={
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setEditingField(null)}
                  >
                    <BiSave className="size-4" />
                  </Button>
                }
                classNames={{
                  base: "w-full",
                  input: "text-sm text-black",
                  inputWrapper:
                    "bg-white rounded-md py-0 flex flex-row items-center justify-center border-0",
                }}
              />
            </div>
          ) : (
            <div className="flex w-fit items-center gap-2">
              <p className="line-clamp-1 min-w-0 flex-1 text-lightGray">
                {formValues.address || "No especificado"}
              </p>
              <div className="flex-shrink-0">
                <Button
                  variant="light"
                  isIconOnly
                  size="sm"
                  onPress={() => startEditing("address")}
                >
                  <FiEdit3 className="size-4 text-purple" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          <div className="flex-shrink-0">
            <TbReportMoney className="size-4 text-purple" />
          </div>
          {editingField === "salary" ? (
            <div className="relative flex-1">
              <Input
                autoFocus
                variant="bordered"
                value={formValues.salary.toString()}
                placeholder="Ingrese el salario"
                onChange={handleSalaryChange}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    cancelEditing();
                  }
                }}
                endContent={
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => setEditingField(null)}
                  >
                    <BiSave className="size-4" />
                  </Button>
                }
                classNames={{
                  base: "w-full",
                  input: "text-sm text-black",
                  inputWrapper:
                    "bg-white rounded-md py-0 flex flex-row items-center justify-center border-0",
                }}
              />
            </div>
          ) : (
            <div className="flex w-fit items-center gap-2">
              <p className="line-clamp-1 min-w-0 flex-1 text-lightGray">
                {formValues.salary
                  ? formatSalaryToCLP(formValues.salary)
                  : "No especificado"}
              </p>
              <div className="flex-shrink-0">
                <Button
                  variant="light"
                  isIconOnly
                  size="sm"
                  onPress={() => startEditing("salary")}
                >
                  <FiEdit3 className="size-4 text-purple" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-row items-center gap-2">
          <LuComputer className="text-lightGray" />
          <p className="text-lightGray">Tecnologías utilizadas</p>
        </div>

        <div className="gt-scroll-white flex max-h-20 w-full flex-wrap items-center gap-x-3 gap-y-1 overflow-y-scroll pe-2">
          <Button
            className="size-5 min-w-0 bg-transparent p-0 duration-300 ease-in-out hover:bg-purple hover:text-white"
            size="sm"
            isIconOnly
            radius="full"
            onPress={() => setIsAddTechnologiesModalOpen(true)}
          >
            <TbPlus className="size-3" />
          </Button>
          {formValues.technologies
            .toSorted((a, b) => a.localeCompare(b))
            .map((tech) => (
              <Chip
                key={tech}
                variant="flat"
                size="sm"
                radius="sm"
                className="bg-activeTab text-xs text-purple"
                onClose={() => handleRemoveTechnology(tech)}
              >
                {tech.charAt(0).toUpperCase() + tech.slice(1)}
              </Chip>
            ))}

          <Button
            className="size-5 min-w-0 bg-transparent p-0 duration-300 ease-in-out hover:bg-purple hover:text-white"
            size="sm"
            isIconOnly
            radius="full"
            onPress={() => setIsAddTechnologiesModalOpen(true)}
          >
            <TbPlus className="size-3" />
          </Button>
        </div>
      </div>

      {/* Espacio flexible para empujar los botones hacia abajo */}
      <div className="flex-1"></div>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between">
          {hasChanges && (
            <SecondaryButton
              label="Guardar cambios"
              onClick={() => {
                sendUpdate();
              }}
              withDot={true}
            />
          )}
          <PrimaryButton
            label="Ver CV"
            className="ms-auto"
            onClick={() => {
              onViewCV(candidate)
              console.log(candidate);
            }}
          />
        </div>
      </div>

      <AddTechnologiesModal
        isOpen={isAddTechnologiesModalOpen}
        onClose={() => setIsAddTechnologiesModalOpen(false)}
        onAdd={handleAddTechnology}
      />
    </div>
  );
};
