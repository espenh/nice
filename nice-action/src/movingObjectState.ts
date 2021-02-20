import { IMovingObject } from "./contracts";

export interface IMovingObjectStateSnapshot {
    movingObjects: IMovingObject[];
}

// Some unnecessary object creation here, 
// but this class could expand if we want to 
// improve the tracking beyond basic x,y, as it's not really "tracking" currently.
export class MovingObjectState {

    private movingObjects: IMovingObject[] = [];

    constructor() { }

    public setObjects(movingObjects: IMovingObject[]) {
        this.movingObjects = movingObjects;
    }

    public getState(): IMovingObjectStateSnapshot {
        return { movingObjects: this.movingObjects };
    }
}