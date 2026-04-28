import type { RouteParams } from "../hooks/recentRouteParams.hooks";

const KEY = "recentRouteParams";
const MAX_ITEMS = 8;

export function loadRecentRouteParams(): RouteParams[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    return parsed.map((item: any) => ({
      ...item,
      departureDate: new Date(item.departureDate),
    }));
  } catch {
    return [];
  }
}

export function saveRecentRouteParams(params: RouteParams) {
  const existing = loadRecentRouteParams();

  const filtered = existing.filter(
    (item) =>
      !(
        item.trainCategory === params.trainCategory &&
        item.trainNumber === params.trainNumber &&
        item.fromStation.EVAId === params.fromStation.EVAId &&
        item.toStation.EVAId === params.toStation.EVAId &&
        item.departureDate.getTime() === params.departureDate.getTime()
      )
  );

  const updated = [params, ...filtered].slice(0, MAX_ITEMS);

  localStorage.setItem(
    KEY,
    JSON.stringify(
      updated.map((item) => ({
        ...item,
        departureDate: item.departureDate.toISOString(),
      }))
    )
  );
}
