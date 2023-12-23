import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';
import { PasswordService } from './password.service';
import { UsersModule } from 'modules/users/users.module';
import { LogoutService } from './logout.service';

@Module({
  controllers: [AuthController],
  providers: [LoginService, RegisterService, PasswordService, LogoutService],
  imports: [UsersModule],
})
export class AuthModule {}
