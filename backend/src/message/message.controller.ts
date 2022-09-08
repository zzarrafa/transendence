import { Controller, Post, Get, Body, Param, Delete } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/createMsg.dto';

@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {}

    @Post('create')
    async createMessage(@Body() message: CreateMessageDto) {
        return this.messageService.createMessage(message);
    }

    @Get('/room/:roomId')
    async getMessagesForRoom(@Param('roomId') roomId: number) {
        return this.messageService.getMessagesForRoom(roomId);
    }

    @Delete('/delete')
    async deleteAllMessages() {
        return this.messageService.deleteAllMessages();
    }
}
