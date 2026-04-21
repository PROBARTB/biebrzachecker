import pkpicClient from "./pkpic.client.js";
import { formatPkpicGrmDate } from "./pkpic.model.js";
import { type FetchCarriageSvgPayload } from "./pkpic.carriage.model.js";
import { type GetTrainCompositionResponse, type GetTrainCompositionPayload, type TrainComposition, mapTrainCompositionResponse } from "./pkpic.composition.model.js";
import { type Connection, type SearchConnectionsPayload, type SearchConnectionsResponse, mapSearchConnectionResponse } from "./pkpic.connection.model.js";
import { type GetTrainRoutePayload, type TrainRoute, type TrainRouteResponse, mapTrainRouteResponse } from "./pkpic.route.model.js";
import { NotFoundError, ExternalServiceError, ExternalServiceInvalidResponseError } from "../utils/errors.js";

const searchConnections = async (payload: SearchConnectionsPayload): Promise<Connection[]> => {
    const res = await pkpicClient.publicPost<SearchConnectionsResponse>("/server/public/endpoint/Pociagi", {
        metoda: "wyszukajPolaczenia",
        url: payload.url ?? "https://ebilet.intercity.pl/wyszukiwanie?dwyj=2026-04-23&swyj=5196003&sprzy=41&time=12%3A53&przy=0&sprzez=&ticket100=1010&ticket50=&polbez=0&kpoc=EIC%2CIC%2CTLK",
        dataWyjazdu: payload.departureDate.toISOString().slice(0, 19).replace("T", " "),
        dataPrzyjazdu: payload.arrivalDate.toISOString().slice(0, 19).replace("T", " "),
        stacjaWyjazdu: payload.departureStationId,
        stacjaPrzyjazdu: payload.arrivalStationId,
        czasNaPrzesiadkeMin: payload.minTransferTime,
        czasNaPrzesiadkeMax: payload.maxTransferTime,
        liczbaPrzesiadekMax: payload.maxTransfers,
        stacjePrzez: payload.viaStationIds,
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

    if (!res) throw new ExternalServiceError("PKPIC api unavailable");
    if (!Array.isArray(res.polaczenia)) throw new ExternalServiceInvalidResponseError("Invalid response from PKPIC: expected polaczenia[]");
    if (res.polaczenia.length === 0) throw new NotFoundError("Nothing found for selected criteria");

    return mapSearchConnectionResponse(res);
}

const getRoute = async (payload: GetTrainRoutePayload): Promise<TrainRoute> => {
    const res = await pkpicClient.publicPost<TrainRouteResponse>("/server/public/endpoint/Pociagi", {
        metoda: "pobierzTrasePrzejazdu",
        url: payload.url ?? "https://ebilet.intercity.pl/wyszukiwanie?dwyj=2026-04-21&swyj=242&sprzy=41&time=16%3A51&przy=0&sprzez=&ticket100=1010&ticket50=&polbez=0",
        dataWyjazdu: payload.departureDate.toISOString().slice(0, 19),
        stacjaWyjazdu: payload.departureStationId,
        stacjaPrzyjazdu: payload.arrivalStationId,
        numerPociagu: payload.trainNumber,
    });
    if (!res) throw new ExternalServiceError("PKPIC api unavailable");
    if (!Array.isArray(res.trasePrzejezdu?.trasaPrzejazdu)) throw new ExternalServiceInvalidResponseError("Invalid response from PKPIC: expected trasePrzejezdu.trasaPrzejazdu[]");
    if (res.trasePrzejezdu.trasaPrzejazdu.length === 0) throw new NotFoundError("Nothing found for selected criteria");

    return mapTrainRouteResponse(res);
}

const getComposition = async (payload: GetTrainCompositionPayload): Promise<TrainComposition> => {
    const dep = formatPkpicGrmDate(payload.departureDate);
    const arr = formatPkpicGrmDate(payload.arrivalDate);
    const res = await pkpicClient.grmGet<GetTrainCompositionResponse>(
        `https://api-gateway.intercity.pl/grm/sklad/wbnet/${payload.trainCategory}/${payload.trainNumber}/${dep}/${payload.departureStationId}/${arr}/${payload.arrivalStationId}`
    );
    
    if (!res) throw new ExternalServiceError("PKPIC api unavailable");
    if (!Array.isArray(res.wagony)) throw new ExternalServiceInvalidResponseError("Invalid response from PKPIC: expected wagony[]");
    if (res.wagony.length === 0) throw new NotFoundError("Nothing found for selected criteria");

    return mapTrainCompositionResponse(res);
}

const fetchCarriageSvg = async (payload: FetchCarriageSvgPayload): Promise<string> => {
    const dep = formatPkpicGrmDate(payload.departureDate);
    const arr = formatPkpicGrmDate(payload.arrivalDate);
    const res = await pkpicClient.grmGet<string>(
        `https://api-gateway.intercity.pl/grm/wagon/svg/wbnet/${payload.trainCategory}/${payload.trainNumber}/${payload.carriageNumber}/${payload.carriageType}/${dep}/${arr}/${payload.departureStationId}/${payload.arrivalStationId}`
    );

    if (!res) throw new ExternalServiceError("PKPIC api unavailable");
    if (typeof res !== "string" || !res.includes("<svg")) throw new ExternalServiceInvalidResponseError("Invalid response from PKPIC: expected `<svg`");
    if (res.trim().length === 0) throw new NotFoundError("Nothing found for selected criteria");

    return res;
}

const checkPrices = () => {}

const isAvailable = () => {}
//TODO: implement these two

export default {searchConnections, getRoute, getComposition, fetchCarriageSvg};