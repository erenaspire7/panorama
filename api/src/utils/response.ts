interface ResponseData {
  message?: string;
  token?: string;
  refreshToken?: string;
  results?: any[];
  page?: number;
  limit?: number;
  totalPages?: number;
  analogyId?: string;
}

class BaseResponse {
  statusCode: number;
  data: ResponseData;

  constructor(statusCode: number, data: ResponseData) {
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default BaseResponse;
