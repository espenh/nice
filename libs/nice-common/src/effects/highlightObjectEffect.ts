import * as _ from "lodash";
import { ColorsByIndex, IPlacedObject } from "../domainContracts";
import { IEffect, IEffectProps } from "./effectContracts";
import { findOccludedLeds } from "../utils/ledOcclusion";

// A very basic glow effect.
// The glow is dispersed out from the object in the cable dimension,
// lighting up x leds in both directions on the cable.
export class HighlightObjectEffect implements IEffect {
  public isFinished = false;
  private spentEffectLength = 0;

  constructor(
    private readonly object: IPlacedObject,
    private wantedEffectLengthInMs = 2000
  ) {}

  tick(ellapsedMilliseconds: number, props: IEffectProps): ColorsByIndex {
    if (this.isFinished) {
      return {};
    }

    const leds = findOccludedLeds(
      props.ledInfo.leds,
      this.object.rectangle
    ).map((l) => l.index);

    if (leds.length === 0) {
      return {};
    }

    // Find the "glow" positions.
    // This is currently just the next few leds out from the object.
    // TODO - Basing on index for now (position on the wire). Since we have the position info, we could use distance.
    const min = _.min(leds)!;
    const max = _.max(leds)!;

    const ledCountToGoInEitherDirection = 5;
    const lowerLeds = _.range(
      Math.max(0, min - ledCountToGoInEitherDirection),
      min
    );
    const higherLeds = _.range(
      max + 1,
      Math.min(
        props.ledInfo.leds.length - 1,
        max + ledCountToGoInEitherDirection + 1
      )
    );

    // Increase red-ness given effect time remaining.
    // TODO - Could be cool to use a ramping function here. Currently just linear.
    const remainingEffectAsFraction =
      1 - this.spentEffectLength / this.wantedEffectLengthInMs;
    const redness = Math.round(255 * remainingEffectAsFraction);

    this.spentEffectLength += ellapsedMilliseconds;
    if (this.spentEffectLength >= this.wantedEffectLengthInMs) {
      this.isFinished = true;
    }

    return _.fromPairs(
      lowerLeds
        .concat(higherLeds)
        .map((led) => [led, { r: redness, g: 0, b: 0 }])
    );
  }
}
