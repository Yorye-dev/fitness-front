export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    pagination: {
      page: number;
      per_page: number;
      total: number;
      total_pages: number;
      next_page?: number;
      prev_page?: number;
    };
  };
}

export interface ApiErrorResponse {
  error: { code: string; message: string };
}
