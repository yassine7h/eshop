import { ForbiddenException, Injectable } from '@nestjs/common';
import { DBService } from 'src/db/db.service';
import { SignupDTO, LoginDTO } from './dto';
import * as argon from 'argon2';
import { Cart, Role, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable({})
export class AuthService {
  constructor(
    private dbService: DBService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async login(body: LoginDTO) {
    const user = await this.dbService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials incorrect');
    const pwMatches = await argon.verify(user.password, body.password);
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    if (user.isActive === false)
      throw new ForbiddenException('User is not active');
    delete user.password;
    return { jwt_token: await this.signToken(user.id, user.email), user: user };
  }

  async signup(body: SignupDTO) {
    const hashedPassword = await argon.hash(body.password);
    const roles: Role[] = Array.isArray(body.roles)
      ? body.roles
      : JSON.parse(body.roles);
    const isOnlyClient = roles.length === 1 && roles[0] === Role.CLIENT;
    const data: any = {
      email: body.email,
      password: hashedPassword,
      firstname: body.firstname,
      lastname: body.lastname,
      roles: roles,
      isActive: isOnlyClient,
    };
    if (roles.includes(Role.CLIENT)) data.address = body.address;
    try {
      const user = await this.dbService.user.create({
        data: data,
      });
      if (roles.includes(Role.CLIENT)) {
        const cart = await this.dbService.cart.create({
          data: {
            user: {
              connect: { id: user.id },
            },
          },
        });
      }
      delete user.password;
      if (isOnlyClient) {
        return {
          jwt_token: await this.signToken(user.id, user.email),
          user: user,
        };
      } else {
        return {
          message:
            'User created successfully, but not active, wait for super admin to activate your account',
        };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002')
          throw new ForbiddenException('This email is taken');
      }
      throw error;
    }
  }
  private async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1440m',
      secret: this.config.get('JWT_SECRET'),
    });
    return token;
  }
}
