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
const puppeteer_1 = __importDefault(require("puppeteer"));
const username = 'bruhspectrum';
const password = 'lolbruh338';
const placeTileJsPath = 'document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > div.bottom-controls > mona-lisa-status-pill").shadowRoot.querySelector("button")';
const colorJsPath = (n) => `document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > mona-lisa-color-picker").shadowRoot.querySelector("div > div > div.palette > div:nth-child(${n}) > button")`;
const confirmJsPath = 'document.querySelector("body > mona-lisa-app > faceplate-csrf-provider > faceplate-alert-reporter > mona-lisa-embed").shadowRoot.querySelector("div > mona-lisa-share-container > mona-lisa-color-picker").shadowRoot.querySelector("div > div > div.actions > button.confirm")';
const sleep = (t) => new Promise(r => setTimeout(r, t));
let page;
let frame;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser = yield puppeteer_1.default.launch({
            headless: false,
            defaultViewport: {
                width: 1000,
                height: 800
            }
        });
        page = yield browser.newPage();
        yield page.goto('https://reddit.com/login');
        yield page.type('#loginUsername', username);
        yield page.type('#loginPassword', password);
        yield page.click('button[type=submit].AnimatedForm__submitButton.m-full-width');
        yield page.waitForNavigation();
        yield draw(800, 800, 3);
        yield sleep(5000);
    });
}
function draw(x, y, color) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.goto(`https://www.reddit.com/r/place/?cx=${x}&cy=${y}`);
        yield page.waitForSelector('.moeaZEzC0AbAvmDwN22Ma');
        yield page.click('.moeaZEzC0AbAvmDwN22Ma');
        const elementHandle = yield page.waitForSelector('iframe.Q-OBKuePQXXm3LGhGfv3k');
        frame = (yield elementHandle.contentFrame());
        yield page.waitForTimeout(1000);
        const placeTileBtn = yield (yield frame.evaluateHandle(placeTileJsPath)).asElement();
        yield placeTileBtn.evaluate(x => x.click());
        yield page.waitForTimeout(1000);
        const colorEl = (yield frame.evaluateHandle(colorJsPath(color))).asElement();
        yield colorEl.evaluate(x => x.click());
        yield page.waitForTimeout(2000);
        const confirmEl = (yield frame.evaluateHandle(confirmJsPath)).asElement();
        yield confirmEl.evaluate(x => x.click());
    });
}
run().catch(console.error);
