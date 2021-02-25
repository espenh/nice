import Color from "color";
import _ from "lodash";
import { performance } from "perf_hooks";
import {
    ColorsByIndex,
    LightsApiClient
} from "../../nice-mapper/src/lightsApiClient";
import { ILedPos, ILedStatus, IPlacedObject, IRectangle } from "./contracts";
import { EffectsCollection } from "./effects/effectsCollection";
import { HighlightObjectEffect } from "./effects/highlightObjectEffect";
import { MovingObjectState } from "./movingObjectState";
import { PlacedObjectState } from "./placedObjectState";
import { isOccluded } from "./utils/ledOcclusion";

interface ILedAndTime {
    led: ILedPos;
    time: number;
}

export class ActionDirector {
    // TODO - These should not be public.
    public objectState = new PlacedObjectState();
    public movingState = new MovingObjectState();
    public effectCollection: EffectsCollection;

    private previousLightSent: ColorsByIndex | undefined;
    private lastTickTime: number | undefined;
    private currentlyAffectedLedIndexes: ILedAndTime[] = [];

    constructor(
        private ledStatus: ILedStatus,
        private ledClient: LightsApiClient
    ) {
        this.effectCollection = new EffectsCollection();

        setInterval(async () => {
            const now = performance.now();
            const timeSinceLast =
                this.lastTickTime === undefined ? 0 : now - this.lastTickTime;

            try {
                await this.tick(timeSinceLast);
            } catch (error) {
                // TODO - Silent for now as it's mostly connection issues for when the lights service isn't started.
                // Add a check on startup to see that we have all required services ready.
                // Kill this interval if we fail x times in a row.
            } finally {
                this.lastTickTime = performance.now();
            }
        }, 30);
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

        if (
            movingState.movingObjects.length === 0 ||
            placedState.placedObjects.length === 0
        ) {
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
                return distance > 500;
            }
        });

        // Find placed objects that are intersecting with movement.
        for (const movingObject of movingObjectsNotToClose) {
            const intersectingFixed = placedState.placedObjects.find((p) =>
                isOccluded(movingObject.coordinate, p.rectangle)
            );

            if (intersectingFixed) {
                // Apply effect to "hit" object.
                this.effectCollection.add(new HighlightObjectEffect(intersectingFixed));
            }
        }
    }

    public async tick(ellapsedMilliseconds: number) {
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

        const frameFromPlacedObjects: ColorsByIndex = _.fromPairs(
            _.flatten(
                objectsOccludingLeds.map((o) => {
                    const color = Color(o.object.color);
                    const rgb = { r: color.red(), g: color.green(), b: color.blue() };
                    return o.leds.map((l) => [l.index, rgb]);
                })
            )
        );

        // Apply any effects.
        const {
            frame,
            affectedLedIndexes,
        } = this.effectCollection.tick(
            ellapsedMilliseconds,
            frameFromPlacedObjects,
            { ledInfo: this.ledStatus, placedObject: state.placedObjects }
        );

        // Store all leds affected by effects.
        this.currentlyAffectedLedIndexes.push(
            ...affectedLedIndexes
                .map((index) => this.ledStatus.leds.find((led) => led.index === index)!)
                .map((led) => {
                    return {
                        led: led,
                        time: performance.now(),
                    };
                })
        );

        // No need to send the same frame.
        if (this.previousLightSent && _.isEqual(this.previousLightSent, frame)) {
            return;
        }

        try {
            this.previousLightSent = frame;
            await this.ledClient.turnOnLights(frame);
        } catch (error) {
            console.log(
                "Failed turning on lights." + error && error.message
                    ? error.message
                    : ""
            );
        }

        // Remove ignore status of leds that have been part of a highlight more than x seconds ago.
        const now = performance.now();
        this.currentlyAffectedLedIndexes = this.currentlyAffectedLedIndexes.filter(i => (now - i.time) < 5000);
    }

    private findOccludedLedsMemoized = _.memoize((rectangle: IRectangle) => {
        return this.ledStatus.leds.filter((led) =>
            isOccluded(led.position, rectangle)
        );
    });
}
