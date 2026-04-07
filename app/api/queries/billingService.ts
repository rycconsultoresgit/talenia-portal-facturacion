import { useQuery } from "@tanstack/react-query";
import { billingService } from "../billingService";
import type { BillingGroup } from "@/app/types/billing.types";

type BillingFilters = { month?: number; year?: number; find?: string };
type PaginationParams = { page?: number; limit?: number };
type QueryOptions = Record<string, unknown>;

export const useBillingAll = (
  filters: BillingFilters = {},
  params: PaginationParams = {},
  queryOptions?: QueryOptions,
) => {
  const fetchBillingsAll = async () => {
    const res = await billingService.getAllSummaryBillings(filters, params);
    return res ?? { data: [], total: 0 };
  };

  const query = useQuery({
    queryKey: ["billings", filters, params],
    queryFn: fetchBillingsAll,
    ...queryOptions,
  });

  return {
    ...query ,
    billingAll: (query?.data?.data ?? []) as BillingGroup[],
    totalBilling: query?.data?.total ?? 0,
    isLoadingBillings: query.isLoading
  };
};
