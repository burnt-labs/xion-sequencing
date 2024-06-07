import Redis from 'ioredis';
import {xionConfig} from "./config";
import {xionTxBankSend} from "./cosmos";

export type BankSendMessage = {
    recipient: string;
    amount: number;
}

async function producer(client: Redis) {
    try {
        const msg: BankSendMessage = {
            recipient: xionConfig.recipient,
            amount: xionConfig.amount,
        };

        for (let i = 0; i < 10; i++) {
            await client.rpush('queue', JSON.stringify(msg));
            console.log(`Produced ${JSON.stringify(msg)}`);
            await sleep(1000);
        }

        await client.rpush('queue', 'DONE');
    } catch (error) {
        console.error(`producer failed: ${error}`);
    }
}

async function consumer(redisClient: Redis) {
    while (true) {
        try {
            const item = await redisClient.lpop('queue');
            if (item === null) {
                continue;
            }
            if (item === 'DONE') {
                break;
            }

            const bankSendMessage: BankSendMessage = JSON.parse(item);
            console.log(`Consumed ${item}`);

            xionTxBankSend(
                bankSendMessage.recipient,
                bankSendMessage.amount.toString(),
                xionConfig.mnemonic,
            );

            await sleep(2000);
        } catch (error) {
            console.error(`consumer failed: ${error}`);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const redisClient = new Redis();

    const producerPromise = producer(redisClient);
    const consumerPromise = consumer(redisClient);
    await Promise.allSettled([producerPromise, consumerPromise]);

    redisClient.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
