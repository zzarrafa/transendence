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
        XpPoints: number;
        avatar: string;
        wins: number;
        loses: number;
        draws: number;
    }[]>;
    getUserById(id: number): Promise<User>;
    GetUserByEmail(email: string): Promise<User>;
    UpdateDisplayName(id: number, displayName: string): Promise<User>;
    getWins(id: number): Promise<number>;
    getDraws(id: number): Promise<number>;
    getLoses(id: number): Promise<number>;
    getXp(id: number): Promise<number>;
    updateStatus(id: number, status: UserStatus): Promise<User>;
    updaatepicture(id: number, avatar: string): Promise<User>;
    incrementWins(id: number): Promise<void>;
    incrementDraws(id: number): Promise<void>;
    incrementLoses(id: number): Promise<void>;
    setTwoFactorAuthenticationSecret(secret: string, userId: number): Promise<User>;
    turnOnTwoFactorAuthentication(userId: number): Promise<User>;
}
