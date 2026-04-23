import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";

export interface CompositionCarriageSvgQueryParams {
    compositionHashKey: string;
    carriageNumber: number;
}

const getCompositionCarriageSvgQueryKey = (
  params: CompositionCarriageSvgQueryParams
) => ["compositionCarriageSvg", params.compositionHashKey, params.carriageNumber] as const;

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
  options?: { enabled?: boolean; refreshToken?: number }
) => {
  const refreshToken = options?.refreshToken ?? 0;

  return useQuery({
    queryKey: [...getCompositionCarriageSvgQueryKey(params), refreshToken] as const,
    queryFn: () => getCompositionCarriageSvg(params, refreshToken > 0),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
};
