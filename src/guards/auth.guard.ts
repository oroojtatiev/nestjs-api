import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common'
import {JwtService} from '@nestjs/jwt'
import {ConfigService} from '@nestjs/config'
import {Request} from 'express'
import {firstValueFrom, map} from 'rxjs'
import {UserService} from '../domain/user/user.service'
import {User} from '../domain/user/user.dto'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }

    const jwtOptions = {secret: this.configService.get('JWT_SECRET')}

    try {
      const decodedToken: IToken = await this.jwtService.verifyAsync(token, jwtOptions)

      request.user = await this.checkUser(decodedToken.id)
    }
    catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }

  private checkUser(id: number): Promise<User> {
    return firstValueFrom(
      this.userService.checkUserExist(id)
      .pipe(
        map(user => {
          if (user) return user

          throw new UnauthorizedException()
        })
      )
    )
  }
}