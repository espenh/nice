import * as _ from "lodash";
import { ColorsByIndex, delay, ILedInfo, ILightsClient } from "@nice/nice-common";
import fetch from "node-fetch";


export class LightsApiClient implements ILightsClient {
  constructor(private readonly baseUrl: string) {}

  async getLedInfo() {
    const response = await fetch(`${this.baseUrl}/lights/info/`);
    const ledData = (await response.json()) as ILedInfo;
    return ledData;
  }

  async turnOnLight(index: number, color: number) {
    const params = new URLSearchParams({
      index: index.toString(),
      color: color.toString(),
    });
    await fetch(`${this.baseUrl}/lights/single/?${params}`);
    await delay(100);
  }

  async turnOnLights(colorsByIndex: ColorsByIndex) {
    await fetch(`${this.baseUrl}/lights/multi/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colorsByIndex),
    });
    await delay(20);
  }

  async turnOnLightRgb(indexes: {
    redIndex?: number | undefined;
    greenIndex?: number | undefined;
    blueIndex?: number | undefined;
  }) {
    const indexesAsString = _.mapValues(indexes, (i) => i?.toString());
    const params = new URLSearchParams(indexesAsString as any); // TODO - Don't cast.
    await fetch(`${this.baseUrl}/lights/rgb/?${params}`);
    await delay(300);
  }

  async reset() {
    await fetch(`${this.baseUrl}/lights/reset/`);
    await delay(500);
  }
}
