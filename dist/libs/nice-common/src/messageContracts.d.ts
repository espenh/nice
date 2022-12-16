import { ICoordinate, IPlacedObject } from "./domainContracts";
export interface IDetectedObjectAndPositionMessage {
    type: "detected-object";
    id: string;
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
export interface IDetectedObjectsMessage {
    type: "detected-objects";
    coordinates: ICoordinate[];
}
export declare type NiceActionMessage = IDetectedObjectAndPositionMessage | IPlacedReactionObjectMessage | IPlacedObjectDeletedMessage | ITriggerEffectMessage | IDetectedObjectsMessage;
export declare type ActionMessageHandler = (message: NiceActionMessage) => void;
