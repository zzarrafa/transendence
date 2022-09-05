import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async deleteAllUsers() {
        return this.prisma.user.deleteMany();
    }
    async createManyUsers(users: any) {
        return this.prisma.user.createMany({
            data: users,
        });
    }

    async getAllUsers() {
        return await this.prisma.user.findMany();
    }

    async getUserByUsername(username: string) {
        return await this.prisma.user.findUnique({
            where: {
                username,
            },
        });
    }
}
