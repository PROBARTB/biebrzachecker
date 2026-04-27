import { Router } from "express";
import stationsController from "./stations/stations.controller.js";
import routeController from "./route/route.controller.js";
import compositionController from "./composition/composition.controller.js";
import carriageController from "./carriage/carriage.controller.js";
import connectionsController from "./connections/connections.controller.js";

const stationsRouter = Router();
stationsRouter.get("/", stationsController.getStations);
stationsRouter.get("/legacy", stationsController.getLegacyStations);

const routeRouter = Router();
routeRouter.get("/", routeController.getRoute);

const compositionRouter = Router();
compositionRouter.get("/", compositionController.getComposition);
compositionRouter.get("/:compositionHashKey/carriage", compositionController.getCarriageSvgForComposition);

const carriageRouter = Router();
carriageRouter.get("/svg", carriageController.getCarriageSvg);

const connectionsRouter = Router();
connectionsRouter.post("/search", connectionsController.searchConnections)

const indexRouter = Router();
indexRouter.use("/stations", stationsRouter);
indexRouter.use("/route", routeRouter);
indexRouter.use("/composition", compositionRouter);
indexRouter.use("/carriage", carriageRouter);
indexRouter.use("/connections", connectionsRouter);

export default indexRouter;