import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { TrainComposition } from "./composition.model";

export interface CompositionCarriageSvgQueryParams {
    compositionHashKey: string;
    carriageNumber: number;
}

const formatLocalISO = (date: Date) => date.toLocaleString("sv-SE").replace(" ", "T"); // "2026-04-22T17:01:00"


export const getCompositionCarriageSvg= async (params: CompositionCarriageSvgQueryParams, forceFetch?: boolean): Promise<TrainComposition> => {
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
