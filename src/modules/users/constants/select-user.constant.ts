import { FindOptionsSelect } from 'typeorm';
import { User } from '../entities/user.entity';

export const selectUser: string[] | FindOptionsSelect<User> = [
  'id',
  'email',
  'username',
  'city',
];
