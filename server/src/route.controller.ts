import { PkpicEVAStationId } from "./pkpic/pkpic.model.js";
import routeService from "./route.service.js";
import { fetchErrorHandler } from "./utils/errors.js";

const getRoute = async (req: any, res: any) => {
    try {
        const { cat, nr, from, to, date: stringDate } = req.query;

        if (!cat) return res.status(400).json({message: "`&cat=`: is required"});
        if (!nr) return res.status(400).json({message: "`&nr=`: is required"});
        if (!from) return res.status(400).json({message: "`&from=`: is required"});
        if (!to) return res.status(400).json({message: "`&to=`: is required"});
        if (!stringDate) return res.status(400).json({message: "`&date=`: is required"});

        // maybe in the future, should be fetched from api.
        // const allowedCats = ["IC", "TLK", "EIC", "EIP"];
        // if (!allowedCats.includes(cat)) {
        //     return res.status(400).json({ message: "Invalid train category" });
        // }

        const trainNumber = Number(nr);
        const departureStationId = Number(from) as PkpicEVAStationId;
        const arrivalStationId = Number(to) as PkpicEVAStationId;

        if (isNaN(trainNumber)) return res.status(400).json({ message: "`nr` must be a number" });
        if (isNaN(departureStationId)) return res.status(400).json({ message: "`from` must be a number" });
        if (isNaN(arrivalStationId)) return res.status(400).json({ message: "`to` must be a number" });

        const departureDate = new Date(`${stringDate}Z`);
        if(isNaN(departureDate.getTime())) return res.status(400).json({ message: "Invalid date format, ISO expected" });

        const route = await routeService.getRoute({
            trainCategory: cat,
            trainNumber,
            departureStationId,
            arrivalStationId,
            departureDate,
        });

        return res.json({ route });
    } catch (err) {
        fetchErrorHandler(err, "fetching Route", res);
    }
}

export default {getRoute};