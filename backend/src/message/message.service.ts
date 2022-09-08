import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/createMsg.dto';

@Injectable()
export class MessageService {
    constructor(private prisma: PrismaService) {}

    async createMessage(message: CreateMessageDto) {
        return this.prisma.message.create({
            data: {
                ...message,
                user: {
                    connect: {
                        id: message.user,
                    },
                },
                room: {
                    connect: {
                        id: message.room,
                    },
                },
            },
        });
    }

    async getMessagesForRoom(roomId: any) {
        return this.prisma.message.findMany({
            where: {
                room: {
                    id: parseInt(roomId),
                },
            },
            include: {
                user: true,
            },
        });
    }

    async deleteAllMessages() {
        return this.prisma.message.deleteMany({});
    }
}
