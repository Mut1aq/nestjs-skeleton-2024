import { FindOptionsSelect } from 'typeorm';
import { User } from '../entities/user.entity';

export const selectUsers: string[] | FindOptionsSelect<User> = [
  'id',
  'username',
  'gender',
  'profileStatus',
];

export const relationSelectUser: FindOptionsSelect<User> = {
  id: true,
  username: true,
  gender: true,
  profileStatus: true,
};

export const selectUser: FindOptionsSelect<User> = {
  id: true,
  username: true,
  gender: true,
  profileStatus: true,
   
};
