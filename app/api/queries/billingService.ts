import { useQuery } from "@tanstack/react-query";
import { billingService } from "../billingService";

export const useBillingAll = (params: {month?:number,year?:number,find?:string} = {}, queryOptions?: any) => {
  const fetchBillingsAll = async () => {
    const res = await billingService.getAllSummaryBillings(params)
    return res ?? [];
  };

  const query = useQuery<any>({
    queryKey: ["billings"],
    queryFn: fetchBillingsAll,
    ...queryOptions,
  });

  return {
    ...query ,
    billingAll: query?.data ?? [],
    totalBilling: query?.data?.length ?? 0,
    isLoadingBillings: query.isLoading
  };
};