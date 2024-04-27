import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {JwtModule, JwtService} from '@nestjs/jwt'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {UserService} from '../user/user.service'
import {UserEntity} from '../user/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService],
})
export class AuthModule {}
