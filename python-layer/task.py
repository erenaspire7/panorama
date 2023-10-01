import io, os
import uuid, json, openai, boto3
import requests
import psycopg2
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()
openai.api_key = os.environ.get("OPENAI_KEY")

db_config = urlparse(os.environ.get("DATABASE_URL"))

db_conn = psycopg2.connect(
    host=db_config.hostname,
    user=db_config.username,
    password=db_config.password,
    dbname=db_config.path[1:],
    port=db_config.port,
)


s3_client = s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
    region_name="eu-west-1",
)


def process_message(message):
    message = json.loads(message)

    if "data" in message:
        file_object = io.BytesIO()
        s3_client.download_fileobj(
            "panorama-user-content", message["data"], file_object
        )
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

                case "analogy_generation":
                    analogy_bot_flow(message, task["callbackUrl"])

                case "title_generation":
                    title_generation(message, task["callbackUrl"])

                case "written_quiz_analysis":
                    written_quiz_analysis(message, task["callbackUrl"], content)

                case _:
                    pass


def question_generation(content, callback_url, topic_id):
    mcq_prompt = "I want you to act as a multiple-choice options generator. You will generate a JSON array of diverse questions and their corresponding answers, as well as 4 multiple choice options with an answer index, based on the provided block of text. The text may require cleaning for better comprehension. Ensure to include questions that ask for explanations of concepts, definitions, discussions around ideas, and listings of relevant points. I require a maximum of 15 questions, but feel free to lessen this number."

    content = "Text:\n" + content

    mcq_resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": mcq_prompt},
            {
                "role": "assistant",
                "content": '[{"question":"What is risk estimation?","answer":"Risk estimation is the process of determining the size of the risk.","options":["Risk estimation is the evaluation of risk severity","Risk estimation is the assessment of risk control","Risk estimation is the identification of risk sources","Risk estimation is the determination of risk size"], "answerIndex": 3}]',
            },
            {"role": "user", "content": content},
        ],
    )

    data = []

    mcq_data = mcq_resp["choices"][0]["message"]["content"]
    mcq_data = json.loads(mcq_data)

    for el in mcq_data:
        el["type"] = "default"

    data.extend(mcq_data)

    gap_prompt = "I want you to act as a fill-in-the-gaps question generator. You will generate a JSON array of definitions with gaps, as well as the corresponding word which matches the definitions. I also require 3 additional options, with a corresponding answer index. I require a maximum of 15 questions, but feel free to lessen this number."

    gap_resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": gap_prompt},
            {
                "role": "assistant",
                "content": '[{"definition":"An __________ is anything with value to the organization.","options":["Threat","Vulnerability","Control","Asset"],"answerIndex":3}]',
            },
            {"role": "user", "content": content},
        ],
    )

    gap_data = gap_resp["choices"][0]["message"]["content"]
    gap_data = json.loads(gap_data)

    for el in gap_data:
        el["type"] = "gap"

    data.extend(gap_data)

    body = {"data": data, "topicId": topic_id}

    requests.post(callback_url, json=body)


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


def analogy_bot_flow(message, callback_url):
    default_prompt = "I want you to act as an analogy bot. I will provide text as I'm trying to understand concepts, and you will give me a comprehensive breakdown. Ensure the level of understanding is that of a high school student."

    query = f"""
    SELECT message, generated 
    FROM public."Chat" 
    WHERE "Chat"."analogyId" = '{message['analogyId']}'
    ORDER BY "Chat"."regDate"
    """

    cursor = db_conn.cursor()
    cursor.execute(query)

    context = [{"role": "system", "content": default_prompt}]

    arr = cursor.fetchall()

    for el in arr:
        msg, generated = el

        context.append(
            {"role": "user" if generated is False else "assistant", "content": msg}
        )

    response = openai.ChatCompletion.create(model="gpt-3.5-turbo-16k", messages=context)

    data = response["choices"][0]["message"]["content"]

    body = {"message": data, "analogyId": message["analogyId"]}

    requests.post(callback_url, json=body)


def title_generation(message, callback_url):
    default_prompt = (
        "I want you to generate a short title based on the message provided."
    )

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": default_prompt},
            {"role": "user", "content": message["text"]},
        ],
    )

    data = response["choices"][0]["message"]["content"]
    body = {"title": data, "analogyId": message["analogyId"]}
    requests.post(callback_url, json=body)


def written_quiz_analysis(message, callback_url, content):
    default_prompt = "I want you to act as a grade bot. I will provide a json array, which has json objects with question, answer and userAnswer. Your job is to provide a score, as well as additional comments to aid in understanding what must be done better."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-16k",
        messages=[
            {"role": "system", "content": default_prompt},
            {
                "role": "assistant",
                "content": '[{"question": "What is the Socratic method?", "answer": "The Socratic method is a form of dialectical inquiry where Socrates asked probing questions to stimulate critical thinking and encourage others to examine their own beliefs and knowledge.", "userAnswer": "The socratic method is a method where questions are utilized to encourage thinking", "score": 8, "comment": "While it accurately conveys the main concept of the Socratic method, it could be slightly more detailed to fully capture its philosophical and dialectical nature."}]',
            },
            {"role": "user", "content": content},
        ],
    )

    data = response["choices"][0]["message"]["content"]

    s3_client.put_object(Bucket="panorama-user-content", Key=message["data"], Body=data)

    arr = json.loads(data)

    score = sum(el["score"] for el in arr) / len(arr)

    body = {"score": round(score, 2), "resultId": message["resultId"]}

    requests.post(callback_url, json=body)
