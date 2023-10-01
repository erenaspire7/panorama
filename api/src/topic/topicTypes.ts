interface CreateTopicRequest {
  title: string;
  content: string;
}

interface RetrieveQuestionRequest {
  topicId: string;
  mode: string;
}

interface WriteQuizRequest {
  answers: any[];
  topicId: string;
}

export { CreateTopicRequest, RetrieveQuestionRequest, WriteQuizRequest };
