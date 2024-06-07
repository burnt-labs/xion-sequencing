import {DeleteMessageCommand, ReceiveMessageCommand, SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {awsConfig} from "./config";

export type SQSBankSendMessage = {
    recipient: string;
    amount: number;
}

const sqsClient = new SQSClient({
    region: awsConfig.region,
    endpoint: awsConfig.sqs.endpoint,
});

async function sqsBankSend(msg: SQSBankSendMessage) {
    const command = new SendMessageCommand({
        QueueUrl: awsConfig.sqs.queueUrl,
        MessageBody: JSON.stringify(msg)
    });
    await sqsClient.send(command);
}

async function sqsReceive(maxNumberOfMessages: number = 1, waitTimeSeconds: number = 10) {
    const command = new ReceiveMessageCommand({
        QueueUrl: awsConfig.sqs.queueUrl,
        MaxNumberOfMessages: maxNumberOfMessages,
        WaitTimeSeconds: waitTimeSeconds,
    });

    const response = await sqsClient.send(command);
    return response.Messages || [];
}

async function sqsDelete(receiptHandle: string) {
    const deleteCommand = new DeleteMessageCommand({
        QueueUrl: awsConfig.sqs.queueUrl,
        ReceiptHandle: receiptHandle
    });
    await sqsClient.send(deleteCommand);
}

export {sqsClient, sqsBankSend, sqsReceive, sqsDelete};
