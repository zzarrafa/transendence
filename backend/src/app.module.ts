import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [ChatGateway, UserService, RoomService],
  controllers: [AppController, UserController, RoomController],
})
export class AppModule {}
