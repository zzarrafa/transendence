import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MembershipService {
    constructor(private prisma: PrismaService) {}

    async createMembership(roomId: number, userId: number) {
        const membership = await this.getMembership(roomId, userId);
        if (membership.length === 0) {
            return this.prisma.membership.create({
                data: {
                    roomId,
                    userId,
                    role: 0,
                    isBanned: false,
                    isMuted: false,
                },
            });
        }
        return membership;
    }

    async getMembership(roomId: number, userId: number) {
        return this.prisma.membership.findMany({
            where: {
               roomId: roomId,
               userId: userId,
            },
        });
    }

    async deleteMembership(roomId: number, userId: number) {
        return this.prisma.membership.deleteMany({
            where: {
                roomId: roomId,
                userId: userId,
            },
        });
    }

    async getRoomsForUser(userId: any) {
        const tmpRooms = await this.prisma.membership.findMany({
            where: {
                userId: parseInt(userId),
                isBanned: false,
            },
            include: {
                room: true,
            },
        });
        console.log(tmpRooms);
        let rooms = [];
        for (let i = 0; i < tmpRooms.length; i++) {
            rooms[i] = tmpRooms[i].room;
        }
        return rooms;
    }

    async isMember(roomId: number, userId: number) {
         const membership = await this.prisma.membership.findMany({
            where: {
                roomId: roomId,
                userId: userId,
                isBanned: false,
            },
        });
        if (membership.length === 0) {
            return false;
        }
        return true;
    }

    async getMembersForRoom(roomId: number) {
        return this.prisma.membership.findMany({
            where: {
               roomId: roomId,
            },
        });
    }

    async updateRole(roomId: number, userId: number, role: number) {
        return this.prisma.membership.updateMany({
            where: {
                roomId: roomId,
                userId: userId,
            },
            data: {
                role: role,
            },
        });
    }

    async banUser(roomId: number, userId: number) {
        return this.prisma.membership.updateMany({
            where: {
                roomId: roomId,
                userId: userId,
            },
            data: {
                isBanned: true,
            },
        });
    }

    async updateMuted(roomId: number, userId: number, isMuted: boolean) {
        return this.prisma.membership.updateMany({
            where: {
                roomId: roomId,
                userId: userId,
            },
            data: {
                isMuted: isMuted,
            },
        });
    }
   
}