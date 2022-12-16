"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActionDirectorMessageHandler = exports.ActionDirector = void 0;
const tslib_1 = require("tslib");
const color_1 = tslib_1.__importDefault(require("color"));
const _ = tslib_1.__importStar(require("lodash"));
const effectsCollection_1 = require("../effects/effectsCollection");
const highlightObjectEffect_1 = require("../effects/highlightObjectEffect");
const ledOcclusion_1 = require("../utils/ledOcclusion");
const movingObjectState_1 = require("./movingObjectState");
const placedObjectState_1 = require("./placedObjectState");
class ActionDirector {
    constructor(ledStatus, ledClient, getNow) {
        this.ledStatus = ledStatus;
        this.ledClient = ledClient;
        this.getNow = getNow;
        // TODO - These should not be public.
        this.objectState = new placedObjectState_1.PlacedObjectState();
        this.movingState = new movingObjectState_1.MovingObjectState();
        this.currentlyAffectedLedIndexes = [];
        this.findOccludedLedsMemoized = _.memoize((rectangle) => {
            return this.ledStatus.leds.filter((led) => (0, ledOcclusion_1.isOccluded)(led.position, rectangle));
        });
        this.effectCollection = new effectsCollection_1.EffectsCollection();
        setInterval(async () => {
            const now = this.getNow();
            const timeSinceLast = this.lastTickTime === undefined ? 0 : now - this.lastTickTime;
            try {
                await this.tick(timeSinceLast);
            }
            catch (error) {
                // TODO - Silent for now as it's mostly connection issues for when the lights service isn't started.
                // Add a check on startup to see that we have all required services ready.
                // Kill this interval if we fail x times in a row.
            }
            finally {
                this.lastTickTime = this.getNow();
            }
        }, 30);
    }
    placeObject(object) {
        this.objectState.placeObject(object);
    }
    removePlacedObject(objectId) {
        this.objectState.removeObject(objectId);
    }
    processMovingObjects() {
        // Any moving objects nearby placed objects?
        const movingState = this.movingState.getState();
        const placedState = this.objectState.getState();
        if (movingState.movingObjects.length === 0 ||
            placedState.placedObjects.length === 0) {
            return;
        }
        // Ignore movement in areas where we have effects going on.
        const movingObjectsNotToClose = movingState.movingObjects.filter((m) => {
            if (this.currentlyAffectedLedIndexes.length === 0) {
                return true;
            }
            for (const { led } of this.currentlyAffectedLedIndexes) {
                const a = m.coordinate.x - led.position.x;
                const b = m.coordinate.y - led.position.y;
                const distance = Math.sqrt(a * a + b * b);
                // TODO - EH changed. Verify still works. Was "return distance > 500".
                if (distance > 500) {
                    return true;
                }
            }
            return false;
        });
        // Find placed objects that are intersecting with movement.
        for (const movingObject of movingObjectsNotToClose) {
            const intersectingFixed = placedState.placedObjects.find((p) => (0, ledOcclusion_1.isOccluded)(movingObject.coordinate, p.rectangle));
            if (intersectingFixed) {
                // Apply effect to "hit" object.
                this.effectCollection.add(new highlightObjectEffect_1.HighlightObjectEffect(intersectingFixed));
            }
        }
    }
    async tick(ellapsedMilliseconds) {
        this.processMovingObjects();
        // Find occluded leds by placed object.
        const state = this.objectState.getState();
        const objectsOccludingLeds = state.placedObjects
            .map((object) => {
            const leds = this.findOccludedLedsMemoized(object.rectangle);
            return {
                object,
                leds,
            };
        })
            .filter((x) => x.leds.length > 0);
        const frameFromPlacedObjects = _.fromPairs(_.flatten(objectsOccludingLeds.map((o) => {
            const color = (0, color_1.default)(o.object.color);
            const rgb = { r: color.red(), g: color.green(), b: color.blue() };
            return o.leds.map((l) => [l.index, rgb]);
        })));
        // Apply any effects.
        const { frame, affectedLedIndexes } = this.effectCollection.tick(ellapsedMilliseconds, frameFromPlacedObjects, { ledInfo: this.ledStatus, placedObject: state.placedObjects });
        // Store all leds affected by effects.
        this.currentlyAffectedLedIndexes.push(...affectedLedIndexes
            .map((index) => this.ledStatus.leds.find((led) => led.index === index))
            .map((led) => {
            return {
                led: led,
                time: this.getNow(),
            };
        }));
        // No need to send the same frame.
        if (this.previousLightSent && _.isEqual(this.previousLightSent, frame)) {
            return;
        }
        try {
            this.previousLightSent = frame;
            await this.ledClient.turnOnLights(frame);
        }
        catch (error) {
            console.log("Failed turning on lights." + JSON.stringify(error));
        }
        // Remove ignore status of leds that have been part of a highlight more than x seconds ago.
        const now = this.getNow();
        this.currentlyAffectedLedIndexes = this.currentlyAffectedLedIndexes.filter((i) => now - i.time < 5000);
    }
}
exports.ActionDirector = ActionDirector;
const getActionDirectorMessageHandler = (director) => {
    return (action) => {
        if (action.type === "placed-object") {
            director.placeObject(action.object);
        }
        if (action.type === "placed-object-deleted") {
            director.removePlacedObject(action.objectId);
        }
        if (action.type === "trigger-effect") {
            const object = director.objectState.getObject(action.targetObjectId);
            if (object) {
                director.effectCollection.add(new highlightObjectEffect_1.HighlightObjectEffect(object));
            }
        }
        if (action.type === "detected-objects") {
            director.movingState.setObjects(action.coordinates.map((c) => ({ coordinate: c })));
        }
    };
};
exports.getActionDirectorMessageHandler = getActionDirectorMessageHandler;
//# sourceMappingURL=actionDirector.js.map