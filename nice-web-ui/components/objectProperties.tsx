import { useContext, useEffect, useMemo } from "react";
import { Pane } from "tweakpane";
import { ActionConnectionContext } from "../context/actionConnectionContext";
import { FabricContext } from "../context/fabricContext";

export const ObjectProperties: React.FunctionComponent = () => {
  const { canvas } = useContext(FabricContext);
  const { sendMessage } = useContext(ActionConnectionContext);

  const pane = useMemo(() => {
    const pane = new Pane({ expanded: true });
    return pane;
  }, []);

  useEffect(() => {
    if (!canvas) {
      return;
    }

    const objectParams = {
      color: "#0f0",
    };

    const color = pane.addInput(objectParams, "color", { label: "Color" });
    color.on("change", (newColor) => {
      const activeObjects = canvas.getActiveObjects();
      for (const object of activeObjects) {
        object.set("fill", newColor.value);
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

    const effects = pane.addFolder({ title: "Effects" });
    const btn = effects.addButton({
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
  }, [canvas, pane]);

  return <></>;
};
