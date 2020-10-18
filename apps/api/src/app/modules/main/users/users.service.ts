import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './schemas/user.schema';

import { CreateUserReq } from '@edirect/api-interfaces';

export class ErrorUserEmailAlreadyExists extends Error {
  message = 'This email already exists.';
}

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) {}

  async createUser(createUserDto: CreateUserReq): Promise<void> {

    const emailAlreadyExists = await this.findByEmail(createUserDto.email);

    if (emailAlreadyExists) {

      throw new ErrorUserEmailAlreadyExists();
    }

    await new this.userModel(createUserDto).save();

    return;
  }

  async validateUser(email: string): Promise<UserDocument> {

    return await this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(_id: string): Promise<UserDocument> {

    return await this.userModel.findById(_id).exec();
  }

  async findByEmail(email: string): Promise<UserDocument> {

    return await this.userModel.findOne({ email }).exec();
  }

  async findAll(): Promise<UserDocument[]> {

    return await this.userModel.find().exec();
  }
}
