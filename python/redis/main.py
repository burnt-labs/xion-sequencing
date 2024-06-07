import asyncio

import redis.asyncio as redis


async def producer(rdb):
    for i in range(10):
        item = f"item {i}"
        await rdb.rpush('queue', item)
        print(f"Produced {item}")
        await asyncio.sleep(1)


async def consumer(rdb):
    while True:
        item = await rdb.lpop('queue')
        if item:
            print(f"Consumed {item.decode('utf-8')}")
            await asyncio.sleep(2)
        else:
            break


async def main():
    rdb = redis.Redis(host='localhost', port=6379, db=0)

    producer_task = asyncio.create_task(producer(rdb))
    consumer_task = asyncio.create_task(consumer(rdb))

    await producer_task
    await consumer_task

    await rdb.aclose()


if __name__ == "__main__":
    asyncio.run(main())
