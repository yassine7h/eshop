import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { GetUser } from 'src/auth/getuser.decorator';
import { AuthRoles } from 'src/auth/roles.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @AuthRoles(Role.CLIENT, Role.ADMIN, Role.SELLER, Role.SUPADMIN)
  @Get('me')
  getMe(@GetUser() user: User) {
    delete user.password;
    return user;
  }

  @AuthRoles(Role.CLIENT, Role.ADMIN, Role.SELLER, Role.SUPADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() user: User,
  ) {
    if (user.id !== id)
      throw new ForbiddenException('You cannot modify this user');
    return this.usersService.update(id, updateUserDto);
  }

  @AuthRoles(Role.SUPADMIN)
  @Get('all')
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
  @AuthRoles(Role.SUPADMIN)
  @Post('activate')
  toggleIsActive(
    @Body() { userId, isActive }: { userId: number; isActive: boolean },
  ) {
    return this.usersService.toggleIsActive(userId, isActive);
  }
}
