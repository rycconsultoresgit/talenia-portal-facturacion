import { useQuery } from "@tanstack/react-query";
import { plansService } from "../plansService";

export const usePlanAll = (params: any = {}, queryOptions?: any) => {
  const fetchPlansAll = async () => {
    const res = await plansService.getAllPlans()
    return res;
  };

  const query = useQuery<any>({
    queryKey: ["plans"],
    queryFn: fetchPlansAll,
    ...queryOptions,
  });

  return {
    ...query,
    plansAll: query?.data,
    totalPlans: query?.data?.lenght,
    isLoadingPlans: query.isLoading
  };
};