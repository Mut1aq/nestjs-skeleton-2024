import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UniqueColumnValidator } from './decorator/unique-column.decorator';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UniqueColumnValidator],
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
