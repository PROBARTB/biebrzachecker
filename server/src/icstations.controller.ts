import icstationService from "./icstations.service.js";
import type { IcStation } from "./icstations.model.js";

const getStations = async (req: any, res: any) => {
  const { q } = req.query;

  const stations = await icstationService.findStationsMatchingNameOrId(q);
  res.json(stations.slice(0, 5));
}

export default {getStations};