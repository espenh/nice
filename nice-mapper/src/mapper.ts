import { CameraApiClient } from "./cameraApiClient";
import { LightsApiClient } from "./lightsApiClient";
import { jsonLog } from "./utils";

console.log("nice-mapper started");

async function runMapping() {
    const lights = new LightsApiClient("http://localhost:8001");
    const camera = new CameraApiClient("http://localhost:8000");

    await lights.reset();
    await camera.setBaseline();

    jsonLog("Capturing before");
    jsonLog(await camera.captureRgb());
    console.log("Turning on")
    await lights.turnOnLight(202, 0);
    await lights.turnOnLight(204, 1);
    jsonLog("Capturing after");
    jsonLog(await camera.captureRgb());
}

async function run() {
    try {
        await runMapping();
    } catch (error) {
        console.error(error);
    }
}

run();
