import { useMemo } from "react";
import { CandidateUI } from "@/app/types/candidate.types";

export type TabId = "tab0" | "tab1" | "tab2" | "tab3" | "selected";

interface Tab {
  id: TabId;
  label: string;
  count: number;
  color?: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  candidates: CandidateUI[];
  selectedCount?: number;
  isDisabled?: boolean;
}

// Configuración de tabs centralizada
export const TAB_CONFIG = {
  apto: {
    id: "tab1" as const,
    label: "Apto",
    color: "bg-green-400/50 text-darkPurple",
    filter: (c: CandidateUI) => c.recommendation === "Apto",
  },
  observaciones: {
    id: "tab2" as const,
    label: "Observado",
    color: "bg-yellow-400/50 text-darkPurple",
    filter: (c: CandidateUI) => c.recommendation === "Observado",
  },
  noApto: {
    id: "tab3" as const,
    label: "No apto",
    color: "bg-red-400/50 text-darkPurple",
    filter: (c: CandidateUI) => c.recommendation === "No apto",
  },
} as const;

// Función helper para filtrar candidatos por tab
export const getFilteredCandidates = (
  candidates: CandidateUI[],
  activeTab: TabId,
): CandidateUI[] => {
  switch (activeTab) {
    case "tab0":
      return candidates;
    case "tab1":
      return candidates.filter(TAB_CONFIG.apto.filter);
    case "tab2":
      return candidates.filter(TAB_CONFIG.observaciones.filter);
    case "tab3":
      return candidates.filter(TAB_CONFIG.noApto.filter);
    default:
      return candidates;
  }
};

export const CustomTabs = ({
  activeTab,
  onTabChange,
  candidates,
  isDisabled = false,
}: TabsProps) => {
  // Calcular contadores de forma optimizada
  const tabCounts = useMemo(() => {
    return {
      apto: candidates.filter(TAB_CONFIG.apto.filter).length,
      observaciones: candidates.filter(TAB_CONFIG.observaciones.filter).length,
      noApto: candidates.filter(TAB_CONFIG.noApto.filter).length,
    };
  }, [candidates]);

  const tabs: Tab[] = [
    {
      id: TAB_CONFIG.apto.id,
      label: TAB_CONFIG.apto.label,
      count: tabCounts.apto,
      color: TAB_CONFIG.apto.color,
    },
    {
      id: TAB_CONFIG.observaciones.id,
      label: TAB_CONFIG.observaciones.label,
      count: tabCounts.observaciones,
      color: TAB_CONFIG.observaciones.color,
    },
    {
      id: TAB_CONFIG.noApto.id,
      label: TAB_CONFIG.noApto.label,
      count: tabCounts.noApto,
      color: TAB_CONFIG.noApto.color,
    },
  ];

  return (
    <div className="flex gap-1 rounded-lg bg-white/30 p-1">
      {/* Tab "Todos" */}
      <button
        onClick={() => onTabChange("tab0")}
        className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-darkPurple transition-all duration-400 ${
          activeTab === "tab0"
            ? "bg-activeTab font-medium shadow-sm"
            : "hover:bg-activeTab"
        }`}
      >
        <span>Todos</span>
        {!isDisabled && (
          <span className="ml-1.5 rounded-full bg-lightPurple px-1.5 py-0.5 text-xs text-purple">
            {candidates.length}
          </span>
        )}
      </button>

      {/* Tabs dinámicos */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-darkPurple transition-all duration-400 ${
            activeTab === tab.id
              ? "bg-activeTab font-medium shadow-sm"
              : "hover:bg-activeTab"
          }`}
        >
          <span>{tab.label}</span>
          {!isDisabled && (
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${tab.color}`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
