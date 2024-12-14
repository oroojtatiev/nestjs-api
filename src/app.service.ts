import {HttpStatus, Injectable} from '@nestjs/common'
import {ApiResponse} from './types/response'

@Injectable()
export class AppService {
  getHello(): ApiResponse<{title: string}> {
    return {
      data: {
        title: 'Hello World!',
      },
      status: HttpStatus.OK,

    }
  }
}
