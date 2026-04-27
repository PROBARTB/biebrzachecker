import legacyStationsService from "./stations.legacy.service.js";

const getLegacyStations = async (req: any, res: any) => {
  const { q } = req.query;

  const stations = await legacyStationsService.findStationsMatchingNameOrId(q);
  res.json(stations.slice(0, 5));
}

import { fetchErrorHandler } from "../utils/errors.js";
import stationsService from "./stations.service.js";

const getStations = async (req: any, res: any) => {
    try {
        const { q } = req.query;

        if (!q) return res.status(400).json({message: "`&q=`: is required"});

        const filteredStations = await stationsService.findStationsMatchingNameOrId(q);

        return res.json(filteredStations.slice(0, 5));
    } catch (err) {
        fetchErrorHandler(err, "fetching Stations", res);
    }
}

export default {getLegacyStations, getStations};