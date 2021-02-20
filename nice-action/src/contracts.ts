export interface IPlacedObject {
    id: string;
    rectangle: IRectangle;
    color: string;
}

export interface IMovingObject {
    coordinate: ICoordinate;
}

export interface IRectangle {
    topLeft: ICoordinate;
    topRight: ICoordinate;
    bottomLeft: ICoordinate;
    bottomRight: ICoordinate;
}

// Not ultra efficient for transfer, 
// but can transition to something other than websocket+json 
// if that turns out to be too much of a bottleneck.
export type ICoordinate = { x: number, y: number }

export interface ILedStatus {
    leds: ILedPos[];
}

export interface ILedPos {
    index: number;
    position: ICoordinate;
}
