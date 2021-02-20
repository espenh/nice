import { useContext, useEffect, useMemo } from "react";
import Tweakpane from "tweakpane";
import { ActionConnectionContext } from "../context/actionConnectionContext";
import { FabricContext } from "../context/fabricContext";

export const ObjectProperties: React.FunctionComponent = () => {
  const { canvas } = useContext(FabricContext);
  const { sendMessage } = useContext(ActionConnectionContext);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const objectParams = {
      color: "#0f0",
    };

    const color = pane.addInput(objectParams, "color");
    color.on("change", (newColor: string) => {
      const activeObjects = canvas.getActiveObjects();
      for (const object of activeObjects) {
        object.set("fill", newColor);
      }
      canvas.renderAll();

      for (const object of activeObjects) {
        canvas.fire("object:modified", { target: object });
      }
    });

    canvas.on("selection:created", () => {
      const activeObject = canvas.getActiveObjects()[0];
      if (activeObject) {
        objectParams.color = activeObject.fill?.toString() ?? "pink";
        pane.refresh();
      }
    });

    const btn = pane.addButton({
      title: "Boom",
    });

    btn.on("click", () => {
      const activeObjects = canvas.getActiveObjects();
      for (const object of activeObjects) {
        sendMessage({
          type: "trigger-effect",
          targetObjectId: object.data?.id,
          effectType: "glow",
        });
      }
    });
  }, [canvas]);

  const pane = useMemo(() => {
    const pane = new Tweakpane();
    return pane;
  }, []);

  return <div></div>;
};
