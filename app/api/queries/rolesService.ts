import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { userService } from "../userService";

type RoleItem = {
  id: string;
  name: string;
  description: string;
  permisses: string;
};

export const useRolesAll = (
  queryOptions?: UseQueryOptions<RoleItem[], Error>,
) => {
  const fetchRolesAll = async () => {
    const res = await userService.getAllRoles();
    if (!res) {
      return [];
    }
    return res as RoleItem[];
  };

  const query = useQuery<RoleItem[], Error>({
    queryKey: ["roles"],
    queryFn: fetchRolesAll,
    ...queryOptions,
  });

  return {
    ...query,
    rolesAll: query?.data,
    totalRoles: query?.data?.length,
    isLoadingRoles: query.isLoading,
  };
};
