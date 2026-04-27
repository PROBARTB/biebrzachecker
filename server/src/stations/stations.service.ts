import { PkpicCodeStationId, PkpicEPAStationId, PkpicEVAStationId } from "../pkpic/pkpic.model.js";
import pkpicDynamicService from "../pkpic/pkpic.dynamic.service.js";
import { TrainRoute } from "../pkpic/pkpic.route.model.js";
import { SimpleCache } from "../utils/simpleCahce.js";
import { createHashKey } from "../utils/createHashKey.js";
import { Station } from "../pkpic/pkpic.reference.model.js";
import pkpicReferenceService from "../pkpic/pkpic.reference.service.js";
import { NotFoundError } from "../utils/errors.js";

let stations: Station[] = [];

const ensureStationsLoaded = async () => {
    if (stations.length === 0) stations = await pkpicReferenceService.getStations();
};
ensureStationsLoaded();

const find = (stations: Station[], query: string): Station[] => {
  const q = query.toLocaleLowerCase();
  return stations.filter(
    s =>
      String(s.EPAId).toLowerCase().includes(q) ||
      String(s.EVAId).toLowerCase().includes(q) ||
      s.name.toLocaleLowerCase().includes(q)
  ).sort((a, b) => {
      const na = a.name.toLowerCase();
      const nb = b.name.toLowerCase();

      const startsA = na.startsWith(q) ? 1 : 0;
      const startsB = nb.startsWith(q) ? 1 : 0;

      if (startsA !== startsB) return startsB - startsA;

      return na.localeCompare(nb);
    });
}

const findStationsMatchingNameOrId = async (query: string): Promise<Station[]> => {
    ensureStationsLoaded();

    const results = find(stations, query);
    return results as Station[];
}

const getEPAIdforEVAId = (stationEVAId: PkpicEVAStationId): PkpicEPAStationId => {
  const station = Object.values(stations).find(
    (s) => Number(s.EVAId) === stationEVAId
  );

  if (!station) throw new NotFoundError(`Station with EVA Id ${stationEVAId} not found`);

  return Number(station.EPAId) as PkpicEPAStationId;
};
const getCodeIdforEVAId = (stationEVAId: PkpicEVAStationId): PkpicCodeStationId => {
  const station = Object.values(stations).find(
    (s) => Number(s.EVAId) === stationEVAId
  );

  if (!station) throw new NotFoundError(`Station with EVA Id ${stationEVAId} not found`);

  return Number(station.codeId) as PkpicCodeStationId;
};
const getEVAIdforCodeId = (stationCodeId: PkpicCodeStationId): PkpicEVAStationId => {
  const station = Object.values(stations).find(
    (s) => Number(s.codeId) === stationCodeId
  );

  if (!station) throw new NotFoundError(`Station with Code Id ${stationCodeId} not found`);

  return Number(station.EVAId) as PkpicEVAStationId;
};

export default {findStationsMatchingNameOrId, getEPAIdforEVAId, getCodeIdforEVAId, getEVAIdforCodeId};