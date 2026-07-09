import { useQuery } from "@tanstack/react-query";
import departmentService from "../services/department.service";
import type { Department } from "../types";

export const useDepartments = () => {
  return useQuery<Department[], Error>({
    queryKey: ["departments"],
    queryFn: departmentService.getDepartments,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
