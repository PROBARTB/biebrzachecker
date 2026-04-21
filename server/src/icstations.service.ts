import fetch from "node-fetch";
import type { IcStation } from "./icstations.model.js";

const fetchStationsFromIc = async () => {
    const url = "https://www.intercity.pl/js/station.js"; //?v=41.9
    const jsText = await fetch(url).then(r => r.text());

    const vm = await import("node:vm");

    const sandbox = { icst: {} };
    vm.runInNewContext(jsText, sandbox);

    return sandbox.icst;
}

const stations: Record<number, IcStation> = await fetchStationsFromIc();

const findStationsMatchingNameOrId = (query: string): IcStation[] => {
  if(!query) return [];
  const q = query.toLowerCase();

  return Object.values(stations).filter(
    s =>
      s.n.toLowerCase().includes(q) ||
      s.i.toLowerCase().includes(q)
  ).sort((a, b) => {
      const na = a.n.toLowerCase();
      const nb = b.n.toLowerCase();

      const startsA = na.startsWith(q) ? 1 : 0;
      const startsB = nb.startsWith(q) ? 1 : 0;

      if (startsA !== startsB) return startsB - startsA;

      return na.localeCompare(nb);
    });
};

export default {findStationsMatchingNameOrId}