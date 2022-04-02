"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage = void 0;
const jimp_1 = __importDefault(require("jimp"));
const colors_1 = require("./colors");
function loadImage(path) {
    return __awaiter(this, void 0, void 0, function* () {
        const img = yield jimp_1.default.read(path);
        const width = img.getWidth(), height = img.getHeight();
        let res = { props: { width, height }, pixels: [] };
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const rawHex = img.getPixelColor(x, y).toString(16);
                const color = ("000000" + rawHex).slice(-8, -2);
                res.pixels.push([x, y, colors_1.Colors[color]]);
            }
        }
        console.log(JSON.stringify(res));
    });
}
exports.loadImage = loadImage;
loadImage(process.argv[2]).catch();
