interface ExceptionResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

interface ApiResponse<T> {
  status: number
  message?: string | string[]
  data?: T
  error?: string[]
}