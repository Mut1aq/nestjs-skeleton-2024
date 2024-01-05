import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SCHEMAS } from 'shared/constants/schemas.constant';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UserDocument } from './types/user-document.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(SCHEMAS.USERS) private readonly userModel: Model<User>,
  ) {}

  createUserForAuth(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  findUserByEmail(credentials: string) {
    return this.userModel
      .findOne<UserDocument>({
        $or: [
          {
            email: credentials,
          },
          {
            username: credentials,
          },
        ],
      })
      .exec();
  }

  findByID(userID: string) {
    return this.userModel.findById<UserDocument>(userID).exec();
  }
}
