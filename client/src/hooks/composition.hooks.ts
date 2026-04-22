import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { PkpicEPAStationId } from "./model";
import type { TrainComposition } from "./composition.model";

export interface TrainCompositionQueryParams {
    trainCategory: string;
    trainNumber: number;
    departureDate: Date;
    departureStationEPAId: PkpicEPAStationId;
    arrivalDate: Date;
    arrivalStationEPAId: PkpicEPAStationId;
}

const formatLocalISO = (date: Date) => date?.toLocaleString("sv-SE").replace(" ", "T"); // "2026-04-22T17:01:00"

const getTrainCompositionQueryKey = (params: TrainCompositionQueryParams) => [
  "trainComposition",
  params.trainCategory,
  params.trainNumber,
  params.departureStationEPAId,
  params.arrivalStationEPAId,
  formatLocalISO(params.departureDate),
  formatLocalISO(params.arrivalDate),
] as const;


export const getTrainComposition = async (params: TrainCompositionQueryParams): Promise<{composition: TrainComposition, hashKey: string}> => {
  const { data } = await api.get("/composition", { params: {
    cat: params.trainCategory,
    nr: params.trainNumber,
    from: params.departureStationEPAId,
    to: params.arrivalStationEPAId,
    fromDate: formatLocalISO(params.departureDate),
    toDate: formatLocalISO(params.arrivalDate),
}});
console.log("COMPOSITION", data);
  return {composition: data.composition, hashKey: data.hashKey};
};

export const useTrainComposition = (
  params: TrainCompositionQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: getTrainCompositionQueryKey(params),
    queryFn: () => getTrainComposition(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
};
