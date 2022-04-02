import { Server } from 'socket.io';
import image from '../data/image.json';
import { Colors } from './colors';
import { getPixelsAt } from './placeCanvas';
import { Queue, Client, sleep, Pixel, getColorAt } from './utils';

let io: Server;
let clients: Client[] = [];
let queue = new Queue<Pixel>();

async function main() {
    io = new Server();

    await getPixelsToDraw();

    io.on('connection', (socket) => {
        console.log('socket connected', socket.id);
        clients.push({
            id: socket.id,
            ratelimitEnd: Date.now(),
            ready: false,
        });

        socket.on('ratelimitUpdate', (rl) => {
            console.log(`updating ratelimit of ${socket.id} to ${rl}`);
            updateClient(socket.id, { ratelimitEnd: rl });
        });

        socket.on('ready', () => {
            updateClient(socket.id, { ready: true, });
            console.log(`client ${socket.id} ready`);
        })
    });


    setInterval(step, 1000);
    setInterval(async () => {
        queue = await getPixelsToDraw();
        console.log('reloaded queue');
    }, 10 * 1000)

    const port = parseInt(process.env.PORT) || 3000;
    console.log(`listening on :${port}`)
    io.listen(port);
}

function updateClient(id: string, newData: Partial<Client>) {
    const i = clients.findIndex(x => x.id === id);
    clients[i] = { ...clients[i], ...newData };
}

async function getNextFreeClient(): Promise<Client | null> {
    const c = Object.values(clients).reduce((acc, x) => (x.ready && (acc === null || acc.ratelimitEnd > x.ratelimitEnd)) ? x : acc, null);
    if(!c) return null;
    
    if(c.ratelimitEnd > Date.now()) {
        await sleep(c.ratelimitEnd - Date.now());
    }
    return c;
}

async function step() {
    if(queue.isEmpty) return;

    let px = queue.dequeue();

    let c = await getNextFreeClient();
    if(!c || !c.ready) {
        queue.enqueue(px);
        return;
    }

    console.log('sending draw to', c.id);
    io.sockets.sockets.get(c.id).emit('draw', px);
    updateClient(c.id, { ready: false });
}

async function getPixelsToDraw(): Promise<Queue<Pixel>> {
    let q = new Queue<Pixel>();

    const {topLeftX, topLeftY, width, height} = image.props;
    const currentData = await getPixelsAt(topLeftX, topLeftY, width, height);

    for (const [x, y, color] of image.pixels) {
        const c = getColorAt(currentData, x, y, width);
        if(Colors[c] == color) continue;

        let obj = {x: topLeftX + x, y: topLeftY + y, color: color + 1};
        // console.log('adding to queue', obj);
        q.enqueue(obj);
    }

    return q;
}

main().catch(console.error);