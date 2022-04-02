import { Server } from 'socket.io';
import { image } from '../data/image.json';
import { Queue, Client, sleep } from './utils';

let io: Server;
let clients: Client[] = [];
let queue = new Queue<[number, number, number]>();

async function main() {
    for (const pixel of image) {
        queue.enqueue(pixel as [number, number, number]);
    }

    io = new Server();

    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);
        clients.push({
            id: socket.id,
            ratelimitEnd: Date.now(),
        });
    });

    setInterval(step, 1000);

    console.log('listening on :3000')
    io.listen(3000);
}

async function getNextFreeClient(): Promise<Client | null> {
    const c = Object.values(clients).reduce((acc, x) => (acc === null || acc.ratelimitEnd > x.ratelimitEnd) ? x : acc, null);
    if(!c) return null;
    
    if(c.ratelimitEnd > Date.now()) {
        await sleep(c.ratelimitEnd - Date.now());
    }
    return c;
}

async function step() {
    if(queue.isEmpty) return;

    let [x, y, color] = queue.dequeue();

    let c = await getNextFreeClient();
    if(!c) {
        queue.enqueue([x, y, color]);
        return;
    }

    console.log('sending draw to', c.id);
    io.sockets.sockets.get(c.id).emit('draw', {x, y, color});
}

main().catch(console.error);