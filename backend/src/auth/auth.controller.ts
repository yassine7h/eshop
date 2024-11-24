import { Body, Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { LoginDTO, SignupDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }
  @Post('signup')
  signup(@Body() body: SignupDTO) {
    return this.authService.signup(body);
  }
}
