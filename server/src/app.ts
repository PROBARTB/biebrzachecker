import "dotenv/config";
import express from "express";

const app = express();

//console.log(findStationsMatchingNameOrId("War").slice(0, 5));

app.use(express.json());

import biebrzecheckerCarriageRoutes from "./routes.js";
app.use("/biebrzachecker/carriages/", biebrzecheckerCarriageRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server lisning on port ${PORT} ¯\\_(ツ)_/¯`);
})

