import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';
import { PrismaModule } from './prisma/prisma.module';
import {JwtService} from '@nestjs/jwt';
import { UserService } from './User/user/user.service';
import { UserModule } from './User/user/user.module';
import { TwoFactService } from './twofactorAuth/two-fact/two-fact.service';
import { TwoFactModule } from './twofactorAuth/two-fact/two-fact.module';
import { RequestModule } from './Friendship/request/request.module';
import { RequestService } from './Friendship/request/request.service';
import { UserGateway } from './User/user/user.gateway';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    UserModule,
    LoginModule,
    TwoFactModule,
    HttpModule,
    PrismaModule,
    ConfigModule.forRoot({isGlobal: true}),
    RequestModule,
  ],
  controllers: [AppController],
  providers: [LoginService, JwtService, UserService, TwoFactService, RequestService, UserGateway],
})
export class AppModule {}
