import { IPlacedObject } from "./contracts";

export interface IPlacedObjectStateSnapshot {
    placedObjects: IPlacedObject[];
}

export class PlacedObjectState {

    private placedObjectsById: Map<string, IPlacedObject> = new Map();
    private stateSnapshotCache: IPlacedObjectStateSnapshot | undefined;

    constructor() { }

    private clearCache() {
        // Iffy local caching for now. Clear when mutating.
        this.stateSnapshotCache = undefined;
    }

    public placeObject(object: IPlacedObject) {
        this.placedObjectsById.set(object.id, object);
        this.clearCache();
    }

    public removeObject(objectId: string) {
        this.placedObjectsById.delete(objectId);
        this.clearCache();
    }

    public getObject(objectId: string): IPlacedObject | undefined {
        return this.placedObjectsById.get(objectId);
    }

    public getState(): IPlacedObjectStateSnapshot {
        if (!this.stateSnapshotCache) {
            const placedObjects = Array.from(this.placedObjectsById.values());

            this.stateSnapshotCache = {
                placedObjects
            };
        }

        return this.stateSnapshotCache;
    }
}