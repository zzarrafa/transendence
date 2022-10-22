import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Profile } from 'passport-42';
import { CreateUserDto } from './dto/user.dto';
export declare class LoginService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    login(userr: Profile, request: any, res: any): Promise<import(".prisma/client").User>;
    createUser(user: CreateUserDto): Promise<void>;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): Promise<string>;
}
