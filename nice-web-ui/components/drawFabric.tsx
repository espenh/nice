import { fabric } from "fabric";
import React from "react";
import { DrawMode } from "../model/drawContracts";

export interface IDrawFabricProps {
  drawMode: DrawMode;
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

export const DrawFabric: React.FunctionComponent<IDrawFabricProps> = (
  props
) => {
  React.useEffect(() => {
    const canvas = new fabric.Canvas("my-fabric-canvas", { selection: false });

    canvas.setDimensions({ width: 800, height: 600 }, {});
    canvas.renderAll();
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
        selectable: false,
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
    <div className="canvas-wrapper">
      <canvas id="my-fabric-canvas" />
    </div>
  );
};
