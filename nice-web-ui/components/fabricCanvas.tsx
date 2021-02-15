import React, { useCallback, useContext, useEffect, useRef } from "react";
import { FabricContext } from "../context/fabricContext";

interface IFabricCanvasProps {}

export const FabricCanvas: React.FunctionComponent<IFabricCanvasProps> = () => {
  const canvasEl = useRef(null);
  const { canvas, initCanvas, setActiveObject } = useContext(FabricContext);

  useEffect(() => {
    initCanvas(canvasEl.current);
  }, [canvasEl, initCanvas]);

  const updateActiveObject = useCallback(
    (e) => {
      if (!e) {
        return;
      }
      setActiveObject(canvas.getActiveObject());
      canvas.renderAll();
    },
    [canvas, setActiveObject]
  );

  useEffect(() => {
    if (!canvas) {
      return;
    }
    canvas.on("selection:created", updateActiveObject);
    canvas.on("selection:updated", updateActiveObject);
    canvas.on("selection:cleared", updateActiveObject);

    return () => {
      canvas.off("selection:created");
      canvas.off("selection:cleared");
      canvas.off("selection:updated");
    };
  }, [canvas, updateActiveObject]);

  return <canvas ref={canvasEl} id="fabric-canvas" width={800} height={600} />;
};
