"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import SearchBar from "../../components/SearchBar/SearchBar";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { FilterButton } from "../../components/Filter/FilterButton";
import { useSSE } from "@/app/hooks/useCVBatchSSE";
import FilterModal3 from "@/app/components/Modals/Filters/MainFilterModal";
import DeleteFiltersModal from "@/app/components/Modals/Filters/DeleteFiltersModal";
import { CandidateUI } from "@/app/types/candidate.types";
import { BatchCompletedEvent, CVEvent, SSEEvent } from "@/app/types/sse.types";
import { useFileDrop } from "@/app/hooks/useFileDrop";
import { convertCVToCandidate } from "@/app/utils/candidate.utils";
import { validateFiles, showFileError } from "@/app/utils/file.utils";
import DragDropOverlay from "@/app/components/DragDropOverlay/DragAndDropOverlay";
import CandidateList from "../../components/Candidate/CandidateList";
import { SelectAll } from "@/app/components/Filter/SelectAll";
import ProjectInfoModal from "@/app/components/Modals/ProjectInfoModal";
import ConfirmationDeleteModal from "@/app/components/Modals/ConfirmationModal";
import { FiltersInterface } from "@/app/types/filters";
import { mapFiltersForApi } from "@/app/utils/mapfilter.utils";
import EditableProjectName from "@/app/components/Candidate/EditableProjectName";
import { FilterBadgeButton } from "@/app/components/Filter/FilterBadgeButton";
import { Project } from "@/app/types/project.types";
import { projectService } from "@/app/api/projectsService";
import { cvImportService } from "@/app/api/cvImportService";
import { candidateService } from "@/app/api/candidateService";
import {
  CustomTabs,
  getFilteredCandidates,
} from "@/app/components/UI/CustomTab";
import { RecommendationType } from "@/app/utils/recommendationStyles.utils";
import { useCvQuota } from "@/app/context/CvQuotaContext";
import BackgroundImage from "@/app/components/Common/BackgroundImage";
import DrawerMenu from "@/app/components/Drawer/DrawerMenu";
import MainContainer from "@/app/components/Common/MainContainer";

import main_bg from "./../../assets/candidates_container_bg.png";
import TaleniaNavbar from "@/app/components/Common/TaleniaNavbar";
import MainFooter from "@/app/components/Common/MainFooter";
import { Button } from "@heroui/react";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineUpload } from "react-icons/hi";
import { PrimaryButton } from "@/app/components/Common/Buttons";

