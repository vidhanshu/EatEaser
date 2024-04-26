namespace NSCommon {
  export interface ApiResponse<T> {
    data: {
      data?: T;
      message?: string;
      error?: string;
      statusCode?: number;
      token?: string;
    };
  }
}
