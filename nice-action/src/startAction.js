"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const nice_common_1 = require("nice-common");
const perf_hooks_1 = require("perf_hooks");
const WebSocket = __importStar(require("ws"));
const lightsApiClient_1 = require("../../nice-mapper/src/lightsApiClient"); // TODO - Nasty direct import here. Could be nice-implementations-node, or some other new module.
async function run() {
    try {
        const wss = new WebSocket.Server({ port: 8080 });
        const lights = new lightsApiClient_1.LightsApiClient("http://localhost:8001");
        const director = new nice_common_1.ActionDirector({ leds: nice_common_1.staticLedMappingResult.foundLeds }, lights, () => perf_hooks_1.performance.now());
        const actionHandler = nice_common_1.getActionDirectorMessageHandler(director);
        wss.on("connection", function connection(ws) {
            ws.on("message", function incoming(message) {
                const action = tryParse(message.toString());
                if (action) {
                    actionHandler(action);
                }
                else {
                    console.log("Received non-action: %s", message);
                }
            });
            ws.send("something");
        });
        console.log("Started on: " + JSON.stringify(wss.address(), null, 2));
    }
    catch (error) {
        console.error(error);
    }
}
run();
function tryParse(message) {
    try {
        const action = JSON.parse(message);
        return action;
    }
    catch (error) {
        return undefined;
    }
}
