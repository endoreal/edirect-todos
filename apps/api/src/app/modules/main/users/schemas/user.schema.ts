import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import * as Crypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ toObject: { versionKey: false } })
export class User {

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function(next) {

  const user = this;

  if (!user.isModified('password')) {

    return next();
  }

  Crypt.genSalt(10, (err, salt) => {

    if (err) {

      return next(err);
    }

    Crypt.hash(user.password, salt, (err, hash) => {

      if (err) {

        return next(err);
      }

      user.password = hash;

      next();

    });
  })

})
