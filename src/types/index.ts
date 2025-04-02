export interface BaseResponse<T = unknown> {
  data: T
  message?: string
  status: number
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: {
    items: T[]
    total: number
    page: number
    limit: number
  }
} 