import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
    region: "us-east-1",
    endpoint: "http://localhost:4566",
});

async function producer(queueUrl: string) {
    for (let i = 0; i < 10; i++) {
        const item = `item ${i}`;
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: item
        });
        await sqsClient.send(command);
        console.log(`Produced: ${item}`);
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
        const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        });
        const response = await sqsClient.send(command);
        const messages = response.Messages || [];
        for (const message of messages) {
            console.log(`Consumed: ${message.Body}`);
            const deleteCommand = new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: message.ReceiptHandle!
            });
            await sqsClient.send(deleteCommand);
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
    const queueUrl = "http://localhost:4566/000000000000/queue";
    await producer(queueUrl);
    await consumer(queueUrl);
}

main().catch(console.error);
