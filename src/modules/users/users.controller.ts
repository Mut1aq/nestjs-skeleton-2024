import {
  Controller,
  
} from '@nestjs/common'; 
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { ROUTES } from 'shared/constants/routes.constant'; 

@ApiTags(ROUTES.USERS.CONTROLLER)
@Controller(ROUTES.USERS.CONTROLLER)
export class UsersController {
  
 
}
