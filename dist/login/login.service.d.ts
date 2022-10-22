import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Profile } from 'passport-42';
export declare class LoginService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    login(userr: Profile, request: any): Promise<any>;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): Promise<string>;
}
