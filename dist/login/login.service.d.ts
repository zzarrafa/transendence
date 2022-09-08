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
        access_token: Promise<string>;
    }>;
    isEmpty(str: string): boolean;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): {
        access_token: Promise<string>;
    };
}