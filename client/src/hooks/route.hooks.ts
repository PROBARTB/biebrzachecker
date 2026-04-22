import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { TrainRoute } from "./route.model";

export interface RouteQueryParams {
  trainCategory: string;
  trainNumber: number;
  fromEVAStationId: number;
  toEVAStationId: number;
  departureDate: Date;
}

const formatLocalISO = (date: Date) => date.toISOString().slice(0, 19); // "2026-04-22T17:01:00"


export const getTrainRoute = async (params: RouteQueryParams): Promise<TrainRoute> => {
  const { data } = await api.get("/route", { params: {
    cat: params.trainCategory,
    nr: params.trainNumber,
    from: params.fromEVAStationId,
    to: params.toEVAStationId,
    date: formatLocalISO(params.departureDate),
}});
console.log("NIGEZZZ", data);
  return data.route;
};

export const useTrainRoute = (params: RouteQueryParams | null) => {
  return useQuery({
    queryKey: ["trainRoute", params],
    queryFn: () => getTrainRoute(params as RouteQueryParams),
    enabled: !!params,
    staleTime: 1000 * 60 * 5,
  });
};