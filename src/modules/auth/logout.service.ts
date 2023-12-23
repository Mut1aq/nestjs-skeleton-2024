import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CacheService } from 'core/lib/cache/cache.service';
import { User } from 'modules/users/entities/user.entity';
import { UsersService } from 'modules/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';

@Injectable()
export class LogoutService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly userService: UsersService,
  ) {}

  async logUserOut(userID: string): Promise<ResponseFromServiceI<User>> {
    const userToLogout = await this.userService.findOneByID(userID);
    if (!userToLogout)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    await this.cacheService.deleteField(userID + '', 'accessToken');

    return {
      message: 'auth.success.logout',
      httpStatus: HttpStatus.OK,
      data: userToLogout,
    };
  }
}
