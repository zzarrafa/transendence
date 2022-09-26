import { Injectable , UnauthorizedException, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User  } from '@prisma/client';
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
                XpPoints: true,
                avatar: true,
                wins: true,
                loses: true,
                draws: true,
            },
        });
}

async getUserById(id: number) : Promise<User> {
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

async GetUserByEmail(email: string)
{
    const user = await this.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user;
}
async UpdateDisplayName(id: number, displayName: string) {

    const user = await this.prisma.user.findUnique({
        where: {
            displayName : displayName,
        },
    });
    if (user) {
        //ma3rftch achmen exception ndir
        throw new NotFoundException('display name already used');
    }
    else{
    const user = await this.prisma.user.update({
        where: {
            id : id,
        },
        data: {
            displayName : displayName,
        },
    });
    return user;
}}
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
async getDraws(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user.draws;
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
async getXp(id: number) {
    const user = await this.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!user) {
        throw new NotFoundException('user not found');
    }
    return user.XpPoints;
}

async updateStatus(id: number, status: UserStatus) {
    const user = await this.prisma.user.update({
        where: {
            id : id,
        },
        data: {
            status :status,
        },
    });
    return user;
}

async updaatepicture(id: number, avatar: string) {
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            avatar,
        },
    });
    return user;
}

// increment wins
async incrementWins(id: number) {
    
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            wins: {
                increment: 1,
            },
        },
    });
}
// increment draws
async incrementDraws(id: number) {
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            draws: {
                increment: 1,
            },
        },
    });
}
async incrementLoses(id: number) {
    const user = await this.prisma.user.update({
        where: {
            id,
        },
        data: {
            loses: {
                increment: 1,
            },
        },
    });
}



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

