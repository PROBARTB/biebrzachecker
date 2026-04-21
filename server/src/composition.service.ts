import { PkpicEPAStationId } from "./pkpic/pkpic.model.js";
import pkpicDynamicService from "./pkpic/pkpic.dynamic.service.js";
import { SimpleCache } from "./utils/simpleCahce.js";
import { createHashKey } from "./utils/createHashKey.js";
import { TrainComposition } from "./pkpic/pkpic.composition.model.js";
import { NotFoundError } from "./utils/errors.js";
import carriageService from "./carriage.service.js";

const compositionsCache = new SimpleCache(10 * 60_000);

const getComposition = async (payload: { 
        trainCategory: string,
        trainNumber: number,
        departureStationId: PkpicEPAStationId,
        departureDate: Date,
        arrivalStationId: PkpicEPAStationId,
        arrivalDate: Date,
}, forceFetch = false): Promise<{composition: TrainComposition, hashKey?: string}> => {
    const hashKey = createHashKey("composition", payload);

    const cached = compositionsCache.get(hashKey);
    if(cached && !forceFetch) return {composition: (cached as {composition: TrainComposition, payload: any}).composition as TrainComposition};

    const composition: TrainComposition = await pkpicDynamicService.getComposition(payload);
    compositionsCache.set(hashKey, {composition, payload});

    return { composition, hashKey };
}

const getCarriageSvgForComposition = async (payload: { 
        hashKey: string,
        carriageNumber: number,
}, forceFetch = false): Promise<string> => {
    const cached = compositionsCache.get(payload.hashKey);
    if(!cached) throw new NotFoundError("No cached composition found for provided key.")

    const cp = (cached as {composition: TrainComposition, payload: any}).payload;
    const cc = (cached as {composition: TrainComposition, payload: any}).composition;

    const carriage = cc.carriages.find(c => c.number == payload.carriageNumber);
    if(!carriage) throw new NotFoundError("No carriage of provided number present in composition.")

    const carriageSvg: string = await carriageService.getCarriageSvg({
        trainCategory: cp.trainCategory,
        trainNumber: cp.trainNumber,
        carriageNumber: payload.carriageNumber,
        carriageType: carriage.type,
        departureDate: cp.departureDate,
        arrivalDate: cp.arrivalDate,
        departureStationId: cp.departureStationId,
        arrivalStationId: cp.arrivalStationId,
    }, forceFetch);

    compositionsCache.set(payload.hashKey, cached); // reset ttl

    return carriageSvg;
}

export default {getComposition, getCarriageSvgForComposition};