import { useQuery } from "@tanstack/react-query";
import { userService } from "../userService";

export const useRolesAll = (params: any = {}, queryOptions?: any) => {
  const fetchRolesAll = async () => {
    const res = await userService.getAllRoles()
    return res;
  };

  const query = useQuery<any>({
    queryKey: ["roles"],
    queryFn: fetchRolesAll,
    ...queryOptions,
  });

  return {
    ...query,
    rolesAll: query?.data,
    totalRoles: query?.data?.lenght,
    isLoadingRoles: query.isLoading
  };
};