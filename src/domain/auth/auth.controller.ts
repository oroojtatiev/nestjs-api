import {Body, Controller, Post, UsePipes} from '@nestjs/common'
import {authSchema, Login} from './auth.dto'
import {ZodValidationPipe} from '../../pipes/ZodValidation.pipe'
import {AuthService} from './auth.service'

@Controller('auth')
@UsePipes(new ZodValidationPipe(authSchema))
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  @Post()
  login(@Body() body: Login) {
    return this.authService.login(body)
  }
}
