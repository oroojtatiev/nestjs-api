import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate'
import {from, map, Observable, switchMap} from 'rxjs'
import {Repository} from 'typeorm'
import * as bcrypt from 'bcrypt'
import {UserEntity} from './user.entity'
import {CreateUser, User} from './user.dto'

@Injectable()
export class UserService {
  private salt = 10

  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>
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

                const promise = this.userRepo.save(data)

                return from(promise).pipe(
                  map(({password, ...user}: UserEntity) => user)
                )
              })
            )
        })
      )
  }

  findAll(options: IPaginationOptions): Observable<Pagination<UserEntity>> {
    const promise = paginate<UserEntity>(this.userRepo, options)
    return from(promise)
  }

  findOne(email: string): Observable<UserEntity | null> {
    const promise = this.userRepo.findOne({
      where: {email},
      select: ['id', 'email', 'password', 'username']
    })

    return from(promise)
  }

  checkUserExist(id: number): Observable<User> {
    const promise = this.userRepo.findOneByOrFail({id})
    return from(promise).pipe()
  }

  hashPassword(password: string): Observable<string> {
    const promise = bcrypt.hash(password, this.salt)
    return from(promise)
  }

  checkEmailExist(email: string): Observable<boolean> {
    const promise = this.userRepo.findOne({
      where: {email},
    })

    return from(promise).pipe(
      map((user: UserEntity) => user !== null)
    )
  }
}