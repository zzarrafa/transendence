import { Module } from '@nestjs/common';
import { TwoFactController } from './two-fact.controller';
import { TwoFactService } from './two-fact.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from "src/login/jwt/jwt.strategy";
import { UserService } from 'src/User/user/user.service';
import { UserModule } from 'src/User/user/user.module';

@Module({
  imports: [JwtModule.register({}),
    ConfigModule.forRoot({isGlobal: true}), UserModule
  ],
  controllers: [TwoFactController],
  providers: [TwoFactService, JwtStrategy, ConfigService, UserService]
})
export class TwoFactModule {}
