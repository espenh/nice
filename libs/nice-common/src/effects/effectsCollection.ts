import * as _ from "lodash";
import { ColorsByIndex } from "../domainContracts";
import { IEffect, IEffectProps } from "./effectContracts";

export class EffectsCollection {
    private effects: IEffect[] = [];

    add(effect: IEffect) {
        this.effects.push(effect);
    }

    tick(milliseconds: number, inputFrame: ColorsByIndex, props: IEffectProps) {
        if (this.effects.length === 0) {
            return { frame: inputFrame, affectedLedIndexes: [] };
        }

        const effectOutputs: ColorsByIndex[] = [];
        const completedEffects: IEffect[] = [];

        for (const effect of this.effects) {
            const output = effect.tick(milliseconds, props);
            effectOutputs.push(output);

            if (effect.isFinished) {
                completedEffects.push(effect);
            }
        }

        // Remove finished effects.
        _.remove(this.effects, (e) => completedEffects.includes(e));

        // Merge combined result of all effects.
        const outputFrame: ColorsByIndex = { ...inputFrame };
        for (const effectOutput of effectOutputs) {
            for (const ledIndexAsString of Object.keys(effectOutput)) {
                const ledIndex = Number.parseInt(ledIndexAsString);
                if (ledIndex in outputFrame) {
                    // Additive blend effect and frame.
                    outputFrame[ledIndex].r = clamp(
                        outputFrame[ledIndex].r + effectOutput[ledIndex].r
                    );
                    outputFrame[ledIndex].g = clamp(
                        outputFrame[ledIndex].g + effectOutput[ledIndex].g
                    );
                    outputFrame[ledIndex].b = clamp(
                        outputFrame[ledIndex].b + effectOutput[ledIndex].b
                    );
                } else {
                    // Dark led. Just add effect.
                    outputFrame[ledIndex] = {
                        r: clamp(effectOutput[ledIndex].r),
                        g: clamp(effectOutput[ledIndex].g),
                        b: clamp(effectOutput[ledIndex].b),
                    };
                }
            }
        }

        // TODO - A bit nasty.
        //  We're just returning all the led indexes affected by applied effects.
        return {
            frame: outputFrame,
            affectedLedIndexes: _.uniq(
                _.flatMap(effectOutputs, (e) =>
                    Object.keys(e).map((index) => Number.parseInt(index))
                )
            ),
        };
    }
}

function clamp(color: number) {
    return Math.min(255, color);
}
