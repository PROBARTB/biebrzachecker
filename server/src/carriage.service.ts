import { PkpicEPAStationId } from "./pkpic/pkpic.model.js";
import pkpicDynamicService from "./pkpic/pkpic.dynamic.service.js";
import { SimpleCache } from "./utils/simpleCahce.js";
import { createHashKey } from "./utils/createHashKey.js";
import { NotFoundError } from "./utils/errors.js";

const carriageSvgsCache = new SimpleCache(5 * 60_000);

const getCarriageSvg = async (payload: { 
        trainCategory: string;
        trainNumber: number;
        carriageNumber: number;
        carriageType: string;
        departureDate: Date;
        arrivalDate: Date;
        departureStationId: PkpicEPAStationId;
        arrivalStationId: PkpicEPAStationId;
}, forceFetch = false): Promise<string> => {
    const hashKey = createHashKey("carriageSvg", payload);

    const cached = carriageSvgsCache.get(hashKey);
    if(cached && !forceFetch) return cached as string;

    const carriageSvg: string = await pkpicDynamicService.fetchCarriageSvg(payload);
    carriageSvgsCache.set(hashKey, carriageSvg);

    return carriageSvg;
}

export default {getCarriageSvg};