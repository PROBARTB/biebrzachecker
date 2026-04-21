// Search connections
export interface SearchConnectionsPayload {
  url: string | null;
  departureDate: string;        // YYYY-MM-DD HH:mm:ss
  arrivalDate: string;          // YYYY-MM-DD HH:mm:ss

  departureStationId: number;
  arrivalStationId: number;

  minTransferTime: number;
  maxTransferTime: number;
  maxTransfers: number;

  viaStations: number[];

  directOnly: boolean;
  fastestOnly: boolean;
  limitResults: number | null;

  trainCategories: string[];
  carriers: string[];
  seatTypes: string[];
  coachTypes: string[];

  brailleRequired: boolean;
  commercialAttributes: string[];

  deviceId: number;
}

export interface ConnectionTrain {
  departureStationId: number;
  arrivalStationId: number;

  trainNumber: number;
  trainCategory: string;
  trainName: string;

  departureTime: string; // ISO datetime
  arrivalTime: string;   // ISO datetime
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

  departureTime: string;
  arrivalTime: string;
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

export const mapSearchConnectionResponse = (
  res: SearchConnectionsResponse
): Connection[] => {
  return res.polaczenia.map((c) => ({
      id: c.idPolaczenia,
      departureTime: c.dataWyjazdu,
      arrivalTime: c.dataPrzyjazdu,
      travelTimeMinutes: c.czasJazdy,

      transferTime: c.czasNaPrzesiadke,
      transferTime2: c.czasNaPrzesiadke2,

      availableInPresale: c.dostepneWPrzedsprzedazy,
      presaleMessages: c.komunikatPrzedsprzedaz,

      segments: c.pociagi.map((p) => ({
        departureStationId: p.stacjaWyjazdu,
        arrivalStationId: p.stacjaPrzyjazdu,

        trainNumber: p.nrPociagu,
        trainCategory: p.kategoriaPociagu,
        trainName: p.nazwaPociagu,

        departureTime: p.dataWyjazdu,
        arrivalTime: p.dataPrzyjazdu,
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


// Route
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
    stationId: number;
    stationName: string;
    stationCode: string;
    stationType: string;
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
    stationTo: string;
}

export interface TrainRouteResponse {
    trasePrzejezdu: {
        trasaPrzejazdu: TrainStopResponse[];
        trasaPrzejazduInformacje: TrainRouteInfoResponse[];
    };
    bledy: any[];
}

export const parseDate = (value: string): Date | null => {
    if (!value || value.trim() === "") return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
};

export const mapTrainRouteResponse = (response: TrainRouteResponse): TrainRoute => {
    const { trasaPrzejazdu, trasaPrzejazduInformacje } = response.trasePrzejezdu;

    return {
        stops: trasaPrzejazdu.map(stop => ({
            stationId: stop.stacja,
            stationName: stop.nazwaStacji,
            stationCode: stop.kodStacji,
            stationType: stop.typStacji,
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
        info: trasaPrzejazduInformacje.map(i => ({
            code: i.kod,
            description: i.opis,
            stationTo: i.stacjaDo
        }))
    };
};

