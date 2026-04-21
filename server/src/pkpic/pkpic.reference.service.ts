import pkpicClient from "./pkpic.client.js";
import { formatPkpicLastUpdateDate } from "./pkpic.model.js";
import { type GetStationsResponse, type Station, mapGetStationsResponse } from "./pkpic.reference.model.js";

const getStations= async (): Promise<Station[]> => {
    const res = await pkpicClient.publicPost<GetStationsResponse>("/server/public/endpoint/Aktualizacja", {
        metoda: "pobierzStacje",
        ostatniaAktualizacjaData: formatPkpicLastUpdateDate(new Date(Date.now())),
    });
    if (!res || !Array.isArray(res.stacje)) throw new Error("Invalid response from PKPIC: expected stacje[]");
    return mapGetStationsResponse(res);
}

//TODO: implement other models and functions for all methods:
//pobierzOfertyOkresoweRodzaje, pobierzOfertyOkresowe, pobierzOferty, pobierzZnizkiEnrt, pobierzAtrybutyHandlowe, pobierzZnizkiZakupowe, pobierzRodzajeMiejsc, pobierzTypyMiejsc, pobierzOplatyDodatkowe, pobierzZnizkiMiedzynarodowe, pobierzKonfiguracjeMiedzynarodowa, pobierzKraje, pobierzZnizki, pobierzStacje, pobierzKategoriePociagow, pobierzUsytuowanie, pobierzKonfiguracje, pobierzSpolkiKolejowe

export default {getStations};