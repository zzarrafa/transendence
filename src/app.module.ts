import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';
import { PrismaModule } from './prisma/prisma.module';
import {JwtService} from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    LoginModule,
    HttpModule,
    PrismaModule,
    ConfigModule.forRoot({isGlobal: true}),
  ],
  controllers: [AppController],
  providers: [LoginService, JwtService],
})
export class AppModule {}
