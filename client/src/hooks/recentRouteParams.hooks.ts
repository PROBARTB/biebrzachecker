import { useCallback, useEffect, useState } from "react";
import { loadRecentRouteParams, saveRecentRouteParams } from "../storage/recentRouteParams.storage.";
import type { Station } from "./station.model";

export interface RouteParams {
  trainCategory: string;
  trainNumber: number;
  fromStation: Station;
  toStation: Station;
  departureDate: Date;
}


export function useRecentRouteParams() {
  const [items, setItems] = useState<RouteParams[]>([]);

  useEffect(() => {
    setItems(loadRecentRouteParams());
  }, []);

  const addSearch = useCallback((search: RouteParams) => {
    saveRecentRouteParams(search);
    setItems(loadRecentRouteParams());
  }, []);

  return { items, addSearch };
}
