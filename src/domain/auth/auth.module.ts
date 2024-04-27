import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {JwtModule, JwtService} from '@nestjs/jwt'
import {AuthController} from './auth.controller'
import {AuthService} from './auth.service'
import {UserService} from '../user/user.service'
import {UserEntity} from '../user/user.entity'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {JwtModuleOptions} from '@nestjs/jwt/dist/interfaces/jwt-module-options.interface'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<JwtModuleOptions> => {
        return {
          // global: true,
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '60s',
          },
        }
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtService],
})
export class AuthModule {}
