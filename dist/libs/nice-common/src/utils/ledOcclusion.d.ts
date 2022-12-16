import { ICoordinate, ILedPos, IRectangle } from "../domainContracts";
export declare function findOccludedLeds(leds: ILedPos[], rectangle: IRectangle): ILedPos[];
export declare function isOccluded(point: ICoordinate, placedObject: IRectangle): boolean;
export declare function pointInPolygon(point: ICoordinate, vs: ICoordinate[]): boolean;
