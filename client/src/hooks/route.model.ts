import type { PkpicEPAStationId, PkpicEVAStationId } from "./model";

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