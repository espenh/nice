export function findOccludedLeds(leds, rectangle) {
    return leds.filter(led => isOccluded(led.position, rectangle));
}
;
export function isOccluded(point, placedObject) {
    // Note: the rectangle can be rotated.
    // TODO - If the rectangle is uniform(name? parallel sides), it could be quicker to
    // revert the rotation for both the rectangle and the point, and then do a simple check.
    return pointInPolygon(point, [placedObject.topLeft, placedObject.topRight, placedObject.bottomRight, placedObject.bottomLeft]);
}
export function pointInPolygon(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    const { x, y } = point;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i].x, yi = vs[i].y;
        const xj = vs[j].x, yj = vs[j].y;
        const intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect)
            inside = !inside;
    }
    return inside;
}
;
//# sourceMappingURL=ledOcclusion.js.map