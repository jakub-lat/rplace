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
const socket_io_1 = require("socket.io");
const image_json_1 = __importDefault(require("../data/image.json"));
const colors_1 = require("./colors");
const getImage_1 = require("./getImage");
const utils_1 = require("./utils");
let io;
let clients = [];
let queue = new utils_1.Queue();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        io = new socket_io_1.Server();
        getPixelsToDraw();
        io.on('connection', (socket) => {
            console.log('socket connected', socket.id);
            clients.push({
                id: socket.id,
                ratelimitEnd: Date.now(),
            });
            socket.on('ratelimitUpdate', (rl) => {
                console.log(`updating ratelimit of ${socket.id} to ${rl}`);
                let idx = clients.findIndex(x => x.id == socket.id);
                clients[idx].ratelimitEnd = rl;
            });
        });
        setInterval(step, 1000);
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            queue = yield getPixelsToDraw();
            console.log('reloaded queue');
        }), 10 * 1000);
        console.log('listening on :3000');
        io.listen(3000);
    });
}
function getNextFreeClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const c = Object.values(clients).reduce((acc, x) => (acc === null || acc.ratelimitEnd > x.ratelimitEnd) ? x : acc, null);
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
        if (queue.isEmpty)
            return;
        let px = queue.dequeue();
        let c = yield getNextFreeClient();
        if (!c) {
            queue.enqueue(px);
            return;
        }
        console.log('sending draw to', c.id);
        io.sockets.sockets.get(c.id).emit('draw', px);
    });
}
function getPixelsToDraw() {
    return __awaiter(this, void 0, void 0, function* () {
        let q = new utils_1.Queue();
        const { topLeftX, topLeftY, width, height } = image_json_1.default.props;
        const currentData = yield (0, getImage_1.getPixelsAt)(topLeftX, topLeftY, width, height);
        for (const [x, y, color] of image_json_1.default.pixels) {
            const c = (0, utils_1.getColorAt)(currentData, x, y, width);
            if (colors_1.Colors[c] == color)
                continue;
            let obj = { x: topLeftX + x, y: topLeftY + y, color };
            console.log('adding to queue', obj);
            q.enqueue(obj);
        }
        return q;
    });
}
main().catch(console.error);
