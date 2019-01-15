// Useful utilities module

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

// Get distance between two vectors
export function distanceBetweenVec(a, b) {
    return distanceBetween(a.x, a.y, b.x, b.y);
}

// Get the difference between two vectors.
export function vectorDifference(a, b) {
    return new Vector(b.x - a.x, b.y - a.y);
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

export function vectorFromSprite(sp) {
    return new Vector(sp.x, sp.y);
}

// Cap a number at max
export function cap(n, max) {
    return n > max ? max : n;
}