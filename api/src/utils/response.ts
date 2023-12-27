class BaseResponse {
  statusCode: number;
  data: Record<string, any>;

  constructor(statusCode: number, data: Record<string, any>) {
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default BaseResponse;
