import { LightsApiClient } from "./lightsApiClient";

console.log("nice-mapper started");

async function runMapping() {
    const client = new LightsApiClient("http://localhost:8000");
    await client.turnOnLight(202, 0);
}

async function run() {
    try {
        await runMapping();
    } catch (error) {
        console.error(error);
    }
}

run();
