import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import { UserController } from './user.controller'
import {UserEntity} from './user.entity'
import {UserService} from './user.service'
import {JwtService} from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtService],
})
export class UserModule {}
