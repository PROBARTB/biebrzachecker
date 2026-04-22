import { useQuery } from "@tanstack/react-query";
import { api } from "../apiClient";
import type { IcStation } from "./station.model";



export const getStationsCompletions  = async (query: string): Promise<IcStation[]> => {
  const { data } = await api.get("/stations", { params: {
    q: query,
  }});
  console.log("STACJONNNS", data);
  return data;
};

export const useStationsCompletions  = (query: string | null) => {
  return useQuery<IcStation[]>({
    queryKey: ["icStations", query],
    queryFn: () => getStationsCompletions(query),
    enabled: query?.length > 2,
    staleTime: 1000 * 60 * 5,
  });
};