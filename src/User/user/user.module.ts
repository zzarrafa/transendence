import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { UserGateway } from './user.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService , JwtService, UserGateway],
})
export class UserModule {}
