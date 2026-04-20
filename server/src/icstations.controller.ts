import icstationService from "./icstations.service.js";
import type { IcStation } from "./icstations.model.js";

const getStations = (req: any, res: any) => {
  const { q } = req.params;

  const stations = icstationService.findStationsMatchingNameOrId(q);
  res.json(stations);
}

export default {getStations};