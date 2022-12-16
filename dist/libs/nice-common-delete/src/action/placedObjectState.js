"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacedObjectState = void 0;
class PlacedObjectState {
    constructor() {
        this.placedObjectsById = new Map();
    }
    clearCache() {
        // Iffy local caching for now. Clear when mutating.
        this.stateSnapshotCache = undefined;
    }
    placeObject(object) {
        this.placedObjectsById.set(object.id, object);
        this.clearCache();
    }
    removeObject(objectId) {
        this.placedObjectsById.delete(objectId);
        this.clearCache();
    }
    getObject(objectId) {
        return this.placedObjectsById.get(objectId);
    }
    getState() {
        if (!this.stateSnapshotCache) {
            const placedObjects = Array.from(this.placedObjectsById.values());
            this.stateSnapshotCache = {
                placedObjects
            };
        }
        return this.stateSnapshotCache;
    }
}
exports.PlacedObjectState = PlacedObjectState;
//# sourceMappingURL=placedObjectState.js.map