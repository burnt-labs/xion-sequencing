export const awsConfig = {
    region: process.env.AWS_REGION ?? "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        roleArn: process.env.AWS_ROLE_ARN,
        webIdToken: process.env.AWS_WEB_IDENTITY_TOKEN_FILE,
    },
    sqs: {
        endpoint: process.env.AWS_SQS_ENDPOINT ?? "http://localhost:4566", // https://{service}.{region}.amazonaws.com
        maxFetchMessages: process.env.AWS_SQS_MAX_FETCH_MESSAGES ?? "10",
        waitTimeSeconds: process.env.AWS_SQS_WAIT_TIME_SECONDS ?? "5",
        queueUrl: process.env.AWS_SQS_QUEUE_URL ?? "http://localhost:4566/000000000000/queue",
        visibilityTimeout: process.env.AWS_SQS_VISIBILITY_TIMEOUT ?? "30",
    },
}

export const xionConfig = {
    amount: 1,
    recipient: process.env.XION_RECIPIENT ?? "",
    mnemonic: process.env.XION_MNEMONIC ?? "",
    rpcUrl: process.env.XION_RPC_URL ?? "https://rpc.xion-testnet-1.burnt.com",
}
