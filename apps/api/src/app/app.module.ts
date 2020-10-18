import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';

import { MainModule } from './modules/main/main.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://<user>:<pass>@grey.vxesy.mongodb.net/tracker?retryWrites=true&w=majority'),
    AuthModule,
    MainModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
