import { ColorsByIndex } from "../../../nice-mapper/src/lightsApiClient";
import { ILedStatus, IPlacedObject } from "../contracts";

export interface IEffect {
    isFinished: boolean;
    tick(milliseconds: number, props: IEffectProps): ColorsByIndex;
}

export interface IEffectProps {
    ledInfo: ILedStatus;
    placedObject: IPlacedObject[];
}