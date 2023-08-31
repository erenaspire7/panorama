import io, os, json
import openai, boto3
import requests
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.environ.get("OPENAI_KEY")


s3_client = s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name="eu-west-1",
)


def process_message(message):
    message = json.loads(message)

    file_object = io.BytesIO()
    s3_client.download_fileobj("panorama-user-content", message["data"], file_object)
    content = file_object.getvalue().decode("utf-8")

    for task in message["tasks"]:
        if "taskType" in task:
            match task["taskType"]:
                case "question_generation":
                    question_generation(
                        content, task["callbackUrl"], message["topicId"]
                    )

                case "flashcard_generation":
                    flashcard_generation(
                        content, task["callbackUrl"], message["topicId"]
                    )

                case _:
                    pass


def question_generation(content, callback_url, topic_id):
    default_prompt = "I want you to act as a question generator. You will generate a JSON array of diverse questions and their corresponding answers based on the provided block of text. The text may require cleaning for better comprehension. Ensure to include questions that ask for explanations of concepts, definitions, discussions around ideas, and listings of relevant points"

    content = "Text:\n" + content

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": default_prompt},
            {
                "role": "assistant",
                "content": '[{"question": "Define Risk", "answer": "Risk refers to the potential for an undesired or unfavorable outcome or event to occur."}]',
            },
            {"role": "user", "content": content},
        ],
    )

    data = response["choices"][0]["message"]["content"]

    try:
        data = json.loads(data)

        body = {"data": data, "topicId": topic_id}

        requests.post(callback_url, json=body)
    except:
        pass


def flashcard_generation(content, callback_url, topic_id):
    default_prompt = "I want you to act as a flashcards generator. You will generate a JSON array of diverse terms and their corresponding answers based on the provided block of text. The text may require cleaning for better comprehension. Ensure to include terms that ask for explanations of concepts, definitions and discussions around ideas."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": default_prompt},
            {
                "role": "assistant",
                "content": '[{"term": "Mitigation Techniques", "definition": "Strategies and actions taken to reduce the potential impact or likelihood of a risk."}]',
            },
            {"role": "user", "content": content},
        ],
    )

    data = response["choices"][0]["message"]["content"]

    try:
        data = json.loads(data)

        body = {"data": data, "topicId": topic_id}

        requests.post(callback_url, json=body)
    except:
        pass
