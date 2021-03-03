import { ColorsByIndex } from "../domainContracts";

export interface ILightsClient {
    turnOnLights(colorsByIndex: ColorsByIndex): Promise<void>;
}