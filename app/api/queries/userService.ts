import { useQuery } from "@tanstack/react-query";
import { userService } from "../userService";

type PaginationParams = { page?: number; limit?: number };
type QueryOptions = Record<string, unknown>;

export const useUsersAll = (
  params: PaginationParams = {},
  queryOptions?: QueryOptions,
) => {
  const fetchUsersAll = async () => {
    const res = await userService.getAllUsers({
      page: params.page ?? 1,
      limit: params.limit ?? 6,
    })
    if(!res){
      return []
    }return res
  };

  const query = useQuery({
    queryKey: ["users", params],
    queryFn: fetchUsersAll,
    ...queryOptions,
  });

  return {
    ...query,
    usersAll: query?.data?.data,
    totalUsers: query?.data?.total,
    isLoadingUsers: query.isLoading
  };
};
