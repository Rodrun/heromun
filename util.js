// Convert given radians to degrees
export function toDeg(rad) {
    return rad * 180 / Math.PI;
}

// Convert given degrees to radians
export function toRad(deg) {
    return deg * Math.PI / 180;
}

// Get distance between two points
export function distanceBetween(x1, y1, x2, y2) {
    let a = x2 - x1;
    let b = y2 - y1;
    return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

export function getRandomInt(max) { // range: [0, max)
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * 2D Vector with X and Y components.
 */
export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
