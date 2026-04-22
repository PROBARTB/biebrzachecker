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