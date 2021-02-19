import Color from "color";
import _ from "lodash";
import { ColorsByIndex, LightsApiClient } from "../../nice-mapper/src/lightsApiClient";
import { ActionState } from "./actionState";
import { ICoordinate, ILedStatus, IPlacedObject, IRectangle } from "./contracts";

export class ActionDirector {
    private state = new ActionState();

    constructor(private ledStatus: ILedStatus, private ledClient: LightsApiClient) {
        setInterval(() => {
            this.tick();
        }, 2000);
    }

    public placeObject(object: IPlacedObject) {
        this.state.placeObject(object);
    }

    public removePlacedObject(objectId: string) {
        this.state.removeObject(objectId);
    }

    private findOccludedLeds = _.memoize((rectangle: IRectangle) => {
        return this.ledStatus.leds.filter(led => isOccluded(led.position, rectangle));
    });

    private previousLightSent: ColorsByIndex | undefined;

    public async tick() {
        // Find occluded leds by placed object.
        const state = this.state.getState();
        const objectsOccludingLeds = state.placedObjects.map(object => {
            const leds = this.findOccludedLeds(object.rectangle);
            return {
                object,
                leds
            };
        }).filter(x => x.leds.length > 0);

        const colorsByIndex = _.fromPairs(_.flatten(objectsOccludingLeds.map(o => {
            const color = Color(o.object.color);
            const rgb = { r: color.red(), g: color.green(), b: color.blue() };
            return o.leds.map(l => [l.index, rgb]);
        })));

        if (this.previousLightSent && _.isEqual(this.previousLightSent, colorsByIndex)) {
            return;
        }

        try {
            console.log(JSON.stringify({ colorsByIndex }));
            await this.ledClient.turnOnLights(colorsByIndex);
            this.previousLightSent = colorsByIndex;
        } catch (error) {
            console.log("Failed turning on lights." + error && error.message ? error.message : "")
        }
    }
}

function isOccluded(point: ICoordinate, placedObject: IRectangle) {
    // Note: the rectangle can be rotated.
    // TODO - If the rectangle is uniform(name? parallel sides), it could be quicker to
    // revert the rotation for both the rectangle and the point, and then do a simple check.

    return pointInPolygon(point, [placedObject.topLeft, placedObject.topRight, placedObject.bottomRight, placedObject.bottomLeft]);
}

function pointInPolygon(point: ICoordinate, vs: ICoordinate[]) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    const { x, y } = point;

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].x, yi = vs[i].y;
        var xj = vs[j].x, yj = vs[j].y;

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
};