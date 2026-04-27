import { PkpicEVAStationId } from "../pkpic/pkpic.model.js";
import pkpicDynamicService from "../pkpic/pkpic.dynamic.service.js";
import { TrainRoute } from "../pkpic/pkpic.route.model.js";
import { SimpleCache } from "../utils/simpleCahce.js";
import { createHashKey } from "../utils/createHashKey.js";

const routesCache = new SimpleCache(10 * 60_000);

const getRoute = async (payload: { 
        trainCategory: string,
        trainNumber: number,
        departureStationId: PkpicEVAStationId,
        arrivalStationId: PkpicEVAStationId,
        departureDate: Date,
}, forceFetch = false): Promise<TrainRoute> => {
    const hashKey = createHashKey("route", payload);

    const cached = routesCache.get(hashKey);
    if(cached && !forceFetch) return cached as TrainRoute;

    const route: TrainRoute = await pkpicDynamicService.getRoute(payload);
    routesCache.set(hashKey, route);

    return route;
}

export default {getRoute};