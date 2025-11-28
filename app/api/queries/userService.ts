import { useQuery } from "@tanstack/react-query";
import { userService } from "../userService";

export const useUsersAll = (params: any = {}, queryOptions?: any) => {
  const fetchUsersAll = async () => {
    const res = await userService.getAllUsers(params)
    console.log(res);
    

    return res;
  };

  const query = useQuery<any>({
    queryKey: ["users"],
    queryFn: fetchUsersAll,
    ...queryOptions,
  });

  return {
    ...query,
    usersAll: query?.data,
    totalUsers: query?.data?.lenght
  };
};