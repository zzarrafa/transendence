import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FtStrategy } from './ft.strategy';
import { LoginController } from './login.controller';
import { SessionSerializer } from './session.serializer';
import { LoginService } from './login.service';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';


@Module({
  imports: [JwtModule.register({}),
    ConfigModule.forRoot({isGlobal: true}),
    HttpModule,
    PrismaModule,
  ],
  controllers: [LoginController],
  providers: [ConfigService, FtStrategy, SessionSerializer, LoginService, JwtStrategy],
})
export class LoginModule {}
