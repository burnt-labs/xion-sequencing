import Redis from 'ioredis';

async function producer(redisClient: Redis.Redis) {
    for (let i = 0; i < 10; i++) {
        const item = `item ${i}`;
        await redisClient.rpush('queue', item);
        console.log(`Produced ${item}`);
        await sleep(1000);
    }
    await redisClient.rpush('queue', 'DONE');
}

async function consumer(redisClient: Redis.Redis) {
    while (true) {
        const item = await redisClient.lpop('queue');
        if (item === 'DONE') {
            break;
        }
        if (item) {
            console.log(`Consumed ${item}`);
            await sleep(2000);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const redisClient = new Redis();

    await producer(redisClient);
    await consumer(redisClient);

    redisClient.disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
