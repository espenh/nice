import { ColorsByIndex, ILedStatus, IPlacedObject } from "../domainContracts";
export interface IEffect {
    isFinished: boolean;
    tick(milliseconds: number, props: IEffectProps): ColorsByIndex;
}
export interface IEffectProps {
    ledInfo: ILedStatus;
    placedObject: IPlacedObject[];
}
