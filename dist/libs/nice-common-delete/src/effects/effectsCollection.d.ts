import { ColorsByIndex } from "../domainContracts";
import { IEffect, IEffectProps } from "./effectContracts";
export declare class EffectsCollection {
    private effects;
    add(effect: IEffect): void;
    tick(milliseconds: number, inputFrame: ColorsByIndex, props: IEffectProps): {
        frame: ColorsByIndex;
        affectedLedIndexes: number[];
    };
}
