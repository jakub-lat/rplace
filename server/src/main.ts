import { Server } from 'socket.io';
import { image } from '../data/image.json';

async function main() {
    const io = new Server();

    io.on('connection', (socket) => {

    });
    
    io.listen(3000);
}

main().catch(console.error);