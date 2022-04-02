import { config } from "dotenv";
import * as bot from './bot';

config();

async function main() {
    await bot.start();
}


main().catch(console.error);