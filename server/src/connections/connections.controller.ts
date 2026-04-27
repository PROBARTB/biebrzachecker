import carriageService from "../carriage/carriage.service.js";
import compositionService from "../composition/composition.service.js";
import { SearchConnectionsPayload } from "../pkpic/pkpic.connection.model.js";
import { PkpicCodeStationId, PkpicEVAStationId } from "../pkpic/pkpic.model.js";
import routeService from "../route/route.service.js";
import stationsService from "../stations/stations.service.js";
import { fetchErrorHandler } from "../utils/errors.js";
import connectionsService from "./connections.service.js";

const searchConnections = async (req: any, res: any) => {
    try {
        const { departureDate, arrivalDate, departureStationCodeId, departureStationEVAId, arrivalStationCodeId, arrivalStationEVAId, minTransferTime, maxTransferTime, maxTransfers, viaStationIds, directOnly, limitResults, trainCategories, carriers, seatTypes, coachTypes, brailleRequired, commercialAttributes, forceFetch } = req.body;

        if (!departureDate) return res.status(400).json({message: "`&departureDate=`: is required"});
        if (!arrivalDate) return res.status(400).json({message: "`&arrivalDate=`: is required"});
        if (!departureStationCodeId && !departureStationEVAId) return res.status(400).json({message: "`&departureStationId=`: is required"});
        if (!arrivalStationCodeId && !arrivalStationEVAId) return res.status(400).json({message: "`&arrivalStationId=`: is required"});

        const p = {} as SearchConnectionsPayload;

        p.departureStationId = departureStationEVAId !== undefined ?  Number(departureStationEVAId) as PkpicEVAStationId : stationsService.getEVAIdforCodeId(departureStationCodeId);
        p.arrivalStationId = arrivalStationEVAId !== undefined ? Number(arrivalStationEVAId) as PkpicEVAStationId : stationsService.getEVAIdforCodeId(arrivalStationCodeId);
        p.departureDate = new Date(`${departureDate}Z`);
        p.arrivalDate = new Date(`${arrivalDate}Z`);
        if(isNaN(p.departureDate.getTime())|| isNaN(p.arrivalDate.getTime())) return res.status(400).json({ message: "Invalid date format, ISO expected" });

        p.minTransferTime = minTransferTime !== undefined ? Number(minTransferTime) : 0;
        p.maxTransferTime = maxTransferTime !== undefined ? Number(maxTransferTime) : 1440;
        p.maxTransfers = maxTransfers !== undefined ? Number(maxTransfers) : 5;
        p.limitResults = limitResults !== undefined ? Number(limitResults) : 0;
        if (isNaN(p.minTransferTime)) return res.status(400).json({ message: "`minTransferTime` must be a number" });
        if (isNaN(p.maxTransferTime)) return res.status(400).json({ message: "`maxTransferTime` must be a number" });
        if (isNaN(p.maxTransfers)) return res.status(400).json({ message: "`maxTransfers` must be a number" });
        if (isNaN(p.limitResults)) return res.status(400).json({ message: "`limitResults` must be a number" });

        if (directOnly !== undefined && typeof directOnly !== "boolean") return res.status(400).json({ message: "`directOnly` must be a bolean" });
        if (brailleRequired !== undefined && typeof brailleRequired !== "boolean") return res.status(400).json({ message: "`brailleRequired` must be a bolean" });
        p.directOnly = directOnly !== undefined ? directOnly : false;
        p.brailleRequired = brailleRequired !== undefined ? brailleRequired : false;


        // optionally validation with api reference data in the future
        if (viaStationIds !== undefined) {
            if(!Array.isArray(viaStationIds)) return res.status(400).json({ message: "`viaStationIds` must be an array" });
        }
        p.viaStationIds = viaStationIds !== undefined ? viaStationIds : [];
        if (trainCategories !== undefined) {
            if(!Array.isArray(trainCategories)) return res.status(400).json({ message: "`trainCategories` must be an array" });
        }
        p.trainCategories = trainCategories !== undefined ? trainCategories : [];
        if (carriers !== undefined) {
            if(!Array.isArray(carriers)) return res.status(400).json({ message: "`carriers` must be an array" });
        }
        p.carriers = carriers !== undefined ? carriers : [];
        if (seatTypes !== undefined) {
            if(!Array.isArray(seatTypes)) return res.status(400).json({ message: "`seatTypes` must be an array" });
        }
        p.seatTypes = seatTypes !== undefined ? seatTypes : [];
        if (coachTypes !== undefined) {
            if(!Array.isArray(coachTypes)) return res.status(400).json({ message: "`coachTypes` must be an array" });
        }
        p.coachTypes = coachTypes !== undefined ? coachTypes : [];
        if (commercialAttributes !== undefined) {
            if(!Array.isArray(commercialAttributes)) return res.status(400).json({ message: "`commercialAttributes` must be an array" });
        }
        p.commercialAttributes = commercialAttributes !== undefined ? commercialAttributes : [];


        const connections = await connectionsService.searchConnections(p, forceFetch === true);

        return res.json({ connections });
    } catch (err) {
        fetchErrorHandler(err, "fetching connections", res);
    }
}



export default {searchConnections};