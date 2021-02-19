import _ from "lodash";
import { useContext, useEffect } from "react";
import { FabricContext } from "../context/fabricContext";
import { useActionConnection } from "./useActionConnection";

export function useEditorObjectState() {
  const { canvas } = useContext(FabricContext);
  const connection = useActionConnection();

  useEffect(() => {
    if (!canvas || !connection) {
      console.log("no connection");
      return;
    }

    const eventsToTrack = [
      "object:moving",
      "object:scaling",
      "object:rotating",
      "object:skewing",
      "object:added",
      "object:modified",
      "object:removed",
    ];

    const dumpState = _.debounce(() => {
      const allObjects = canvas.getObjects();
      const leds = allObjects.filter((o) => o.data?.type === "led");
      const nonLedOBjects = allObjects.filter((o) => o.data?.type !== "led");

      const obscuredLeds = _.uniq(
        nonLedOBjects.flatMap((obscuring) => {
          return leds.filter((l) => l.intersectsWithObject(obscuring));
        })
      );

      console.log(obscuredLeds);


    }, 1000);

    const communicateObjectStateThrottled = _.throttle((object: fabric.Object | undefined) => {
      if (!object) {
        return;
      }

      // We currently only support placed rectangles.
      if (object.type === "rect") {
        connection.updateObject(object as fabric.Rect);
      }
    }, 500);

    eventsToTrack.forEach((event) => {
      canvas.on(event, (x) => {
        // dumpState();

        if (event === "object:removed") {
          connection.removeObject(x.target?.data?.id);
        } else {
          communicateObjectStateThrottled(x.target);
        }
      });
    });
  }, [canvas, connection]);
}
