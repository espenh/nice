import { ICoordinate, IPlacedObject } from "./contracts";

export interface IDetectedObjectAndPositionMessage {
    type: "detected-object";

    // This is more future stuff where we could be given tracked points (sticky id).
    id: string;

    // Estimated contact point with the ice.
    ice: ICoordinate;
}

export interface IPlacedReactionObjectMessage {
    type: "placed-object";
    object: IPlacedObject;
}

export interface IPlacedObjectDeletedMessage {
    type: "placed-object-deleted";
    objectId: string;
}

export interface ITriggerEffectMessage {
    type: "trigger-effect";
    targetObjectId: string;
    effectType: string;
}

export type NiceActionMessage =
    | IDetectedObjectAndPositionMessage
    | IPlacedReactionObjectMessage
    | IPlacedObjectDeletedMessage
    | ITriggerEffectMessage;
