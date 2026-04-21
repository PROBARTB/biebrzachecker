import { PkpicEPAStationId } from "./pkpic.model.js";

//https://api-gateway.intercity.pl/grm/wagon/svg/wbnet/IC/1516/16/1356,WITHOUT_COMPARTMENTS/202604221701/202604222037/5100136/5100023
export interface FetchCarriageSvgPayload {
    trainCategory: string;
    trainNumber: number;
    carriageNumber: number;
    carriageType: string;
    departureDate: Date;
    arrivalDate: Date;
    departureStationId: PkpicEPAStationId;
    arrivalStationId: PkpicEPAStationId;
}