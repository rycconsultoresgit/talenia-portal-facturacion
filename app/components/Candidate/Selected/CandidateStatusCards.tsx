import { CandidateUI } from "@/app/types/candidate.types";
import { AptosCard } from "@/app/components/Candidate/Selected/AptosCard";
import { CiFaceFrown, CiFaceMeh, CiFaceSmile } from "react-icons/ci";

interface CandidateStatusCardsProps {
  selectedCandidates: CandidateUI[];
  totalCandidates: number;
}

export const CandidateStatusCards = ({
  selectedCandidates,
  totalCandidates,
}: Readonly<CandidateStatusCardsProps>) => {
  return (
    <div className="flex w-1/2 flex-row justify-between gap-4 rounded-md">
      <AptosCard
        title="Aptos"
        bgColor="bg-green-400"
        count={
          selectedCandidates.filter((candidate) => {
            return candidate.recommendation === "Apto";
          }).length
        }
        totalCandidates={totalCandidates}
        icon={CiFaceSmile}
      />

      <AptosCard
        title="Observados"
        bgColor="bg-yellow-400"
        count={
          selectedCandidates.filter((candidate) => {
            return candidate.recommendation === "Observado";
          }).length
        }
        totalCandidates={totalCandidates}
        icon={CiFaceMeh}
      />

      <AptosCard
        title="No aptos"
        bgColor="bg-red-400"
        count={
          selectedCandidates.filter((candidate) => {
            return candidate.recommendation === "No apto";
          }).length
        }
        totalCandidates={totalCandidates}
        icon={CiFaceFrown}
      />
    </div>
  );
};
