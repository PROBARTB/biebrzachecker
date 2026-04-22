import fetch from "node-fetch";
import type { IcStation } from "./icstations.model.js";
import { PkpicEPAStationId, PkpicEVAStationId } from "./pkpic/pkpic.model.js";
import { NotFoundError } from "./utils/errors.js";

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

const getEPAIdforEVAId = (stationEVAId: PkpicEVAStationId): PkpicEPAStationId => {
  const station = Object.values(stations).find(
    (s) => Number(s.h) === stationEVAId
  );

  if (!station) throw new NotFoundError(`Station with EVA Id ${stationEVAId} not found`);


  return Number(station.i) as PkpicEPAStationId;
};


export default {findStationsMatchingNameOrId, getEPAIdforEVAId}