import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminRoute } from 'src/auth/decorators';
import { IUserResponse } from 'contracts';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @AdminRoute()
  @Get('all')
  getAllUsers(): Promise<IUserResponse[]> {
    return this.userService.getAllUsers();
  }
}
