// import { AnalysisResult } from "./candidate";

import { CandidateAPI } from "./candidate.types";

export type SseEventType = "cv_created" | "batch_completed";

export interface AggregatedValues {
  totalScore: number;
  totalMonths: number;
  relevantMonths: number;
  totalAverageMonths: number;
  totalJobs: number;
}

// Evento de creación de CV
export interface CVEvent {
  id: string;
  batchId: string;
  projectId: string;
  fileName: string;
  createdAt: string;
  selected?: boolean;
  cvData: {
    candidate: CandidateAPI;
    aggregatedValues: AggregatedValues;
  };
}

export interface BatchCompletedEvent {
  batchId: string;
  totalFiles: number;
  successCount: number;
  failedCount: number;
  completedAt: string;
}

export interface SSEEvent {
  type: SseEventType;
  data: CVEvent | BatchCompletedEvent;
}