export default function ProjectDetails() {
  const defaultFilters: FiltersInterface = {
    education: [],
    gender: [],
    languages: [],
    career: [],
    age: 0,
    minSalary: undefined,
    maxSalary: undefined,
    experience: 0,
  };

  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [project, setProject] = useState<Project | null>(null);
  const { refreshQuota } = useCvQuota();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Estados para carga de archivos CV
  const [isUploading, setIsUploading] = useState(true);
  const [cvs, setCvs] = useState<CVEvent[]>([]);
  const { userId, checkAuth } = useAuth();
  // Asegurarnos de que userId sea un número
  const numericUserId = userId ? Number(userId) : null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasAddedToRecentRef = useRef(false); // Para evitar doble registro de proyectos recientes
  const [batchId, setBatchId] = useState("");
  const [selectedAll, setSelectedAll] = useState(false); //Booleano que maneja el checkbox de seleccionar todo
  const [selectedCvs, setSelectedCvs] = useState<string[]>([]); //Lista de IDs de curriculums para borrar
  const [realSelectedCount, setRealSelectedCount] = useState(0); // Contador real de CVs seleccionados (no afectado por filtros)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //Booleano que maneja la apertura del modal de confirmacion de eliminacion de analisis
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isDeleteFiltersOpen, setIsDeleteFiltersOpen] = useState(false);
  const searchTimerRef = useRef<number | null>(null); // Para manejar el debounce de búsqueda

  const [filters, setFilters] = useState<FiltersInterface>(defaultFilters);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [allCandidates, setAllCandidates] = useState<
    Array<CandidateUI & { recommendation?: RecommendationType }>
  >([]);
  const [hasAnyCandidates, setHasAnyCandidates] = useState(false); // Track si existen candidatos en el proyecto
  const [activeTab, setActiveTab] = useState<
    "tab0" | "tab1" | "tab2" | "tab3" | "selected"
  >("tab0");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const candidateListRef = useRef<HTMLDivElement>(null);
  const scrolledToCandidateRef = useRef(false);

  // Leer el parámetro candidateId de la URL y establecer el candidato seleccionado
  useEffect(() => {
    const candidateIdFromUrl = searchParams.get("candidateId");
    if (candidateIdFromUrl) {
      setSelectedCandidateId(candidateIdFromUrl);
      scrolledToCandidateRef.current = false; // Resetear para permitir el scroll
    }
  }, [searchParams]);

  // Efecto para hacer scroll al candidato cuando se selecciona desde la página de seleccionados
  useEffect(() => {
    if (
      selectedCandidateId &&
      !scrolledToCandidateRef.current &&
      allCandidates.length > 0
    ) {
      const timeoutId = setTimeout(() => {
        const candidateElement = document.getElementById(
          `candidate-${selectedCandidateId}`,
        );
        if (candidateElement) {
          candidateElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          scrolledToCandidateRef.current = true;
        }
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [selectedCandidateId, allCandidates]);

  const processFileUpload = async (files: File[]) => {
    if (!files || files.length === 0) return;

    if (!numericUserId) {
      toast.error("Error", {
        description: "No se pudo identificar al usuario",
      });
      return;
    }

    setIsUploading(true);

    try {
      const response = await cvImportService.uploadMultipleCVs({
        files,
        projectId: String(id),
        userId: numericUserId,
      });
      setBatchId(response.batchId);
      toast.info(`${response.filesCount} archivo(s) subidos y procesándose`);

      // Actualizar la cuota inmediatamente después de subir los CVs
      refreshQuota();
    } catch (error) {
      // Detener el spinner cuando hay un error
      setIsUploading(false);
      showFileError(error);
    }
  };

  // Función para manejar la subida de múltiples archivos
  const handleMultipleFileUpload = async (files: File[]) => {
    // Evitar subidas mientras haya procesamiento en curso o error
    if (isUploading || hasLoadError) {
      toast.warning("Procesamiento en curso", {
        description: hasLoadError
          ? "No puedes subir archivos hasta resolver el error de carga"
          : "Espera a que termine el lote actual antes de subir más archivos.",
      });
      return;
    }
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      await processFileUpload(validFiles);
    }
  };

  const errorToastShown = useRef(false);

  useEffect(() => {
    return () => {
      // Reset the error state when component unmounts
      errorToastShown.current = false;
    };
  }, []);

  // Función para obtener el conteo real de CVs seleccionados (sin filtros)
  const fetchRealSelectedCount = useCallback(async () => {
    try {
      const res = await cvImportService.getFiltredCvs(id as string, "", {
        projectId: id as string,
      });
      const data = await res.data;
      const selectedCount = data.filter((cv) => cv.selected).length;
      setRealSelectedCount(selectedCount);
    } catch (error) {
      console.error("Error al obtener conteo de seleccionados:", error);
    }
  }, [id]);

  const fetchCVs = useCallback(
    async (term: string = "") => {
      try {
        // NO cambiar isUploading aquí - solo cuando llegue batch_completed
        // setIsUploading(true);

        const filtersWithQuery = {
          ...filters,
          query: term ? [term] : [],
        };

        const params = mapFiltersForApi(filtersWithQuery, id as string);

        const res = await cvImportService.getFiltredCvs(
          id as string,
          term,
          params,
        );
        const data = await res.data;

        // Reset error state on successful fetch
        errorToastShown.current = false;
        setHasLoadError(false);

        setCvs(data);

        // Si es la carga inicial (sin filtros ni búsqueda) y no hay CVs, entonces realmente no hay candidatos
        const isInitialLoad =
          !term &&
          Object.values(filters).every(
            (val) =>
              val === undefined ||
              val === 0 ||
              (Array.isArray(val) && val.length === 0),
          );

        if (isInitialLoad && data.length === 0) {
          setHasAnyCandidates(false);
        }

        // NO cambiar isUploading aquí - solo cuando llegue batch_completed
        // setIsUploading(false);
      } catch (error) {
        console.error(error);
        setHasLoadError(true);
        setIsUploading(false);
        if (!errorToastShown.current) {
          errorToastShown.current = true;
          toast.error("Error al cargar los candidatos");

          errorToastShown.current = false;
        }
      }
    },
    [filters, id],
  );

  // Función para carga inicial y cambios de filtros (incluye manejo de isUploading)
  const fetchCVsWithLoading = useCallback(
    async (term: string = "") => {
      // Solo mostrar loading si NO hay un batch activo
      if (!batchId) {
        setIsUploading(true);
      }
      await fetchCVs(term);
      // Solo ponemos isUploading en false si NO hay un batch activo
      if (!batchId) {
        setIsUploading(false);
      }
    },
    [fetchCVs, batchId],
  );

  useEffect(() => {
    const processedCandidates = cvs
      .map((cv) => convertCVToCandidate(cv))
      .filter((candidate): candidate is CandidateUI => candidate !== null);

    setAllCandidates((prevCandidates) => {
      // Si no hay candidatos previos, usar los nuevos directamente
      if (prevCandidates.length === 0) {
        return processedCandidates;
      }

      // Preservar el estado de selección de candidatos existentes
      const updatedCandidates = processedCandidates.map((newCandidate) => {
        const existingCandidate = prevCandidates.find(
          (prev) => prev.id === newCandidate.id,
        );
        if (existingCandidate) {
          // Si el candidato ya existía, preservar su estado de selección
          return { ...newCandidate, selected: existingCandidate.selected };
        }
        // Si es nuevo, usar el estado que viene del CV
        return newCandidate;
      });

      return updatedCandidates;
    });

    // Actualizar si hay candidatos en el proyecto (sin importar filtros)
    // NOTA: Solo actualizamos a true aquí. El false solo se actualiza al borrar CVs explícitamente.
    if (processedCandidates.length > 0) {
      setHasAnyCandidates(true);
    }

    // Actualizar selectedCvs basado en los CVs que tienen selected: true
    const currentlySelectedCvs = cvs
      .filter((cv) => cv.selected)
      .map((cv) => cv.id);

    setSelectedCvs((prevSelected) => {
      // Solo actualizar si hay cambios reales
      if (
        JSON.stringify(currentlySelectedCvs.sort()) !==
        JSON.stringify(prevSelected.sort())
      ) {
        return currentlySelectedCvs;
      }
      return prevSelected;
    });
  }, [cvs]);

  useEffect(() => {
    if (id) {
      fetchCVsWithLoading();
      // Actualizar el conteo real de seleccionados cada vez que cambian los filtros
      fetchRealSelectedCount();
    }
  }, [filters, id, fetchCVsWithLoading, fetchRealSelectedCount]);

  // Hook personalizado para manejar el arrastrar y soltar archivos
  const {
    isBlocked,
    isDragging,
    dropZoneRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useFileDrop({
    onFilesDropped: handleMultipleFileUpload,
    disabled: isUploading || hasLoadError,
    blockedMessage: hasLoadError
      ? "No puedes subir archivos hasta resolver el error de carga"
      : "No puedes subir archivos mientras se procesa el lote actual",
  });

  // Verificar autenticación y cargar datos del proyecto
  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar autenticación primero
        const authStatus = await checkAuth();
        setIsAuthenticated(authStatus);

        // Cargar datos del proyecto
        if (id) {
          try {
            const projectData = await projectService.getProject(id as string);
            setProject(projectData);
          } catch (err) {
            console.error("Error loading project:", err);
          }
        }

        // Si el usuario está autenticado, cargar datos adicionales
        if (authStatus && numericUserId && id && !hasAddedToRecentRef.current) {
          hasAddedToRecentRef.current = true; // Marcar como registrado

          // Track recent project
          try {
            await projectService.addRecentProject({
              userId: numericUserId,
              projectId: id as string,
            });
          } catch (err) {
            console.error("Error adding to recent projects:", err);
            // Si hay un error, permitir reintentar en la próxima carga
            hasAddedToRecentRef.current = false;
          }
        }
      } catch (err) {
        console.error("Error loading project data:", err);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, userId, numericUserId, checkAuth]);

  const handleSSEEvent = useCallback(
    (sseEvent: SSEEvent) => {
      if (sseEvent.type === "cv_created") {
        fetchCVs("");
        fetchRealSelectedCount(); // Actualizar contador por si un CV nuevo viene seleccionado
      } else if (sseEvent.type === "batch_completed") {
        const batchData = sseEvent.data as BatchCompletedEvent;

        // Actualizar la cuota cuando se completa el batch
        refreshQuota();

        // Actualizar el contador de seleccionados
        fetchRealSelectedCount();

        // Mostrar toast con detalles del procesamiento
        if (batchData.failedCount > 0) {
          toast.warning("Procesamiento completado con errores", {
            description: `Se procesaron ${batchData.successCount} de ${batchData.totalFiles} CVs. ${batchData.failedCount} CV(s) fallaron.`,
            duration: 10000,
          });
        } else {
          toast.success("Procesamiento completado exitosamente", {
            description: `${batchData.successCount} CV(s) procesados correctamente.`,
            duration: 5000,
          });
        }
      }
    },
    [fetchCVs, refreshQuota, fetchRealSelectedCount],
  );

  useSSE({
    batchId: batchId,
    onEvent: (sseEvent) => {
      handleSSEEvent(sseEvent);
    },
    setLoad: () => {
      setIsUploading(false);
    },
  });

  const addCvToSelectedCv = async (id: string) => {
    try {
      // Actualizar el estado local
      setSelectedCvs((prev) => [...prev, id]);

      // Actualizar en la base de datos
      await candidateService.updateCandidate(id, {
        candidate: {
          selected: true,
        },
      });

      // Actualizar el estado del candidato en allCandidates
      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id ? { ...candidate, selected: true } : candidate,
        ),
      );

      // Actualizar el contador real de seleccionados
      await fetchRealSelectedCount();
    } catch (error) {
      // Revertir el cambio en el estado local si hay un error
      console.log(error);
      setSelectedCvs((prev) => prev.filter((value) => value !== id));
    }
  };

  const removeCvToSelectedCv = async (id: string) => {
    try {
      // Actualizar el estado local
      setSelectedCvs((prev) => prev.filter((value) => value !== id));

      // Actualizar en la base de datos
      await candidateService.updateCandidate(id, {
        candidate: {
          selected: false,
        },
      });

      // Actualizar el estado del candidato en allCandidates
      setAllCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === id ? { ...candidate, selected: false } : candidate,
        ),
      );

      // Actualizar el contador real de seleccionados
      await fetchRealSelectedCount();
    } catch (error) {
      // Revertir el cambio en el estado local si hay un error
      console.log(error);
      setSelectedCvs((prev) => [...prev, id]);
    }
  };

  const handleDeleteCvs = async () => {
    if (selectedAll) {
      //Si es asi - llamar a la funcion de borrado total
      //Antes de borrar - pedir confirmacion
      const res = await cvImportService.deleteAllCV(`${id}`);
      if (res) {
        setCvs([]);
        setSelectedCvs([]);
        setSelectedAll(false);
        setHasAnyCandidates(false); // Resetear el estado cuando se borran todos
        setRealSelectedCount(0); // Resetear el contador

        toast.success("CVs borrados exitosamente");
      }
    }

    //El usuario ha seleccionado algun analisis para ser borrado ??
    if (selectedCvs.length !== 0) {
      //Si es asi - borraremos cada elemento que haya sido seleccionado por el usuario

      //Antes de borrar - pedir confirmacion
      const res = await Promise.all(
        selectedCvs.map((cvs) => {
          cvImportService.deleteCV(cvs);
          setCvs((prevCVs) => {
            const updatedCvs = prevCVs.filter((cv) => cv.id !== cvs);
            // Si después de eliminar no quedan CVs, actualizar hasAnyCandidates
            if (updatedCvs.length === 0) {
              setHasAnyCandidates(false);
            }
            return updatedCvs;
          });
        }),
      );
      if (res) {
        setSelectedCvs([]);
        // Actualizar el contador real de seleccionados
        await fetchRealSelectedCount();

        // Mostrar notificación de éxito
        if (selectedCvs.length === 1) {
          toast.success("CV eliminado exitosamente", {
            position: "bottom-right",
          });
        } else {
          toast.success(`${selectedCvs.length} CVs eliminados exitosamente`, {
            position: "bottom-right",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (id) {
      // Limpiar cualquier búsqueda pendiente
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      // Establecer un nuevo temporizador
      searchTimerRef.current = window.setTimeout(() => {
        fetchCVs();
      }, 300);

      // Limpiar el temporizador al desmontar o cuando cambien las dependencias
      return () => {
        if (searchTimerRef.current) {
          clearTimeout(searchTimerRef.current);
        }
      };
    }
  }, [filters, id, fetchCVs]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="relative h-screen w-full select-none overflow-hidden">
      <BackgroundImage isLoginPage={false} />

      {/* Overlay para drag and drop */}
      <DragDropOverlay
        isDragging={isDragging || isBlocked}
        message={
          isBlocked
            ? hasLoadError
              ? "No puedes subir archivos hasta resolver el error de carga"
              : "No puedes subir archivos mientras se procesa el lote actual"
            : undefined
        }
      />

      {/* Drawer Menu - renderizado globalmente */}
      <DrawerMenu
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
      />

      <MainContainer src={main_bg} isLoginPage={false}>
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="z-10 flex h-full w-full flex-col overflow-hidden"
        >
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <TaleniaNavbar
              isDrawerOpen={isDrawerOpen}
              onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
            />

            <div className="flex shrink-0 flex-col gap-2 rounded-xl bg-white/30 p-2 ring-1 ring-white/50">
              <div className="flex items-center gap-2">
                <Button
                  variant="light"
                  isIconOnly
                  size="sm"
                  radius="full"
                  onPress={() => {
                    if (project?.folderId) {
                      router.push(`/folders/${project.folderId}`);
                    } else {
                      router.back();
                    }
                  }}
                  className="group data-[hover]:bg-purple"
                  aria-label="Volver"
                >
                  <IoIosArrowBack
                    size={20}
                    className="text-lightGray group-hover:text-white"
                  />
                </Button>
                <EditableProjectName
                  projectId={id as string}
                  userId={numericUserId}
                  setIsInfoModalOpen={setIsInfoModalOpen}
                />

                {hasAnyCandidates && (
                  <div className="ms-auto">
                    <input
                      multiple
                      type="file"
                      id="file-upload"
                      className={`hidden ${hasLoadError ? "opacity-50" : ""}`}
                      accept=".pdf,.doc,.docx"
                      disabled={isUploading || hasLoadError}
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          handleMultipleFileUpload(Array.from(files));
                          e.target.value = "";
                        }
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`flex w-fit items-center gap-2 whitespace-nowrap rounded-md border border-dashed border-lightGray bg-white/20 px-11 py-2 backdrop-blur-sm transition-colors ${
                        isUploading || hasLoadError
                          ? "opacity-50"
                          : "cursor-pointer hover:bg-white/30"
                      }`}
                    >
                      <HiOutlineUpload className="size-4 flex-shrink-0 text-purple" />
                      <span className="text-sm font-normal text-lightGray">
                        {isUploading ? "Procesando..." : "Importar archivos"}
                      </span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                  <SelectAll
                    selectedAll={selectedAll}
                    setSelectedAll={setSelectedAll}
                    selectedCvs={selectedCvs}
                    setSelectedCvs={setSelectedCvs}
                    setIsDeleteModalOpen={setIsDeleteModalOpen}
                    isDisabled={hasLoadError || !hasAnyCandidates}
                    allCandidates={allCandidates}
                  />

                  <div
                    className={
                      "flex flex-row gap-2" +
                      (!hasAnyCandidates
                        ? " pointer-events-none opacity-50"
                        : "")
                    }
                  >
                    <CustomTabs
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                      candidates={allCandidates}
                      selectedCount={selectedCvs.length}
                      isDisabled={!hasAnyCandidates}
                    />

                    {realSelectedCount > 0 && (
                      <PrimaryButton
                        label={`Seleccionados (${realSelectedCount})`}
                        onClick={() => {
                          router.push(`/projects/${id}/selected`);
                        }}
                      />
                    )}
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-2">
                    <FilterBadgeButton
                      activeFilters={filters}
                      onDeleteClick={(e) => {
                        e.stopPropagation();
                        if (!hasLoadError && hasAnyCandidates) {
                          setIsDeleteFiltersOpen(true);
                        }
                      }}
                      isDisabled={hasLoadError || !hasAnyCandidates}
                    />
                    <FilterButton
                      onClick={() => setIsFilterOpen(true)}
                      isDisabled={hasLoadError || !hasAnyCandidates}
                    />
                    <SearchBar
                      onSearch={async (term) => {
                        if (hasLoadError || !hasAnyCandidates) return;
                        clearTimeout(searchTimerRef.current);
                        searchTimerRef.current = window.setTimeout(() => {
                          fetchCVs(term);
                        }, 300);
                      }}
                      onClearSearch={async () => {
                        if (hasLoadError || !hasAnyCandidates) return;
                        clearTimeout(searchTimerRef.current);
                        searchTimerRef.current = window.setTimeout(() => {
                          fetchCVs();
                        }, 300);
                      }}
                      isDisabled={hasLoadError || !hasAnyCandidates}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1">
              {activeTab !== "selected" && (
                <div ref={candidateListRef} className="h-full overflow-y-auto">
                  <CandidateList
                    candidates={getFilteredCandidates(allCandidates, activeTab)}
                    isUploading={isUploading}
                    hasError={hasLoadError}
                    selectedCvs={selectedCvs}
                    selectedAll={selectedAll}
                    onAddToDelete={addCvToSelectedCv}
                    onRemoveFromDelete={removeCvToSelectedCv}
                    onRetry={async () => {
                      setHasLoadError(false);
                      await fetchCVs("");
                    }}
                    onUpload={handleMultipleFileUpload}
                    selectedCandidateId={selectedCandidateId}
                    hasAnyCandidates={hasAnyCandidates}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <MainFooter />
          </div>
        </div>

        <DeleteFiltersModal
          isOpen={isDeleteFiltersOpen}
          onClose={() => setIsDeleteFiltersOpen(false)}
          onApply={(updatedFilters) => {
            setFilters({
              ...filters,
              ...updatedFilters,
            });
          }}
          activeFilters={filters}
        />

        <FilterModal3
          projectId={id as string}
          isOpen={isFilterOpen}
          onClose={() => {
            setIsFilterOpen(false);
          }}
          onApply={(newFilters) => {
            const education = Array.isArray(newFilters.education)
              ? [...newFilters.education]
              : newFilters.education || [];

            const languages = Array.isArray(newFilters.languages)
              ? [...newFilters.languages]
              : newFilters.languages || [];

            // Ensure experience is a number
            const experience =
              typeof newFilters.experience === "number"
                ? newFilters.experience
                : 0;

            const career = Array.isArray(newFilters.career)
              ? [...newFilters.career]
              : newFilters.career || [];

            const age = typeof newFilters.age === "number" ? newFilters.age : 0;

            const gender = Array.isArray(newFilters.gender)
              ? [...newFilters.gender]
              : newFilters.gender || [];

            // Create a new filters object ensuring education is always an array
            const updatedFilters = {
              ...filters,
              ...newFilters,
              experience, // Ensure it's a number
              age,
              education,
              languages,
              career,
              gender,
            };

            setFilters(updatedFilters);
          }}
          activeFilters={filters}
          key={`filter-${isFilterOpen}`} // Use isOpen state to force remount when reopening
        />

        <ConfirmationDeleteModal
          title="Eliminar análisis"
          description={
            selectedAll
              ? "¿Estás seguro de eliminar todos los análisis?"
              : "¿Estás seguro de eliminar este análisis?"
          }
          primaryLabel="Eliminar"
          secondaryLabel="Cancelar"
          isOpen={isDeleteModalOpen}
          onSecondaryClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
          onPrimaryClick={handleDeleteCvs}
        />

        {project && (
          <ProjectInfoModal
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            info={{
              projectName: project.projectName,
              projectDescription: project.projectDescription,
            }}
          />
        )}
      </MainContainer>
    </div>
  );
}
