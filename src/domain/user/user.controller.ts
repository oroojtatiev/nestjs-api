import {Body, Controller, Get, HttpStatus, Post, Query, UseGuards, UsePipes} from '@nestjs/common'
import {UserService} from './user.service'
import {map} from 'rxjs'
import {Pagination} from 'nestjs-typeorm-paginate'
import {CreateUser, createUserSchema, User} from './user.dto'
import {ZodValidationPipe} from '../../pipes/ZodValidation.pipe'
import {ObservableResponse} from '../../types/response'
import {AuthGuard} from '../../guards/auth.guard'

@Controller('user')
export class UserController {
  private readonly defaultPage: number = 1
  private readonly defaultLimit: number = 10

  constructor(
    private userService: UserService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createUserSchema))
  create(@Body() body: CreateUser): ObservableResponse<User> {
    return this.userService.create(body)
      .pipe(
        map((user: User) => ({
          status: HttpStatus.CREATED,
          message: 'The user has been created',
          data: user,
        }))
      )
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(
    @Query('page') page: number = this.defaultPage,
    @Query('limit') limit: number = this.defaultLimit
  ): ObservableResponse<Pagination<User>> {
    limit = limit > 100 ? 100 : limit
    return this.userService.findAll({page, limit})
      .pipe(
        map(users => ({
          status: HttpStatus.OK,
          data: users,
        }))
      )
  }
}
