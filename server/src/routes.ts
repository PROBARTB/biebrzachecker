import { Router } from "express";
import icstationsController from "./icstations.controller.js";
import routeController from "./route.controller.js";
import compositionController from "./composition.controller.js";
import carriageController from "./carriage.controller.js";

const icstationsRouter = Router();
icstationsRouter.get("/", icstationsController.getStations);

const routeRouter = Router();
routeRouter.get("/", routeController.getRoute);

const compositionRouter = Router();
routeRouter.get("/", compositionController.getComposition);
routeRouter.get("/:id/carriage", compositionController.getCarriageForComposition);

const carriageRouter = Router();
routeRouter.get("/", carriageController.getCarriage);

const indexRouter = Router();
indexRouter.use("/stations", icstationsRouter);
indexRouter.use("/route", routeRouter);
indexRouter.use("/composition", compositionRouter);
indexRouter.use("/carriage", carriageRouter);

export default indexRouter;