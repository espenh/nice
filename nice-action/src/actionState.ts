import { IPlacedObject, IRectangle } from "./contracts";

export interface IActionState {
    placedObjects: IPlacedObject[];  
}

export class ActionState {
    private placedObjectsById: Map<string, IPlacedObject> = new Map();

    private stateSnapshotCache: IActionState | undefined;

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

    public getState(): IActionState {
        if (!this.stateSnapshotCache) {
            const placedObjects = Array.from(this.placedObjectsById.values());

            this.stateSnapshotCache = {
                placedObjects
            };
        }

        return this.stateSnapshotCache;
    }
}