import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getAllUsers(): Promise<{
        displayName: string;
        email: string;
    }[]>;
    getUserById(id: number): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>;
    turnOnTwoFactorAuthentication(userId: number): Promise<User>;
}
