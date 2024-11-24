import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  firstname: string;
  @IsNotEmpty()
  lastname: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  roles: Role[];
}
export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  password: string;
}
