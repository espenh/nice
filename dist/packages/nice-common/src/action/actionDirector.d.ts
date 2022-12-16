import { ILedStatus, IPlacedObject } from "../domainContracts";
import { EffectsCollection } from "../effects/effectsCollection";
import { ILightsClient } from "../lights/lightContracts";
import { ActionMessageHandler } from "../messageContracts";
import { MovingObjectState } from "./movingObjectState";
import { PlacedObjectState } from "./placedObjectState";
export declare class ActionDirector {
    private ledStatus;
    private ledClient;
    private getNow;
    objectState: PlacedObjectState;
    movingState: MovingObjectState;
    effectCollection: EffectsCollection;
    private previousLightSent;
    private lastTickTime;
    private currentlyAffectedLedIndexes;
    constructor(ledStatus: ILedStatus, ledClient: ILightsClient, getNow: () => number);
    placeObject(object: IPlacedObject): void;
    removePlacedObject(objectId: string): void;
    private processMovingObjects;
    tick(ellapsedMilliseconds: number): Promise<void>;
    private findOccludedLedsMemoized;
}
export declare const getActionDirectorMessageHandler: (director: ActionDirector) => ActionMessageHandler;
