import { IPlacedObject } from "../domainContracts";
export interface IPlacedObjectStateSnapshot {
    placedObjects: IPlacedObject[];
}
export declare class PlacedObjectState {
    private placedObjectsById;
    private stateSnapshotCache;
    constructor();
    private clearCache;
    placeObject(object: IPlacedObject): void;
    removeObject(objectId: string): void;
    getObject(objectId: string): IPlacedObject | undefined;
    getState(): IPlacedObjectStateSnapshot;
}
