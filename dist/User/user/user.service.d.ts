import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from './user_status.enum';
export declare class UserService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    getAllUsers(): Promise<{
        displayName: string;
        email: string;
    }[]>;
    getUserById(id: number): Promise<User>;
    UpdateDisplayName(id: number, displayName: string): Promise<User>;
    getWins(id: number): Promise<number>;
    getLoses(id: number): Promise<number>;
    getLevel(id: number): Promise<number>;
    updateStatus(id: number, status: UserStatus): Promise<User>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>;
    turnOnTwoFactorAuthentication(userId: number): Promise<User>;
}
