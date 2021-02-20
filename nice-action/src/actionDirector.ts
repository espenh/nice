import Color from "color";
import _ from "lodash";
import { performance } from "perf_hooks";
import { ColorsByIndex, LightsApiClient } from "../../nice-mapper/src/lightsApiClient";
import { ILedStatus, IPlacedObject, IRectangle } from "./contracts";
import { EffectsCollection } from "./effects/effectsCollection";
import { HighlightObjectEffect } from "./effects/highlightObjectEffect";
import { MovingObjectState } from "./movingObjectState";
import { PlacedObjectState } from "./placedObjectState";
import { findOccludedLeds, isOccluded } from "./utils/ledOcclusion";

export class ActionDirector {
    // TODO - These should not be public.
    public objectState = new PlacedObjectState();
    public movingState = new MovingObjectState();
    public effectCollection: EffectsCollection;

    private previousLightSent: ColorsByIndex | undefined;
    private lastTickTime: number | undefined;

    constructor(private ledStatus: ILedStatus, private ledClient: LightsApiClient) {

        this.effectCollection = new EffectsCollection();

        setInterval(async () => {
            const now = performance.now();
            const timeSinceLast = this.lastTickTime === undefined ? 0 : now - this.lastTickTime;

            try {
                console.time("tick");
                await this.tick(timeSinceLast);

            } catch (error) {
                // TODO - Silent for now as it's mostly connection issues for when the lights service isn't started.
                // Add a check on startup to see that we have all required services ready.
                // Kill this interval if we fail x times in a row.
            } finally {
                this.lastTickTime = performance.now();
                console.timeEnd("tick");
            }
        }, 200);
    }

    public placeObject(object: IPlacedObject) {
        this.objectState.placeObject(object);
    }

    public removePlacedObject(objectId: string) {
        this.objectState.removeObject(objectId);
    }

    private processMovingObjects() {
        // Any moving objects nearby placed objects?
        const movingState = this.movingState.getState();
        const placedState = this.objectState.getState();

        if (movingState.movingObjects.length === 0 || placedState.placedObjects.length === 0) {
            return;
        }

        for (const movingObject of movingState.movingObjects) {
            const intersectingFixed = placedState.placedObjects.find(p => isOccluded(movingObject.coordinate, p.rectangle));
            if (intersectingFixed) {
                console.log("INTERSECTION!");
                this.effectCollection.add(new HighlightObjectEffect(intersectingFixed));
            }
        }

    }

    public async tick(ellapsedMilliseconds: number) {
        this.processMovingObjects();

        // Find occluded leds by placed object.
        const state = this.objectState.getState();
        const objectsOccludingLeds = state.placedObjects.map(object => {
            const leds = this.findOccludedLedsMemoized(object.rectangle);
            return {
                object,
                leds
            };
        }).filter(x => x.leds.length > 0);

        const frameFromPlacedObjects: ColorsByIndex = _.fromPairs(_.flatten(objectsOccludingLeds.map(o => {
            const color = Color(o.object.color);
            const rgb = { r: color.red(), g: color.green(), b: color.blue() };
            return o.leds.map(l => [l.index, rgb]);
        })));

        // Apply any effects.
        const frameWithAppliedEffects = this.effectCollection.tick(ellapsedMilliseconds, frameFromPlacedObjects, { ledInfo: this.ledStatus, placedObject: state.placedObjects });

        // No need to send the same frame.
        if (this.previousLightSent && _.isEqual(this.previousLightSent, frameWithAppliedEffects)) {
            return;
        }

        try {
            console.log(JSON.stringify({ frameWithAppliedEffects }));
            this.previousLightSent = frameWithAppliedEffects;
            await this.ledClient.turnOnLights(frameWithAppliedEffects);
        } catch (error) {
            console.log("Failed turning on lights." + error && error.message ? error.message : "")
        }
    }

    private findOccludedLedsMemoized = _.memoize((rectangle: IRectangle) => {
        return this.ledStatus.leds.filter(led => isOccluded(led.position, rectangle));
    });
}
