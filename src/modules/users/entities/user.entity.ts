 import { Base } from 'shared/entities/base.entity';
import { Gender } from 'shared/enums/gender.enum';
import { Column, Entity,   } from 'typeorm';
import { AccountStatus } from '../enums/account-status.enum';
import { ProfileStatus } from '../enums/profile-status.enum';
  
@Entity()
export class User extends Base {
  @Column({ type: 'varchar', length: 30, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 320, unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ type: 'varchar', length: 29 })
  birthday!: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus!: AccountStatus;

  @Column({ type: 'enum', enum: ProfileStatus, default: ProfileStatus.PUBLIC })
  profileStatus!: ProfileStatus;

  
}
