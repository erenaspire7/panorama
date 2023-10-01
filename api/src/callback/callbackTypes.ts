interface TopicCallbackRequest {
  topicId: string;
  data: string;
}

interface UpdateAnalogyTitleRequest {
  analogyId: string;
  title: string;
}

interface UpdateResultRequest {
  resultId: string;
  score: any;
}
export { TopicCallbackRequest, UpdateAnalogyTitleRequest, UpdateResultRequest };
