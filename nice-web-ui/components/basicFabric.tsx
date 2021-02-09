import { fabric } from "fabric";
import { prependOnceListener } from "process";
import React from "react";

export interface IBasicFabricProps {
  leds: ILedPos[];
}

interface ILedPos {
  index: number;
  position: ICoordinate;
}

interface ICoordinate {
  x: number;
  y: number;
}

export const BasicFabric: React.FunctionComponent<IBasicFabricProps> = (
  props
) => {
  React.useEffect(() => {
    const canvas = new fabric.Canvas("my-fabric-canvas");

    canvas.setBackgroundImage("/baseline.jpg", () => {});
    const rect = new fabric.Rect({
      width: 50,
      height: 50,
      fill: "blue",
      angle: 10,
      top: 20,
      left: 20,
    });

    for (const led of props.leds) {
      console.log("Adding dot");
      const dot = new fabric.Circle({
        left: led.position.x,
        top: led.position.y,
        fill: "blue",
        radius: 5,
        strokeWidth: 1,
        stroke: "black",
        selectable: true,
        originX: "center",
        originY: "center",
        width: 5,
      });
      canvas.add(dot);
    }

    canvas.add(rect);

    // UseEffect's cleanup function
    return () => {
      canvas.dispose();
    };
  }, []);

  return (
    <div className="App">
      <canvas id="my-fabric-canvas" width="1024" height="768" />
    </div>
  );
};
