import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
  providers: [ChatGateway],
  controllers: [AppController],
})
export class AppModule {}
