import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CacheService } from 'core/lib/cache/cache.service';
import { CacheObjectI } from 'core/lib/cache/interfaces/cache-object.interface';
import { UsersService } from 'modules/users/users.service';
import { ResponseFromServiceI } from 'shared/interfaces/general/response-from-service.interface';
import { LogUserInDto } from './dto/log-user-in.dto';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}

  async logUserIn(
    logUserInDto: LogUserInDto,
  ): Promise<ResponseFromServiceI<string>> {
    const { credentials } = logUserInDto;

    const user = await this.usersService.findUserByEmail(credentials);

    if (!user)
      throw new HttpException(
        'User Credentials is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const { password } = user;
    const isPasswordCorrect = await bcrypt.compare(
      logUserInDto.password,
      password,
    );

    if (!isPasswordCorrect)
      throw new HttpException(
        'User Credentials is incorrect',
        HttpStatus.UNAUTHORIZED,
      );

    const payload = {
      sub: user.id,
    };

    const userFromCache = await this.cacheService.get<CacheObjectI>(
      user.id + '',
    );

    let accessToken = undefined;
    if (!userFromCache?.accessToken) {
      accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('USER_ACCESS_TOKEN_SECRET')!,
        expiresIn: this.configService.get<string>(
          'USER_ACCESS_TOKEN_EXPIRES_IN',
        )!,
      });

      await this.cacheService.set(
        user.id + '',
        {
          userID: user.id + '',
          accessToken,
        },
        99999999,
      );

      return {
        data: accessToken,
        message: 'auth.success.login',
        httpStatus: HttpStatus.OK,
      };
    }

    accessToken = userFromCache?.accessToken;

    return {
      data: accessToken,
      message: 'auth.success.login',
      httpStatus: HttpStatus.OK,
    };
  }
}
