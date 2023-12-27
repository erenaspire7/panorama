import OpenAI from "openai";
import "dotenv/config";
import { Task } from "./TaskManager";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const s3Client = new S3Client({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

process.on("message", async (msg: Task) => {
  let content = null;

  if (msg.s3Key != undefined) {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: "panorama-user-content",
        Key: msg.s3Key,
      })
    );

    content = await response.Body?.transformToString();
  }

  switch (msg.taskType) {
    case "questionGeneration": {
      let baseQuestionPrompt =
        "I want you to act as a multiple-choice options generator. You will generate a JSON array of diverse questions and their corresponding answers, as well as 4 multiple choice options with an answer index, based on the provided block of text. The text may require cleaning for better comprehension. Ensure to include questions that ask for explanations of concepts, definitions, discussions around ideas, and listings of relevant points. I require a maximum of 15 questions, but feel free to lessen this number.";

      let baseQuestionRequest = await openai.chat.completions.create({
        messages: [
          { role: "system", content: baseQuestionPrompt },
          {
            role: "assistant",
            content: JSON.stringify([
              {
                question: "What is risk estimation?",
                answer:
                  "Risk estimation is the process of determining the size of the risk.",
                options: [
                  "Risk estimation is the evaluation of risk severity",
                  "Risk estimation is the assessment of risk control",
                  "Risk estimation is the identification of risk sources",
                  "Risk estimation is the determination of risk size",
                ],
                answerIndex: 3,
              },
            ]),
          },
        ],
        model: "gpt-4-32k",
        response_format: { type: "json_object" },
      });

      let baseQuestionData = baseQuestionRequest.choices[0].message.content;

      let gapQuestionPrompt =
        "I want you to act as a fill-in-the-gaps question generator. You will generate a JSON array of definitions with gaps, as well as the corresponding word which matches the definitions. I also require 3 additional options, with a corresponding answer index. I require a maximum of 15 questions, but feel free to lessen this number.";

      let gapQuestionRequest = await openai.chat.completions.create({
        messages: [
          { role: "system", content: gapQuestionPrompt },
          {
            role: "assistant",
            content: JSON.stringify([
              {
                question:
                  "An __________ is anything with value to the organization.",
                answer: "Asset",
                options: ["Threat", "Vulnerability", "Control", "Asset"],
                answerIndex: 3,
              },
            ]),
          },
        ],
        model: "gpt-4-32k",
        response_format: { type: "json_object" },
      });

      let gapQuestionData = gapQuestionRequest.choices[0].message.content;

      let questionData = [
        ...JSON.parse(baseQuestionData!),
        ...JSON.parse(gapQuestionData!),
      ];

      await fetch(msg.callbackUrl, {
        method: "POST",
        body: JSON.stringify({
          data: questionData,
          topicId: msg.topicId,
        }),
      });
    }

    case "analogyBotFlow": {
    }
  }
});
