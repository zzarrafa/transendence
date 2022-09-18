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

    async getMembership(roomId: any, userId: any) {
        return this.prisma.membership.findMany({
            where: {
               roomId: parseInt(roomId),
               userId: parseInt(userId),
            },
        });
    }

    async deleteMembership(roomId: any, userId: any) {
        return this.prisma.membership.deleteMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
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
        let rooms = [];
        for (let i = 0; i < tmpRooms.length; i++) {
            rooms[i] = tmpRooms[i].room;
        }
        return rooms;
    }

    async isMember(roomId: any, userId: any) {
         const membership = await this.prisma.membership.findMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
                isBanned: false,
            },
        });
        if (membership.length === 0) {
            return false;
        }
        return true;
    }

    async getMembersForRoom(roomId: any) {
        const tmpMembers = await this.prisma.membership.findMany({
            where: {
                roomId: parseInt(roomId),
                isBanned: false,
            },
            include: {
                user: true,
            },
        });
        let members = [];
        for (let i = 0; i < tmpMembers.length; i++) {
            members[i] = tmpMembers[i].user;
        }
        return members;
    }

    async updateRole(roomId: any, userId: any, role: number) {
        console.log(roomId, userId, role);
        return this.prisma.membership.updateMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
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

    async updateMuted(roomId: any, userId: any, isMuted: boolean) {
        return this.prisma.membership.updateMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
            },
            data: {
                isMuted: isMuted,
            },
        });
    }

    async isMuted(roomId: any, userId: any) {
        const membership = await this.prisma.membership.findMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
                isMuted: true,
                isBanned: false,
            },
        });
        if (membership.length === 0) {
            return false;
        }
        return true;
    }

    async getRole(roomId: any, userId: any) {
        const membership = await this.prisma.membership.findMany({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId),
            },
        });
        if (membership.length === 0) {
            return -1;
        }
        return membership[0].role;
    }
   
}