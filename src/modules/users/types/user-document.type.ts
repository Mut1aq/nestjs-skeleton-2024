import { HydratedDocument } from 'mongoose';
import { User } from '../entities/user.entity';

export type UserDocument = HydratedDocument<User>;
