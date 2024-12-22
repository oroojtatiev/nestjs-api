import {Module} from '@nestjs/common'
import {ConfigService} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import {JwtModule} from '@nestjs/jwt'
import {JwtModuleOptions} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {UserService} from '../user/user.service'
import {UserEntity} from '../user/user.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => {
        return {
          global: true,
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '1h',
          },
        }
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
