import { fabric } from "fabric";
import { ICoordinate, IPlacedReactionObjectMessage } from "nice-common";
import { useContext, useMemo } from "react";
import { ActionConnectionContext } from "../context/actionConnectionContext";


export function useActionConnection() {
  const { sendMessage } = useContext(ActionConnectionContext);

  const communicator = useMemo(() => {

    return {
      removeObject(objectId: string) {
        sendMessage({
          type: "placed-object-deleted",
          objectId
        });
      },
      updateObject(object: fabric.Rect) {
        const objectId = object.data?.id;
        if (objectId === undefined || objectId === null) {
          throw new Error("Got object with no id set.");
        }

        const objectData: IPlacedReactionObjectMessage = {
          type: "placed-object", object: {
            id: objectId,
            color: object.fill.toString() || "pink",
            rectangle: {
              topLeft: getPoint(object.aCoords.tl),
              topRight: getPoint(object.aCoords.tr),
              bottomLeft: getPoint(object.aCoords.bl),
              bottomRight: getPoint(object.aCoords.br),
            }
          }
        };

        sendMessage(objectData);
      }
    };
  }, [sendMessage]);

  return communicator;
}

function getCoordinatesForLine(fromPoint: fabric.Point, toPoint: fabric.Point, centerPoint: fabric.Point, height: number, angle: number) {

  const width = fromPoint.distanceFrom(toPoint)
  const vector = toPoint.subtract(fromPoint)

  // find angle between line's vector and x axis
  let angleRad = Math.atan2(vector.y, vector.x)
  if (angleRad < 0) {
    angleRad = 2 * Math.PI + angleRad
  }
  const angleDeg = fabric.util.radiansToDegrees(angleRad)

  // width = length
  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const topLeft = { x: centerPoint.x - halfWidth, y: centerPoint.y - halfHeight };
  const bottomLeft = { x: centerPoint.x - halfWidth, y: centerPoint.y + halfHeight };
  const topRight = { x: centerPoint.x + halfWidth, y: centerPoint.y - halfHeight };
  const bottomRight = { x: centerPoint.x + halfWidth, y: centerPoint.y + halfHeight };


  function doit(p: any) {
    const tempX = p.x - centerPoint.x;
    const tempY = p.y - centerPoint.y;

    // now apply rotation
    const rotatedX = tempX * Math.cos(angleDeg) - tempY * Math.sin(angleDeg);
    const rotatedY = tempX * Math.sin(angleDeg) + tempY * Math.cos(angleDeg);

    // translate back
    return {
      x: rotatedX + centerPoint.x,
      y: rotatedY + centerPoint.y
    };
  }

  return {
    topLeft: doit(topLeft),
    bottomLeft: doit(bottomLeft),
    topRight: doit(topRight),
    bottomRight: doit(bottomRight),
  };
}

function getPoint(point: fabric.Point): ICoordinate {
  return { x: point.x, y: point.y };
}
