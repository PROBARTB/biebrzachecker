import carriageService from "./carriage.service.js";
import compositionService from "../composition/composition.service.js";
import { PkpicEPAStationId } from "../pkpic/pkpic.model.js";
import routeService from "../route/route.service.js";
import { fetchErrorHandler } from "../utils/errors.js";

const getCarriageSvg = async (req: any, res: any) => {
    try {
        const { cat, trainNr, from, to, fromDate, toDate, nr, type } = req.query;

        if (!cat) return res.status(400).json({message: "`&cat=`: is required"});
        if (!trainNr) return res.status(400).json({message: "`&trainNr=`: is required"});
        if (!from) return res.status(400).json({message: "`&from=`: is required"});
        if (!to) return res.status(400).json({message: "`&to=`: is required"});
        if (!fromDate) return res.status(400).json({message: "`&fromDate=`: is required"});
        if (!toDate) return res.status(400).json({message: "`&toDate=`: is required"});
        if (!nr) return res.status(400).json({message: "`&nr=`: is required"});
        if (!type) return res.status(400).json({message: "`&type=`: is required"});

        // maybe in the future, should be fetched from api.
        // const allowedCats = ["IC", "TLK", "EIC", "EIP"];
        // if (!allowedCats.includes(cat)) {
        //     return res.status(400).json({ message: "Invalid train category" });
        // }

        const trainNumber = Number(nr);
        const departureStationId = Number(from) as PkpicEPAStationId;
        const arrivalStationId = Number(to) as PkpicEPAStationId;
        const carriageNumber = Number(nr);

        if (isNaN(trainNumber)) return res.status(400).json({ message: "`nr` must be a number" });
        if (isNaN(departureStationId)) return res.status(400).json({ message: "`from` must be a number" });
        if (isNaN(arrivalStationId)) return res.status(400).json({ message: "`to` must be a number" });
        if (isNaN(carriageNumber)) return res.status(400).json({ message: "`nr` must be a number" });

        const departureDate = new Date(`${fromDate}Z`);
        const arrivalDate = new Date(`${toDate}Z`);
        if(isNaN(departureDate.getTime())|| isNaN(arrivalDate.getTime())) return res.status(400).json({ message: "Invalid date format, ISO expected" });

        const carriageSvg = await carriageService.getCarriageSvg({
            trainCategory: cat,
            trainNumber,
            departureStationId,
            arrivalStationId,
            departureDate,
            arrivalDate,
            carriageNumber,
            carriageType: type,
        });

        return res.json({ carriageSvg });
    } catch (err) {
        fetchErrorHandler(err, "fetching CarriageSvg", res);
    }
}

export default {getCarriageSvg};