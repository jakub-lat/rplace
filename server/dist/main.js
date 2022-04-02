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
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const image_json_1 = require("../data/image.json");
const utils_1 = require("./utils");
let io;
let clients = {};
let queue = new utils_1.Queue();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const pixel of image_json_1.image) {
            queue.enqueue(pixel);
        }
        io = new socket_io_1.Server();
        io.on('connection', (socket) => {
            console.log('socket connected', socket.id);
            clients[socket.id] = {
                socket: socket,
                ratelimitEnd: Date.now(),
            };
        });
        setInterval(step, 1000);
        io.listen(3000);
    });
}
function getNextFreeClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const c = Object.values(clients).reduce((acc, x) => acc === null || acc.ratelimitEnd > x.ratelimitEnd ? x : acc, null);
        if (!c)
            return null;
        if (c.ratelimitEnd > Date.now()) {
            yield (0, utils_1.sleep)(c.ratelimitEnd - Date.now());
        }
        return c;
    });
}
function step() {
    return __awaiter(this, void 0, void 0, function* () {
        let [x, y, color] = queue.dequeue();
        const c = yield getNextFreeClient();
        c.socket.send('draw', { x, y, color });
    });
}
main().catch(console.error);
