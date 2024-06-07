import asyncio

import aioboto3
from botocore.config import Config


async def producer(sqs, queue_url):
    for i in range(10):
        item = f"item {i}"
        await sqs.send_message(QueueUrl=queue_url, MessageBody=item)
        print(f"Produced {item}")
        await asyncio.sleep(1)
    await sqs.send_message(QueueUrl=queue_url, MessageBody="DONE")


async def consumer(sqs, queue_url):
    while True:
        response = await sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=1, WaitTimeSeconds=10)
        messages = response.get('Messages', [])
        for message in messages:
            print(f"Consumed {message['Body']}")
            await sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=message['ReceiptHandle'])
            if message['Body'] == "DONE":
                return
            await asyncio.sleep(2)


def get_client():
    session = aioboto3.Session()
    return session.client(
        'sqs',
        endpoint_url='http://localhost:4566',
        config=Config(
            region_name='us-east-1',
            retries={
                'max_attempts': 10,
                'mode': 'standard'
            }
        ),
        aws_access_key_id='test',
        aws_secret_access_key='test'
    )


async def main():
    async with get_client() as sqs:
        queue_url = "http://localhost:4566/000000000000/queue"
        producer_task = asyncio.create_task(producer(sqs, queue_url))
        consumer_task = asyncio.create_task(consumer(sqs, queue_url))

        await producer_task
        await consumer_task


if __name__ == "__main__":
    asyncio.run(main())
