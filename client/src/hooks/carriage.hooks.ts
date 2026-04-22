import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";

export interface CompositionCarriageSvgQueryParams {
    compositionHashKey: string;
    carriageNumber: number;
}

export const getCompositionCarriageSvg = async (
  params: CompositionCarriageSvgQueryParams,
  forceFetch?: boolean
): Promise<string> => {
  const { data } = await api.get(`/composition/${params.compositionHashKey}/carriage`, { params: {
    nr: params.carriageNumber,
    forceFetch
}});
    console.log("CARRIAGESVG", data);
  return data.carriageSvg;
};

export const useCompositionCarriageSvg = (
  params: CompositionCarriageSvgQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["compositionCarriageSvg", params],
    queryFn: () => getCompositionCarriageSvg(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
};
