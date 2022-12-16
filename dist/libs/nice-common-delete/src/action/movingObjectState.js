"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovingObjectState = void 0;
// Some unnecessary object creation here, 
// but this class could expand if we want to 
// improve the tracking beyond basic x,y, as it's not really "tracking" currently.
class MovingObjectState {
    constructor() {
        this.movingObjects = [];
    }
    setObjects(movingObjects) {
        this.movingObjects = movingObjects;
    }
    getState() {
        return { movingObjects: this.movingObjects };
    }
}
exports.MovingObjectState = MovingObjectState;
//# sourceMappingURL=movingObjectState.js.map