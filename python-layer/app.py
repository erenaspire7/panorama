import os, asyncio
import redis.asyncio as redis
from dotenv import load_dotenv
from task import process_message

load_dotenv()

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")
REDIS_PASS = os.environ.get("REDIS_PASS")


async def reader(channel):
    while True:
        message = await channel.get_message(ignore_subscribe_messages=True)
        if message is not None:
            print(f"Message Received: {message}")
            process_message(message["data"].decode("utf-8"))


async def main():
    redis_client = redis.Redis(
        host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS
    )

    async with redis_client.pubsub() as pubsub:
        await pubsub.subscribe("task_channel")

        future = asyncio.create_task(reader(pubsub))

        await future


if __name__ == "__main__":
    asyncio.run(main())
