import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {from, map, Observable, of, switchMap} from 'rxjs'
import {Repository} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {UserEntity} from './user.entity'
import {CreateUser, User} from './user.dto'

@Injectable()
export class UserService {
  private salt = 10

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  create(user: CreateUser): Observable<User> {
    return this.checkEmailExist(user.email)
      .pipe(
        switchMap(isExist => {
          if (isExist) {
            throw new HttpException('Email is already exist', HttpStatus.CONFLICT)
          }

          return this.hashPassword(user.password)
            .pipe(
              switchMap(hash => {
                const data = {
                  ...user,
                  email: user.email.toLowerCase(),
                  password: hash,
                }

                return from(this.userRepo.save(data))
                  .pipe(
                    map(({password, ...user}: UserEntity) => user)
                  )
              })
            )
        })
      )
  }

  findAll(options: IPaginationOptions): Observable<Pagination<UserEntity>> {
    return from(paginate<UserEntity>(this.userRepo, options))
  }

  hashPassword(password: string): Observable<string> {
    const hash = bcrypt.hashSync(password, this.salt)
    return of(hash)
  }

  checkEmailExist(email: string): Observable<boolean> {
    return from(this.userRepo.findOne({
      where: {
        email,
      },
    }))
      .pipe(
        map((user: UserEntity) => user !== null)
      )
  }
}