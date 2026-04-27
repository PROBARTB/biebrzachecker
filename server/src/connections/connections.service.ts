import { PkpicCodeStationId, PkpicEPAStationId, PkpicEVAStationId } from "../pkpic/pkpic.model.js";
import pkpicDynamicService from "../pkpic/pkpic.dynamic.service.js";
import { SimpleCache } from "../utils/simpleCahce.js";
import { createHashKey } from "../utils/createHashKey.js";
import { NotFoundError } from "../utils/errors.js";
import { Connection } from "../pkpic/pkpic.connection.model.js";

const connectionsCache = new SimpleCache(10 * 60_000);

const searchConnections = async (payload: { 
    url: string | null;
    departureDate: Date;
    arrivalDate: Date;

    departureStationId: PkpicEVAStationId;
    arrivalStationId: PkpicEVAStationId;

    minTransferTime: number;
    maxTransferTime: number;
    maxTransfers: number;

    viaStationIds: PkpicEVAStationId[];

    directOnly: boolean;
    fastestOnly: boolean;
    limitResults: number | null;

    trainCategories: string[];
    carriers: string[];
    seatTypes: string[];
    coachTypes: string[];

    brailleRequired: boolean;
    commercialAttributes: string[];
}, forceFetch = false): Promise<Connection[]> => {
    const hashKey = createHashKey("connections", payload);

    const cached = connectionsCache.get(hashKey);
    if(cached && !forceFetch) return cached as Connection[];

    const connections: Connection[] = await pkpicDynamicService.searchConnections(payload);
    connectionsCache.set(hashKey, connections);

    return connections;
}

export default {searchConnections};