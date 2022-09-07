import { Injectable , UnauthorizedException, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User , Prisma } from '@prisma/client';
import {JwtService} from '@nestjs/jwt';
import { UserStatus } from './user_status.enum';
@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    // get all users
    async getAllUsers()  {
       let user = this.prisma
        
        return await this.prisma.user.findMany({
            select: {
                displayName: true,
                email: true,
            },
        });
}

async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user;
}
async UpdateDisplayName(id: number, displayName: string) {
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            displayName,
        },
    });
    return user;
}
async getWins(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user.wins;
}
async getLoses(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user.loses;
}
async getLevel(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user.level;
}

async updateStatus(id: number, status: UserStatus) {
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });
    return user;
}

// update win and loses



// 2factor auth
async setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>
{
  // console.log(userId);
  return await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorAuthenticationSecret: secret,
    },
  });
}

async turnOnTwoFactorAuthentication(userId: number): Promise<User>
{
  return await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isTwoFactorAuthenticationEnabled: true,
    },
  });
}
}

