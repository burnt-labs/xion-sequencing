import {Queue} from 'queue-typescript';

function producer(queue: Queue<string>) {
    for (let i = 0; i < 10; i++) {
        const item = `item ${i}`;
        queue.enqueue(item);
        console.log(`Produced ${item}`);
        sleep(1000);
    }
    queue.enqueue("DONE");
}

function consumer(queue: Queue<string>) {
    while (true) {
        const item = queue.dequeue();
        if (item === "DONE") {
            break;
        }
        if (item) {
            console.log(`Consumed ${item}`);
            sleep(2000);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const queue = new Queue<string>();
    await producer(queue);
    await consumer(queue);
}

main();
