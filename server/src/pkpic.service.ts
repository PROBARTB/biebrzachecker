import pkpicClient from "./pkpic.client.js";
import { type Connection, type SearchConnectionsPayload, SearchConnectionsResponse, mapSearchConnectionResponse } from "./pkpic.service.model.js";

const searchConnections = async (payload: SearchConnectionsPayload): Promise<Connection[]> => {
    const res = await pkpicClient.publicPost<SearchConnectionsResponse>("/server/public/endpoint/Pociagi", {
        metoda: "wyszukajPolaczenia",
        url: payload.url ?? "https://ebilet.intercity.pl/wyszukiwanie?dwyj=2026-04-23&swyj=5196003&sprzy=41&time=12%3A53&przy=0&sprzez=&ticket100=1010&ticket50=&polbez=0&kpoc=EIC%2CIC%2CTLK",
        dataWyjazdu: payload.departureDate,
        dataPrzyjazdu: payload.arrivalDate,
        stacjaWyjazdu: payload.departureStationId,
        stacjaPrzyjazdu: payload.arrivalStationId,
        czasNaPrzesiadkeMin: payload.minTransferTime,
        czasNaPrzesiadkeMax: payload.maxTransferTime,
        liczbaPrzesiadekMax: payload.maxTransfers,
        stacjePrzez: payload.viaStations,
        polaczeniaBezposrednie: payload.directOnly ? 1 : 0,
        polaczeniaNajszybsze: payload.fastestOnly ? 1 : 0,
        liczbaPolaczen: payload.limitResults ?? 0,
        kategoriePociagow: payload.trainCategories,
        kodyPrzewoznikow: payload.carriers,
        rodzajeMiejsc: payload.seatTypes,
        typyMiejsc: payload.coachTypes,
        braille: payload.brailleRequired ? 1 : 0,
        atrybutyHandlowe: payload.commercialAttributes,
    });
    if (!res || !Array.isArray(res.polaczenia)) return [];
    return mapSearchConnectionResponse(res);
}
const getRoute = () => {}
const fetchCarriageSvg = () => {}
const getComposition = () => {}
const checkPrices = () => {}
//dokonczyc