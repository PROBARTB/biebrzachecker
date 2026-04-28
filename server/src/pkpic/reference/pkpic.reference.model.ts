export interface Station {
    codeId: number;
    EPAId: number;
    EVAId: number;
    POSId: number;

    name: string;

    countryName: string;
    country: string;
    lat: number;
    lon: number;

    agglomerationId: number; //???
    agglomerationExchange: number; //???
    urbanTicket: boolean; //???
    type: number; //???
}

export interface ResponseStation {
  kod: number;
  nazwa: string;
  szerokoscGeograficzna: string;
  dlugoscGeograficzna: string;
  aktualizacjaData: string;
  kodEPA: number;
  kodEVA: number;
  kodPOS: number;
  typ: number;
  wymianaAglomeracja: number;
  kodAglomeracji: number;
  kraj: string;
  skrotKraju: string;
  biletMiejski: boolean;
}

export interface GetStationsResponse {
  stacje: ResponseStation[];
}

export const mapStationResponse = (s: ResponseStation): Station => ({
  codeId: s.kod,
  EPAId: s.kodEPA,
  EVAId: s.kodEVA,
  POSId: s.kodPOS,

  name: s.nazwa,

  lat: Number(s.szerokoscGeograficzna),
  lon: Number(s.dlugoscGeograficzna),

  type: s.typ,

  agglomerationExchange: s.wymianaAglomeracja,
  agglomerationId: s.kodAglomeracji,

  countryName: s.kraj,
  country: s.skrotKraju,

  urbanTicket: s.biletMiejski
});
export const mapGetStationsResponse = (res: GetStationsResponse): Station[] => {
  return res.stacje.map(mapStationResponse);
};

