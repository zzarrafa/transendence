import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from './user.gateway';
import { RequestModule } from 'src/Friendship/request/request.module';
import { RequestService } from 'src/Friendship/request/request.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService , JwtService, UserGateway , RequestService
  ],
})
export class UserModule {}
