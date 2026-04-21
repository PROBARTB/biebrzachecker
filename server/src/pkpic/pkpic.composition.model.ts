import { PkpicEPAStationId } from "./pkpic.model.js";

//https://api-gateway.intercity.pl/grm/sklad/wbnet/IC/1516/202604222037/5100136/202604221701/5100023
export interface GetTrainCompositionPayload {
    trainCategory: string;
    trainNumber: number;
    departureDate: Date;
    departureStationId: PkpicEPAStationId;
    arrivalDate: Date;
    arrivalStationId: PkpicEPAStationId;
}

export interface GetTrainCompositionResponse {
    kierunekJazdy: number;
    klasa0: number[];
    klasa1: number[];
    klasa2: number[];
    klasaDomyslnyWagon: Partial<Record<1 | 2, number>>;
    pojazdNazwa: string;
    pojazdTyp: string;
    wagony: number[];
    wagonyNiedostepne: number[];
    wagonySchemat: Record<number, string>;
    wagonyUdogodnienia: Record<number, string[]>;
    zmieniaKierunek: boolean;
}

export interface TrainComposition {
    drivingDirection: number;
    changesDrivingDirection: boolean;
    trainName: string;
    rollingStockClass: string;
    defaultCarriageForClass: Partial<Record<1 | 2, number>>;
    carriages: TrainCompositionCarriage[];
    unavailableCarriages: number[];
}

export interface TrainCompositionCarriage {
    number: number;
    class: 0 | 1 | 2;
    type: string;
    amenities: number[];
}

export const mapTrainCompositionResponse = (
  res: GetTrainCompositionResponse
): TrainComposition => {
  const carriageClassMap = new Map<number, 0 | 1 | 2>();

  res.klasa0.forEach(w => carriageClassMap.set(w, 0));
  res.klasa1.forEach(w => carriageClassMap.set(w, 1));
  res.klasa2.forEach(w => carriageClassMap.set(w, 2));

  const carriages: TrainCompositionCarriage[] = res.wagony.map(number => ({
    number: number,
    class: carriageClassMap.get(number) ?? 0,
    type: res.wagonySchemat[number] ?? "UNKNOWN",
    amenities: res.wagonyUdogodnienia[number]?.map(c => Number(c)) ?? []
  }));

  return {
    drivingDirection: res.kierunekJazdy,
    changesDrivingDirection: res.zmieniaKierunek,
    trainName: res.pojazdNazwa,
    rollingStockClass: res.pojazdTyp,
    defaultCarriageForClass: res.klasaDomyslnyWagon,
    carriages,
    unavailableCarriages: res.wagonyNiedostepne
  };
};
