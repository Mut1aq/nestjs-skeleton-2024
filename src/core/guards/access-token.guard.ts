import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from 'core/decorators/public.decorator';
import { CacheService } from 'core/lib/cache/cache.service';
import { CacheObjectI } from 'core/lib/cache/interfaces/cache-object.interface';
import { DecodedTokenI } from 'shared/interfaces/http/decoded-token.interface';
import { RequestI } from 'shared/interfaces/http/request.interface';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflect: Reflector,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<RequestI>();

      const isPublic = this.reflect.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getClass(),
        context.getHandler(),
      ]);

      if (isPublic) return true;

      const authorization = request.headers.authorization;

      if (
        !authorization ||
        Array.isArray(authorization) ||
        typeof authorization !== 'string'
      )
        throw new HttpException('Invalid Headers', HttpStatus.UNAUTHORIZED);

      const [bearer, accessToken] = authorization.split(' ');

      if (bearer !== 'Bearer')
        throw new HttpException('Invalid Headers', HttpStatus.UNAUTHORIZED);

      const decodedToken = this.jwtService.verify<DecodedTokenI>(accessToken, {
        secret: this.configService.get<string>('USER_ACCESS_TOKEN_SECRET')!,
      });

      const { sub } = decodedToken;

      const cacheObject = await this.cacheService.get<CacheObjectI>(sub + '');

      const isTokenFromCacheSameAsTokenFromHeaders =
        cacheObject?.accessToken === accessToken;

      if (!isTokenFromCacheSameAsTokenFromHeaders)
        throw new HttpException('Nice Try', HttpStatus.UNAUTHORIZED);

      request.user = decodedToken;
      return true;
    } catch (error: any) {
      throw new HttpException(
        !!error?.message ? error.message : 'You must be logged in first',
        !!error?.status ? error.status : HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
