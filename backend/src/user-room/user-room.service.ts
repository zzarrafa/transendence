import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class UserRoomService {
    constructor(private prisma: PrismaService) {}
    // createMemberShip
    async createMemberShip(userId: number, roomId: number) {
        return this.prisma.userRoom.create({
            data: {
                userId,
                roomId,
            },
        });
    }
    // deleteMemberShip
    async deleteMemberShip(userId: number, roomId: number) {
        return this.prisma.userRoom.delete({
            where: {
                userId_roomId: {
                    userId,
                    roomId,
                },
            },
        });
    }
}   
