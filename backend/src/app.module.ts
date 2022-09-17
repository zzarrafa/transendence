import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';
import { MessageService } from './message/message.service';
import { MessageController } from './message/message.controller';
import { MembershipService } from './membership/membership.service';
import { MembershipController } from './membership/membership.controller';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [ChatGateway, UserService, RoomService, MessageService, MembershipService],
  controllers: [AppController, UserController, RoomController, MessageController, MembershipController],
})
export class AppModule {}
