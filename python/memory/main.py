import asyncio


async def producer(q):
    for i in range(10):

        # Construct message with transaction parameters here
        item = f"item {i}"

        await q.put(item)
        print(f"Produced {item}")
        await asyncio.sleep(1)
    await q.put(None)


async def consumer(q):
    while True:
        item = await q.get()
        if item is None:
            break
        print(f"Consumed {item}")

        # Call the chain here

        await asyncio.sleep(2)
        q.task_done()


async def main():
    q = asyncio.Queue()

    producer_task = asyncio.create_task(producer(q))
    consumer_task = asyncio.create_task(consumer(q))

    await producer_task
    await consumer_task


if __name__ == "__main__":
    asyncio.run(main())
