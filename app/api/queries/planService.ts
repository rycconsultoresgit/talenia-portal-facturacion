import { useQuery } from "@tanstack/react-query";
import { plansService } from "../plansService";
import type { Plan } from "@/app/types/plan.types";

type QueryOptions = Record<string, unknown>;

export const usePlanAll = (queryOptions?: QueryOptions) => {
  const fetchPlansAll = async () => {
    const res = await plansService.getAllPlans()
    if(!res){
      return [] as Plan[]
    }
    return res
    
  };

  const query = useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: fetchPlansAll,
    ...queryOptions,
  });

  return {
    ...query,
    plansAll: query?.data ?? [],
    totalPlans: query?.data?.length ?? 0,
    isLoadingPlans: query.isLoading
  };
};
