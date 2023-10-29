import os, asyncio
import redis.asyncio as redis
from dotenv import load_dotenv
from task import process_message
import requests

load_dotenv()

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")
REDIS_PASS = os.environ.get("REDIS_PASS")
API_URL = os.environ.get("API_URL")


async def reader(channel):
    while True:
        message = await channel.get_message(ignore_subscribe_messages=True)
        if message is not None:
            print(f"Message Received: {message}")

            try:
                process_message(message["data"].decode("utf-8"))
            except Exception as e:
                print(e)


async def poll():
    while True:
        try:
            requests.post(f"{API_URL}/api/task/trigger-daily-notifications")
        except:
            pass

        await asyncio.sleep(300)


async def main():
    redis_client = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASS)

    # asyncio.create_task(poll())

    async with redis_client.pubsub() as pubsub:
        await pubsub.subscribe("task_channel")

        future = asyncio.create_task(reader(pubsub))

        await future


if __name__ == "__main__":
    print("Layer running")
    asyncio.run(main())
