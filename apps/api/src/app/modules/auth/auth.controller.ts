import { Controller, Post, Body, HttpCode } from '@nestjs/common';

import { LoginUserReq, Jwt } from '@edirect/api-interfaces';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) {}

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginUserDto: LoginUserReq): Promise<Jwt> {

    return this.authService.validateUser(loginUserDto);
  }
}
