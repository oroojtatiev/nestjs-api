import {
  ExceptionFilter as NestExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {Response} from 'express'
import {EntityNotFoundError} from 'typeorm'
import {ExceptionResponse} from '../types/response'

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name)

  constructor(private configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status: number = exception.getStatus()
      const exceptionResponse: string | object = exception.getResponse()
      let message: string | string[]
      let error: string | undefined

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse
      }
      else {
        const response = exceptionResponse as ExceptionResponse
        message = response.message
        error = response.error
      }

      return response
        .status(status)
        .json({status, message, error})
    }

    if (exception instanceof EntityNotFoundError) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .json({status: HttpStatus.NOT_FOUND, message: exception.message})
    }

    const isDev = this.configService.get('NODE_ENV') === 'development'

    if (isDev && exception instanceof Error) {
      return response
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: exception.stack,
        })
    }

    this.logger.error(JSON.stringify(exception))

    return response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      })
  }
}
