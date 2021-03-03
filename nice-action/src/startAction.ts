import {
    ActionDirector,
    HighlightObjectEffect,
    NiceActionMessage,
    staticLedMappingResult
} from "nice-common";
import { performance } from "perf_hooks";
import * as WebSocket from "ws";
import { LightsApiClient } from "../../nice-mapper/src/lightsApiClient"; // TODO - Nasty direct import here. Could be nice-implementations-node, or some other new module.

async function run() {
    try {
        const wss = new WebSocket.Server({ port: 8080 });

        const lights = new LightsApiClient("http://localhost:8001");
        const director = new ActionDirector(
            { leds: staticLedMappingResult.foundLeds },
            lights,
            () => performance.now()
        );

        wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
                const action = tryParse(message.toString());
                // TODO - Move this message handling out of this websocket wire-up.
                if (action) {
                    if (action.type === "placed-object") {
                        director.placeObject(action.object);
                    }

                    if (action.type === "placed-object-deleted") {
                        director.removePlacedObject(action.objectId);
                    }

                    if (action.type === "trigger-effect") {
                        const object = director.objectState.getObject(
                            action.targetObjectId
                        );
                        if (object) {
                            director.effectCollection.add(new HighlightObjectEffect(object));
                        }
                    }

                    if (action.type === "detected-objects") {
                        director.movingState.setObjects(
                            action.coordinates.map((c) => ({ coordinate: c }))
                        );
                    }
                } else {
                    console.log("Received non-action: %s", message);
                }
            });

            ws.send("something");
        });

        console.log("Started on: " + JSON.stringify(wss.address(), null, 2));
    } catch (error) {
        console.error(error);
    }
}

run();

function tryParse(message: string): NiceActionMessage | undefined {
    try {
        const action = JSON.parse(message);
        return action;
    } catch (error) {
        return undefined;
    }
}
