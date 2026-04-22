import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { TrainRoute } from "./route.model";
import type { PkpicEPAStationId } from "./model";

export interface TrainCompositionQueryParams {
    trainCategory: string;
    trainNumber: number;
    departureDate: Date;
    departureStationEPAId: PkpicEPAStationId;
    arrivalDate: Date;
    arrivalStationEPAId: PkpicEPAStationId;
}

const formatLocalISO = (date: Date) => date.toISOString().slice(0, 19); // "2026-04-22T17:01:00"


export const getTrainComposition = async (params: TrainCompositionQueryParams): Promise<TrainRoute> => {
  const { data } = await api.get("/composition", { params: {
    cat: params.trainCategory,
    nr: params.trainNumber,
    from: params.departureStationEPAId,
    to: params.arrivalStationEPAId,
    fromDate: formatLocalISO(params.departureDate),
    toDate: formatLocalISO(params.arrivalDate),
}});
console.log("COMPOSITION", data);
  return data.route;
};

export const useTrainComposition = (params: TrainCompositionQueryParams | null) => {
  return useQuery({
    queryKey: ["trainComposition", params],
    queryFn: () => getTrainComposition(params as TrainCompositionQueryParams),
    enabled: !!params,
    staleTime: 1000 * 60 * 5,
  });
};