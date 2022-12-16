import { ColorsByIndex, IPlacedObject } from "../domainContracts";
import { IEffect, IEffectProps } from "./effectContracts";
export declare class HighlightObjectEffect implements IEffect {
    private readonly object;
    private wantedEffectLengthInMs;
    isFinished: boolean;
    private spentEffectLength;
    constructor(object: IPlacedObject, wantedEffectLengthInMs?: number);
    tick(ellapsedMilliseconds: number, props: IEffectProps): ColorsByIndex;
}
