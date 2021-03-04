import {
    ActionDirector,
    getActionDirectorMessageHandler,
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

        const actionHandler = getActionDirectorMessageHandler(director);

        wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
                const action = tryParse(message.toString());
                if (action) {
                    actionHandler(action);
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
