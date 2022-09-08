import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRoomDto } from './dto/CreateRoom.dto';

@Injectable()
export class RoomService {
    constructor(private prisma: PrismaService) {}
    async createRoom(room: CreateRoomDto, creatorId: number) {
        room.users.push(creatorId);
        return this.prisma.room.create({
            data: {
                ...room,
                users: {
                    connect: room.users.map((id) => ({ id })),
                }
            },
            include: {
                users: true,
            }
        });
    }

    async getRoomsForUser(userId: any) {
        return this.prisma.user.findUnique({
            where: {
                id: parseInt(userId),
            },
        }).rooms();
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
                id: parseInt(roomId),
            },
            include: {
                users: true,
            }
        });
    }

    async joinRoom(roomId: number, userId: number) {
        return this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                users: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async leaveRoom(roomId: number, userId: number) {
        return this.prisma.room.update({
            where: {
                id: roomId,
            },
            data: {
                users: {
                    disconnect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async deleteAllRooms() {
        return this.prisma.room.deleteMany({});
    }

    // async joinRoom(roomId: any, userId: any) {
    //     return this.prisma.room.update({
    //         where: {
    //             id: parseInt(roomId),
    //         },
    //         data: {
    //             users: {
    //                 connect: {
    //                     id: parseInt(userId),
    //                 },
    //             },
    //         },
    //     });
    // }
}
