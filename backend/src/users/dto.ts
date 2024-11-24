import { IsArray, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  password?: string;
  @IsString()
  firstname?: string;
  @IsString()
  lastname?: string;
  @IsString()
  address?: string;
}
