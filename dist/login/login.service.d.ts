import { PrismaService } from "src/prisma/prisma.service";
import { LogDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Profile } from 'passport-42';
export declare class LoginService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    login(logDto: LogDto, userr: Profile): Promise<{
        access_token: string;
    }>;
    signToken(userId: number, displayName: string): Promise<{
        access_token: string;
    }>;
    isEmpty(str: string): boolean;
}
