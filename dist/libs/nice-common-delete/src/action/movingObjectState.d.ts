import { IMovingObject } from "../domainContracts";
export interface IMovingObjectStateSnapshot {
    movingObjects: IMovingObject[];
}
export declare class MovingObjectState {
    private movingObjects;
    constructor();
    setObjects(movingObjects: IMovingObject[]): void;
    getState(): IMovingObjectStateSnapshot;
}
