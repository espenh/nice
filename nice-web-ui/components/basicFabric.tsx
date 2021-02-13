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
    const canvas = new fabric.Canvas("my-fabric-canvas", {

    });

    canvas.on('mouse:down', function (opt) {
      var evt = opt.e as MouseEvent;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', function (opt) {
      if (this.isDragging) {
        var e = opt.e as MouseEvent;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.on('mouse:up', function (opt) {
      // on mouse up we want to recalculate new interaction
      // for all objects, so we call setViewportTransform
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

    canvas.on('mouse:wheel', function (opt) {
      var delta = (opt.e as WheelEvent).deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      canvas.setZoom(zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    })

    canvas.setDimensions({ width: 800, height: 600 }, {})
    canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), 1);
    canvas.renderAll();

    canvas.setBackgroundImage("/baseline.jpg", () => { });
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
