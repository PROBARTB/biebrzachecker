import { PkpicCodeStationId } from "./pkpic.model.js";

export interface SearchConnectionsPayload {
  url: string | null;
  departureDate: Date;        // then parse to -> YYYY-MM-DD HH:mm:ss
  arrivalDate: Date;          // then parse to -> YYYY-MM-DD HH:mm:ss

  departureStationId: PkpicCodeStationId;
  arrivalStationId: PkpicCodeStationId;

  minTransferTime: number;
  maxTransferTime: number;
  maxTransfers: number;

  viaStationIds: PkpicCodeStationId[];

  directOnly: boolean;
  fastestOnly: boolean;
  limitResults: number | null;

  trainCategories: string[];
  carriers: string[];
  seatTypes: string[];
  coachTypes: string[];

  brailleRequired: boolean;
  commercialAttributes: string[];
}

export interface ConnectionTrain {
  departureStationId: PkpicCodeStationId;
  arrivalStationId: PkpicCodeStationId;

  trainNumber: number;
  trainCategory: string;
  trainName: string;

  departureTime: Date | null;
  arrivalTime: Date | null;
  travelTimeMinutes: number;

  seatTypes: number[];
  genderCompartments: number[];
  notes: string[];
  placeTypes: number[];

  vehicleType: number;
  consistPdfUrl: string | null;
  virtualTourUrl: string | null;
}

export interface Connection {
  id: number;

  departureTime: Date | null;
  arrivalTime: Date | null;
  travelTimeMinutes: number;

  transferTime: number;
  transferTime2: number;

  availableInPresale: boolean;
  presaleMessages: string[];

  segments: ConnectionTrain[];
}

export interface ResponseConnectionTrain {
  stacjaWyjazdu: number;
  stacjaWyjazduMeta: number;
  stacjaPrzyjazdu: number;
  stacjaPrzyjazduMeta: number;

  nrPociagu: number;
  kategoriaPociagu: string;
  nazwaPociagu: string;

  dataWyjazdu: string;
  dataPrzyjazdu: string;
  czasJazdy: number;

  rodzajeMiejsc: number[];
  przedzialPlec: number[];
  uwagi: string[];
  typyMiejsc: number[];

  grm: number;
  informacjePasazerskie: any[];

  transfer: number;
  transferKomMiejska: number;
  transferKomunikaty: any[];

  typPojazdu: number;

  zestawieniaPociagowLink: string;
  wirtualnaWycieczkaLink: string;
}

export interface ResponseConnection {
  pociagi: ResponseConnectionTrain[];

  dataWyjazdu: string;
  dataPrzyjazdu: string;
  czasJazdy: number;

  czasNaPrzesiadke: number;
  czasNaPrzesiadke2: number;

  idPolaczenia: number;

  dostepneWPrzedsprzedazy: boolean;
  komunikatPrzedsprzedaz: string[];
}

export interface SearchConnectionsResponse {
  polaczenia: ResponseConnection[];
}

export const parseDate = (value: string): Date | null => {
    if (!value || value.trim() === "") return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
};

export const mapSearchConnectionResponse = (
  res: SearchConnectionsResponse
): Connection[] => {
  return res.polaczenia.map((c) => ({
      id: c.idPolaczenia,
      departureTime: parseDate(c.dataWyjazdu),
      arrivalTime: parseDate(c.dataPrzyjazdu),
      travelTimeMinutes: c.czasJazdy,

      transferTime: c.czasNaPrzesiadke,
      transferTime2: c.czasNaPrzesiadke2,

      availableInPresale: c.dostepneWPrzedsprzedazy,
      presaleMessages: c.komunikatPrzedsprzedaz,

      segments: c.pociagi.map((p) => ({
        departureStationId: p.stacjaWyjazdu as PkpicCodeStationId,
        arrivalStationId: p.stacjaPrzyjazdu as PkpicCodeStationId,

        trainNumber: p.nrPociagu,
        trainCategory: p.kategoriaPociagu,
        trainName: p.nazwaPociagu,

        departureTime: parseDate(p.dataWyjazdu),
        arrivalTime: parseDate(p.dataPrzyjazdu),
        travelTimeMinutes: p.czasJazdy,

        seatTypes: p.rodzajeMiejsc,
        genderCompartments: p.przedzialPlec,
        notes: p.uwagi,
        placeTypes: p.typyMiejsc,

        vehicleType: p.typPojazdu,

        consistPdfUrl: p.zestawieniaPociagowLink || null,
        virtualTourUrl: p.wirtualnaWycieczkaLink || null
      }))
    }));
}