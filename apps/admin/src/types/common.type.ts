namespace NSCommon {
  export interface ApiResponse<T> {
    data?: T;
    message?: string;
    error?: string;
    statusCode?: number;
    token?: string;
  }
  export interface IListRespone<T> {
    data: {
      result: T[];
      page: number;
      totalPages: number;
    };
  }
}
