"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatelimitActiveError = exports.sleep = void 0;
const sleep = (t) => new Promise(r => setTimeout(r, t));
exports.sleep = sleep;
class RatelimitActiveError extends Error {
}
exports.RatelimitActiveError = RatelimitActiveError;
