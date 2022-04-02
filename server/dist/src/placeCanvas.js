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
exports.getPixelsAt = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const canvasJsPath = 'document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > mona-lisa-camera > mona-lisa-canvas").shadowRoot.querySelector("div > canvas")';
let browser;
let page;
function getPixelsAt(x, y, w, h) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!browser) {
            browser = yield puppeteer_1.default.launch({
                headless: false,
                defaultViewport: {
                    width: 1000,
                    height: 800
                }
            });
            page = yield browser.newPage();
        }
        page.goto('https://www.reddit.com/r/place/?cx=500&cy=500&px=460');
        yield page.waitForSelector('.moeaZEzC0AbAvmDwN22Ma');
        yield page.click('.moeaZEzC0AbAvmDwN22Ma');
        const elementHandle = yield page.waitForSelector('iframe.Q-OBKuePQXXm3LGhGfv3k');
        const frame = (yield elementHandle.contentFrame());
        yield page.waitForTimeout(1000);
        const canvas = yield (yield frame.evaluateHandle(canvasJsPath)).asElement();
        const data = yield canvas.evaluate((c, [x, y, w, h]) => c.getContext('2d').getImageData(x, y, w, h), [x, y, w, h]);
        return data;
    });
}
exports.getPixelsAt = getPixelsAt;
