import 'dotenv/config';
import {Queue} from 'queue-typescript';
import {xionTxBankSend} from "./cosmos";
import {xionConfig} from "./config";

export type BankSendMessage = {
    recipient: string;
    amount: number;
}

async function producer(queue: Queue<string>) {
    try {
        const msg: BankSendMessage = {
            recipient: xionConfig.recipient,
            amount: xionConfig.amount,
        };

        for (let i = 0; i < 10; i++) {
            queue.enqueue(JSON.stringify(msg));
            console.log(`Produced ${JSON.stringify(msg)}`);
            sleep(1000);
        }

        queue.enqueue("DONE");
    } catch (error) {
        console.error(`producer failed: ${error}`);
    }
}

async function consumer(queue: Queue<string>) {
    while (true) {
        try {
            const msg = queue.dequeue();
            if (msg === "DONE") {
                break;
            }

            const bankSendMessage: BankSendMessage = JSON.parse(msg);
            console.log(`Consumed ${msg}`);

            await xionTxBankSend(
                bankSendMessage.recipient,
                bankSendMessage.amount.toString(),
                xionConfig.mnemonic,
            )

            sleep(2000);
        } catch (error) {
            console.error(`consumer failed: ${error}`);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const queue = new Queue<string>();
    const producerPromise = producer(queue);
    const consumerPromise = consumer(queue);
    await Promise.allSettled([producerPromise, consumerPromise]);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
