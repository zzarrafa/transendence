import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/User/user/user.service';
import { UserModule } from 'src/User/user/user.module';

 
@Module({
  imports: [JwtModule.register({}),
    ConfigModule.forRoot({isGlobal: true}),
    HttpModule,
    PrismaModule,
    UserModule
  ],
  controllers: [LoginController],
  providers: [ConfigService, FtStrategy, LoginService, JwtStrategy, UserService],
})
export class LoginModule {}
