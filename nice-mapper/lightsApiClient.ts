import fetch from "node-fetch"

export class LightsApiClient {
    constructor(private readonly baseUrl: string) {
    }

    async turnOnLight(index: number, color: number) {
        const params = new URLSearchParams({ index: index.toString(), color: color.toString() });
        await fetch(`${this.baseUrl}/lights/single/?${params}`)
    }
}