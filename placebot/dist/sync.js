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
exports.connect = void 0;
const socket_io_client_1 = require("socket.io-client");
const bot_1 = require("./bot");
const utils_1 = require("./utils");
function connect(addr) {
    return __awaiter(this, void 0, void 0, function* () {
        const socket = (0, socket_io_client_1.io)(addr);
        socket.on('connect', () => {
            console.log('connected to server');
            socket.emit('ratelimitUpdate', bot_1.ratelimitEnd);
            socket.emit('ready');
        });
        socket.on('draw', ({ x, y, color }) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('drawing: ', x, y, color);
                yield (0, bot_1.draw)(x, y, color);
                socket.emit('ready');
            }
            catch (err) {
                if (err instanceof utils_1.RatelimitActiveError) {
                    socket.emit('ratelimitUpdate', bot_1.ratelimitEnd);
                }
            }
        }));
    });
}
exports.connect = connect;
