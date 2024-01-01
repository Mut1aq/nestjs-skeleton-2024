import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheService } from 'core/lib/cache/cache.service';
 import { DynamicObjectI } from 'shared/interfaces/general/dynamic-object.interface';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { checkNullability } from 'shared/util/nullability.util';
import {
   FindOneOptions,
  FindOptionsSelect,
  ILike,
  IsNull,
  Not,
  Repository,
} from 'typeorm';
import {
   selectUser,
  selectUsers,
} from './constants/select-user.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

     
  ) {}

  async createUserForAuth(createUserDto: CreateUserDto) {
    const createdUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(createdUser);

    return createdUser;
  }

  async findAll(
    filterUsersDto: FilterUsersDto,
  ): Promise<ResponseFromServiceI<User[]>> {
    const { skip, take, email, username } = filterUsersDto;

    const filterObject: DynamicObjectI = {};
    !checkNullability(email)
      ? (filterObject['email'] = Not(IsNull()))
      : (filterObject['email'] = ILike(`%${email}%`));
    !checkNullability(username)
      ? (filterObject['username'] = Not(IsNull()))
      : (filterObject['username'] = ILike(`%${username}%`));

    const users = await this.usersRepository.find({
      select: selectUsers as FindOptionsSelect<User>,
      where: [filterObject],
      take,
      skip,
    });
    return {
      data: users,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findAll',
        args: { entity: 'entities.user' },
      },
    };
  }

  async findOne(userID: string): Promise<ResponseFromServiceI<User>> {
    const user = await this.usersRepository.findOne({
      relations: {
        posts: { postMedias: true },
        followers: true,
        followings: true,
      },
      where: { id: userID },
      select: selectUser,
    });
    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    return {
      data: user,
      httpStatus: HttpStatus.OK,
      message: {
        translationKey: 'shared.success.findOne',
        args: { entity: 'entities.user' },
      },
    };
  }

  async update(
    userID: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseFromServiceI<User>> {
    const updateResult = await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id: userID })
      .returning(selectUsers as string[])
      .execute();

    if (!updateResult.affected)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    return {
      data: updateResult.raw[0],
      message: {
        translationKey: 'shared.success.update',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }

  async remove(userID: string): Promise<ResponseFromServiceI<number>> {
    const deleteResult = await this.usersRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: userID })
      .returning(selectUsers as string[])
      .execute();

    if (!deleteResult.affected)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    this.cacheService.del(userID + '');

    return {
      data: deleteResult.raw[0],
      message: {
        translationKey: 'shared.success.delete',
        args: { entity: 'entities.user' },
      },
      httpStatus: HttpStatus.OK,
    };
  }
 

  findOneByID(userID: string) {
    return this.usersRepository.findOneBy({ id: userID });
  }

  findOneWithOptions(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  findUserByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  findUserByColumn(column: string, value: unknown) {
    return this.usersRepository.findOneBy({ [column]: value });
  }
}
