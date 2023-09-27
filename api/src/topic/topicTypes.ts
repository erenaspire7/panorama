interface CreateTopicRequest {
  title: string;
  content: string;
}

interface RetrieveFlashcardsRequest {
  topicId: string;
}

export { CreateTopicRequest, RetrieveFlashcardsRequest };
