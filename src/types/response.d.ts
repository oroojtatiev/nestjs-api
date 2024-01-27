import {HttpStatus} from '@nestjs/common'
import {Observable} from 'rxjs'

interface ExceptionResponse {
  statusCode: number
  message: string | string[]
  error?: string
}

interface ApiResponse<T> {
  status: HttpStatus
  message?: string | string[]
  data?: T
  error?: string[]
}

type ObservableResponse<T> = Observable<ApiResponse<T>>