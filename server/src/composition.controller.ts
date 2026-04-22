import compositionService from "./composition.service.js";
import { PkpicEPAStationId } from "./pkpic/pkpic.model.js";
import routeService from "./route.service.js";
import { fetchErrorHandler } from "./utils/errors.js";

const getComposition = async (req: any, res: any) => {
    try {
        const { cat, nr, from, to, fromDate, toDate, forceFetch } = req.query;

        if (!cat) return res.status(400).json({message: "`&cat=`: is required"});
        if (!nr) return res.status(400).json({message: "`&nr=`: is required"});
        if (!from) return res.status(400).json({message: "`&from=`: is required"});
        if (!to) return res.status(400).json({message: "`&to=`: is required"});
        if (!fromDate) return res.status(400).json({message: "`&fromDate=`: is required"});
        if (!toDate) return res.status(400).json({message: "`&toDate=`: is required"});

        // maybe in the future, should be fetched from api.
        // const allowedCats = ["IC", "TLK", "EIC", "EIP"];
        // if (!allowedCats.includes(cat)) {
        //     return res.status(400).json({ message: "Invalid train category" });
        // }

        const trainNumber = Number(nr);
        const departureStationId = Number(from) as PkpicEPAStationId;
        const arrivalStationId = Number(to) as PkpicEPAStationId;

        if (isNaN(trainNumber)) return res.status(400).json({ message: "`nr` must be a number" });
        if (isNaN(departureStationId)) return res.status(400).json({ message: "`from` must be a number" });
        if (isNaN(arrivalStationId)) return res.status(400).json({ message: "`to` must be a number" });

        const departureDate = new Date(`${fromDate}Z`);
        const arrivalDate = new Date(`${toDate}Z`);
        if(isNaN(departureDate.getTime())|| isNaN(arrivalDate.getTime())) return res.status(400).json({ message: "Invalid date format, ISO expected" });

        const { composition, hashKey } = await compositionService.getComposition({
            trainCategory: cat,
            trainNumber,
            departureStationId,
            arrivalStationId,
            departureDate,
            arrivalDate
        }, forceFetch);

        return res.json({ composition, hashKey });
    } catch (err) {
        fetchErrorHandler(err, "fetching Composition", res);
    }
}

const getCarriageSvgForComposition = async (req: any, res: any) => {
    try {
        const { nr, forceFetch } = req.query;
        const { compositionHashKey } = req.params;

        if (!compositionHashKey) return res.status(400).json({message: "`:compositionHashKey`: is required"});
        if (!nr) return res.status(400).json({message: "`&nr=`: is required"});

        const carriageSvg = await compositionService.getCarriageSvgForComposition({
            hashKey: compositionHashKey,
            carriageNumber: nr,
        }, forceFetch);

        return res.json({ carriageSvg });
    } catch (err) {
        fetchErrorHandler(err, "fetching CarriageSvg", res);
    }
}

export default {getComposition, getCarriageSvgForComposition};