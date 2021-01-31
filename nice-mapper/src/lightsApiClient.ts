import fetch from "node-fetch"
import { delay } from "./utils";

export class LightsApiClient {
    constructor(private readonly baseUrl: string) {
    }

    async turnOnLight(index: number, color: number) {
        const params = new URLSearchParams({ index: index.toString(), color: color.toString() });
        await fetch(`${this.baseUrl}/lights/single/?${params}`);
        await delay(100);
    }

    async reset() {
        await fetch(`${this.baseUrl}/lights/reset/`);
        await delay(100);
    }
}