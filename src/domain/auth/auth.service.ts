import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {JwtService, JwtSignOptions} from '@nestjs/jwt'
import {from, map, Observable, of, switchMap} from 'rxjs'
import * as bcrypt from 'bcrypt'
import {UserService} from '../user/user.service'
import {Login} from './auth.dto'
import {UserEntity} from '../user/user.entity'
import {ConfigService} from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  login({email, password}: Login): Observable<ApiResponse<string>> {
    return from(this.userService.findOne(email))
      .pipe(
        switchMap((user: UserEntity | null) => {
          if (!user) {
            throw new HttpException('User is not found', HttpStatus.NOT_FOUND)
          }

          return this.verifyPassword(password, user.password)
            .pipe(
              switchMap((isVerified: boolean) => {
                if (isVerified) {
                  return this.authorize(user)
                    .pipe(
                      map((token: string) => ({
                        status: HttpStatus.CREATED,
                        data: token,
                      }))
                    )
                }

                throw new HttpException('Email or password is not correct', HttpStatus.UNAUTHORIZED)
              })
            )
        })
      )
  }

  verifyPassword(password: string, hash: string): Observable<boolean> {
    return of(bcrypt.compareSync(password, hash))
  }

  authorize(user: UserEntity): Observable<string> {
    const payload: IToken = {
      id: user.id,
      username: user.username,
    }
    const jwtOptions: JwtSignOptions = {
      secret: this.configService.get('JWT_SECRET'),
    }

    return from(this.jwtService.signAsync(payload, jwtOptions))
  }
}
