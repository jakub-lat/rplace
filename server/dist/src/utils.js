"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorAt = exports.rgbToHexString = exports.rgbToHex = exports.getColorIndicesForCoord = exports.sleep = exports.Queue = void 0;
class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
exports.Queue = Queue;
const sleep = (t) => new Promise(r => setTimeout(r, t));
exports.sleep = sleep;
function getColorIndicesForCoord(x, y, width) {
    var red = y * (width * 4) + x * 4;
    return [red, red + 1, red + 2, red + 3];
}
exports.getColorIndicesForCoord = getColorIndicesForCoord;
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}
exports.rgbToHex = rgbToHex;
function rgbToHexString(r, g, b) {
    return ("000000" + rgbToHex(r, g, b)).slice(-6);
}
exports.rgbToHexString = rgbToHexString;
function getColorAt(data, x, y, width) {
    const [redIndex, greenIndex, blueIndex, alphaIndex] = getColorIndicesForCoord(x, y, width);
    var r = data.data[redIndex];
    var g = data.data[greenIndex];
    var b = data.data[blueIndex];
    return rgbToHexString(r, g, b);
}
exports.getColorAt = getColorAt;
