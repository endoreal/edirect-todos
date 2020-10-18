import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as Crypt from 'bcrypt';

import { LoginUserReq, Jwt } from '@edirect/api-interfaces';

import { UsersService } from '../main/users/users.service';
import { JwtPayload } from './jwt/jwt.interface';
import { jwtConstants } from './jwt/jwt.constants';
import { UserDocument } from '../main/users/schemas/user.schema';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(login: LoginUserReq): Promise<Jwt> {

    const user = await this.usersService.validateUser(login.email);

    if (user && await Crypt.compare(login.password, user.password)) {

      return this.createJwt(user)
    }

    throw new UnauthorizedException();
  }

  createJwt(user: UserDocument): Jwt {

    const payload: JwtPayload = {
      email: user.email,
      sub: user._id
    };

    return {
      access_token: this.jwtService.sign(payload),
      expires: new Date().valueOf() + (jwtConstants.expiresIn * 1000),
      user: {
        _id: user._id,
        email: user.email
      }
    }
  }

}
