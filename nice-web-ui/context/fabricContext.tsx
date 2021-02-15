import { fabric } from "fabric";
import React, { createContext, useCallback, useState } from "react";

interface IFabricContextProps {
  canvas: fabric.Canvas | null;
  initCanvas(el: HTMLCanvasElement): void;
  activeObject: any;
  setActiveObject(object: any): void;
}

export const FabricContext = createContext<IFabricContextProps>(
  (undefined as unknown) as IFabricContextProps
);

export const FabricContextProvider: React.FunctionComponent<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState(null);

  const initCanvas = useCallback((el: HTMLCanvasElement) => {
    const canvasOptions = {
      preserveObjectStacking: true,
      selection: true,
      defaultCursor: "default",
      backgroundColor: "#f3f3f3",
    };
    const canvas = new fabric.Canvas(el, canvasOptions);
    canvas.renderAll();
    setCanvas(canvas);
  }, []);

  const loadFromJSON = useCallback((el, json) => {
    let c = new fabric.Canvas(el);
    c.loadFromJSON(json, () => {
      c.renderAll.bind(c);
      c.setWidth(json.width);
      c.setHeight(json.height);
    });
    c.renderAll();
    setCanvas(c);
  }, []);

  return (
    <FabricContext.Provider
      value={{
        canvas,
        initCanvas,
        //loadFromJSON,
        activeObject,
        setActiveObject,
      }}
    >
      {children}
    </FabricContext.Provider>
  );
};
