import 'dotenv/config';
import {SendMessageCommand} from "@aws-sdk/client-sqs";
import {awsConfig, xionConfig} from "./config";
import {xionTxBankSend} from "./cosmos";
import {sqsBankSend, SQSBankSendMessage, sqsClient, sqsDelete, sqsReceive} from "./aws";

async function producer(queueUrl: string) {
    const sqsBankSendMessage: SQSBankSendMessage = {
        recipient: xionConfig.recipient,
        amount: xionConfig.amount,
    };

    for (let i = 0; i < 10; i++) {
        await sqsBankSend(sqsBankSendMessage);
        console.log(`Produced: ${JSON.stringify(sqsBankSendMessage)}`);
        await sleep(1000);
    }

    const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: "DONE"
    });

    await sqsClient.send(command);
}

async function consumer(queueUrl: string) {
    while (true) {
        const messages = await sqsReceive();
        for (const message of messages) {

            if (message.Body === undefined) {
                console.error("Message body is undefined");
                continue;
            }
            if (message.ReceiptHandle === undefined) {
                console.error("Receipt handle is undefined");
                continue;
            }

            console.log(`Consumed: ${message.Body}`);
            const msg = JSON.parse(message.Body);

            await xionTxBankSend(
                msg.recipient,
                msg.amount.toString(),
                xionConfig.mnemonic,
            );

            await sqsDelete(message.ReceiptHandle);
            if (message.Body === "DONE") {
                return;
            }

            await sleep(2000);
        }
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    const producerPromise = producer(awsConfig.sqs.queueUrl);
    const consumerPromise = consumer(awsConfig.sqs.queueUrl);
    await Promise.allSettled([producerPromise, consumerPromise]);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
