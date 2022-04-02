import { io } from 'socket.io-client';
import { draw, ratelimitEnd } from './bot';
import { RatelimitActiveError } from './utils';

export async function connect(addr: string) {
    const socket = io(addr);
    socket.on('connect', () => {
        console.log('connected to server');
        socket.emit('ratelimitUpdate', ratelimitEnd);
    });
    socket.on('draw', async ({x, y, color}) => {
        try {
            await draw(x, y, color);
            console.log('drawing: ', x, y, color);
        } catch(err) {
            if(err instanceof RatelimitActiveError) {
                socket.emit('ratelimitUpdate', ratelimitEnd);
            }
        }
    });
}