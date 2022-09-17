import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/CreateRoom.dto';
import { MembershipService } from 'src/membership/membership.service';


@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService, private membershipService: MembershipService) {}
    async createRoom(room: CreateRoomDto, creatorId: number) {
        const newRoom = await this.prisma.room.create({
            data: {
                name: room.name,
                type: room.type,
                isPrivate: room.isPrivate,
                password: room.password
            }
        });
        await this.membershipService.createMembership(newRoom.id, creatorId);
        await this.membershipService.updateRole(newRoom.id, creatorId, 2);
        for (var userId of room.users)
        {
            await this.membershipService.createMembership(newRoom.id, userId);
        }
    }
    
    async getAllRooms() {
        return this.prisma.room.findMany({
            include: {
                users: true,
            }
        })
    }
    
    async getRoomById(roomId: any) {
        return this.prisma.room.findUnique({
            where: {
                id: roomId,
            },
            include: {
                users: true,
            }
        });
    }

}
