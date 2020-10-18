import { Controller, Post, Body, UseGuards, Get, HttpStatus, HttpException } from '@nestjs/common';

import { CreateUserReq } from '@edirect/api-interfaces';

import { UsersService, ErrorUserEmailAlreadyExists } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { Usr } from './decorators/user.decorator';

@Controller('user')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserReq): Promise<void> {

    return await this.usersService.createUser(body).catch((e: Error) => {

      if (e instanceof ErrorUserEmailAlreadyExists) {

        throw new HttpException(e.message, HttpStatus.CONFLICT);
      }

      throw e;
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  whoAmI(@Usr() user: UserDocument): Promise<UserDocument> {

    return this.usersService.findById(user._id);
  }
}
