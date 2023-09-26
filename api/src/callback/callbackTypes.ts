interface TopicCallbackRequest {
  topicId: string;
  data: string;
}

interface UpdateAnalogyTitleRequest {
  analogyId: string;
  title: string;
}
export { TopicCallbackRequest, UpdateAnalogyTitleRequest };
