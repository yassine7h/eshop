import { Controller, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthRoles } from 'src/auth/roles.guard';

@Controller('user')
export class UserController {
  @AuthRoles(Role.CLIENT, Role.ADMIN)
  @Get('me')
  getMe() {
    return 'its me!';
  }
}
