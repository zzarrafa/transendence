import { Injectable , UnauthorizedException, NotFoundException} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User , Prisma } from '@prisma/client';
import {JwtService} from '@nestjs/jwt';
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





// had l9lawi mzl 
async setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>
{
  return await this.prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorAuthenticationSecret: secret,
    },
  })
}
}
