import { NotFoundError, ExternalServiceError, ExternalServiceInvalidResponseError } from "../utils/errors.js";
import pkpicClient from "./pkpic.client.js";
import { formatPkpicLastUpdateDate } from "./pkpic.model.js";
import { type GetStationsResponse, type Station, mapGetStationsResponse } from "./pkpic.reference.model.js";

const getStations= async (): Promise<Station[]> => {
    const res = await pkpicClient.publicPost<GetStationsResponse>("/server/public/endpoint/Aktualizacja", {
        metoda: "pobierzStacje",
        ostatniaAktualizacjaData: formatPkpicLastUpdateDate(new Date(Date.now())),
    });

    if (!res) throw new ExternalServiceError("PKPIC api unavailable");
    if (!Array.isArray(res.stacje)) throw new ExternalServiceInvalidResponseError("Invalid response from PKPIC: expected stacje[]");
    if (res.stacje.length === 0) throw new NotFoundError("Nothing found for selected criteria");

    return mapGetStationsResponse(res);
}

//TODO: implement other models and functions for all methods:
//pobierzOfertyOkresoweRodzaje, pobierzOfertyOkresowe, pobierzOferty, pobierzZnizkiEnrt, pobierzAtrybutyHandlowe, pobierzZnizkiZakupowe, pobierzRodzajeMiejsc, pobierzTypyMiejsc, pobierzOplatyDodatkowe, pobierzZnizkiMiedzynarodowe, pobierzKonfiguracjeMiedzynarodowa, pobierzKraje, pobierzZnizki, pobierzStacje, pobierzKategoriePociagow, pobierzUsytuowanie, pobierzKonfiguracje, pobierzSpolkiKolejowe

export default {getStations};