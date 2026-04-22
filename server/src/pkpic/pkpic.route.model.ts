import icstationsService from "../icstations.service.js";
import { PkpicEPAStationId, PkpicEVAStationId } from "./pkpic.model.js";

export interface GetTrainRoutePayload {
    departureDate: Date,
    departureStationId: PkpicEVAStationId,
    arrivalStationId: PkpicEVAStationId,
    trainNumber: number,
    url?: string,
}

export interface ResponseTrainStop {
    stacja: number;
    nazwaStacji: string;
    kodStacji: string;
    typStacji: string;
    numerStacji: string;
    peron: string;
    tor: string;
    dataPrzyjazdu: string;
    dataWyjazdu: string;
    dataPrzyjazduRzeczywista: string;
    dataWyjazduRzeczywista: string;
    rodzajKodStacji: string;
    dozwoloneWsiadanie: boolean;
    dozwoloneWysiadanie: boolean;
    komunikaty: ResponseTrainStopMessage[];
}

export interface ResponseTrainStopMessage {
    jezyk: string;
    opis: string;
}

export interface ResponseTrainRouteInfo {
    kod: string;
    opis: string;
    stacjaDo: string;
}

export interface TrainRoute {
    stops: TrainStop[];
    info: TrainRouteInfo[];
}

export interface TrainStop {
    stationId: PkpicEVAStationId;
    stationEPAId: PkpicEPAStationId;
    stationName: string;
    stationCode: string; // ??? usually same as id
    stationNumber: string; // ??? usually same as id
    stationType: string;
    rodzajKodStacji: string;
    platform: string;
    track: string;
    arrival: Date | null;
    departure: Date | null;
    realArrival: Date | null;
    realDeparture: Date | null;
    boardingAllowed: boolean;
    disembarkingAllowed: boolean;
    messages: TrainStopMessage[];
}

export interface TrainStopMessage {
    language: string;
    text: string;
}

export interface TrainRouteInfo {
    code: string;
    description: string;
    stationTo: PkpicEVAStationId;
}

export interface TrainRouteResponse {
    trasePrzejezdu: {
        trasaPrzejazdu: ResponseTrainStop[];
        trasaPrzejazduInformacje: ResponseTrainRouteInfo[];
    };
    bledy: any[];
}

export const parseDate = (value: string): Date | null => {
    if (!value || value.trim() === "") return null;
    const d = new Date(value.replace("CEST", "+02:00"));
    return isNaN(d.getTime()) ? null : d;
};

const getEPAIdforEVAId = (stationEVAId: PkpicEVAStationId): PkpicEPAStationId => {
    return icstationsService.getEPAIdforEVAId(stationEVAId);
}

export const mapTrainRouteResponse = (res: TrainRouteResponse): TrainRoute => {
    return {
        stops: res.trasePrzejezdu.trasaPrzejazdu.map(stop => ({
            stationId: stop.stacja as PkpicEVAStationId,
            stationEPAId: getEPAIdforEVAId(stop.stacja as PkpicEVAStationId) as PkpicEPAStationId,
            stationName: stop.nazwaStacji,
            stationCode: stop.kodStacji,
            stationNumber: stop.numerStacji,
            stationType: stop.typStacji,
            rodzajKodStacji: stop.rodzajKodStacji,
            platform: stop.peron,
            track: stop.tor,
            arrival: parseDate(stop.dataPrzyjazdu),
            departure: parseDate(stop.dataWyjazdu),
            realArrival: parseDate(stop.dataPrzyjazduRzeczywista),
            realDeparture: parseDate(stop.dataWyjazduRzeczywista),
            boardingAllowed: stop.dozwoloneWsiadanie,
            disembarkingAllowed: stop.dozwoloneWysiadanie,
            messages: stop.komunikaty.map(m => ({
                language: m.jezyk,
                text: m.opis
            }))
        })),
        info: res.trasePrzejezdu.trasaPrzejazduInformacje.map(i => ({
            code: i.kod,
            description: i.opis,
            stationTo: Number(i.stacjaDo) as PkpicEVAStationId
        }))
    };
};

