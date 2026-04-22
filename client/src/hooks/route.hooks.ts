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

// "2026-04-22T17:01:00"
const formatLocalISO = (date: Date) => date.toLocaleString("sv-SE").replace(" ", "T");

const getTrainRouteQueryKey = (params: RouteQueryParams) => [
  "trainRoute",
  params.trainCategory,
  params.trainNumber,
  params.fromEVAStationId,
  params.toEVAStationId,
  formatLocalISO(params.departureDate),
] as const;

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

export const useTrainRoute = (
  params: RouteQueryParams,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: getTrainRouteQueryKey(params),
    queryFn: () => getTrainRoute(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  });
};
