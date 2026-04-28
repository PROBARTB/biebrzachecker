export interface IcLegacyStation {
  n: string; // name
  p: string; // name ascii
  h: string; // code EVA
  a: string;
  i: string; // id  EPA
  x: string;
  y: string;
}

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
