// Some unnecessary object creation here, 
// but this class could expand if we want to 
// improve the tracking beyond basic x,y, as it's not really "tracking" currently.
export class MovingObjectState {
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
//# sourceMappingURL=movingObjectState.js.map