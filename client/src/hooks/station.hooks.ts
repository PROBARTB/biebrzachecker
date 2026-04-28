import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { Station } from "./station.model";



export const getStationsCompletions  = async (query: string): Promise<Station[]> => {
  const { data } = await api.get("/stations", { params: {
    q: query,
  }});
  console.log("STATIONS", data);
  return data;
};

export const useStationsCompletions  = (query: string) => {
  return useQuery<Station[]>({
    queryKey: ["stations", query],
    queryFn: () => getStationsCompletions(query),
    enabled: query?.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};

export const useStationByEVAId = (evaId?: number) => {
  return useQuery({
    queryKey: ["stationByEva", evaId],
    queryFn: async () => {
      const stations = await getStationsCompletions(String(evaId));
      return stations.find(s => Number(s.EVAId) === evaId) ?? null;
    },
    enabled: !!evaId,
    staleTime: 1000 * 60 * 5,
  });
};
