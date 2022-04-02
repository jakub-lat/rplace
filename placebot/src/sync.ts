import { io } from 'socket.io-client';
import { draw, ratelimitEnd } from './bot';
import { RatelimitActiveError } from './utils';

export async function connect(addr: string) {
    const socket = io(addr);
    socket.on('draw', async ({x, y, color}) => {
        try {
            await draw(x, y, color);
        } catch(err) {
            if(err instanceof RatelimitActiveError) {
                socket.send('ratelimitUpdate', ratelimitEnd);
            }
        }
    });
}