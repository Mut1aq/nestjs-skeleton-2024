import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UniqueColumnValidator } from './decorators/unique-column.decorator';
import { Follower } from './entities/follower.entity';
import { Following } from './entities/following.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UniqueColumnValidator],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User, Follower, Following])],
})
export class UsersModule {}
