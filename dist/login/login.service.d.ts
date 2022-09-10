import { PrismaService } from "src/prisma/prisma.service";
import { LogDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Profile } from 'passport-42';
import { UserService } from 'src/User/user/user.service';
export declare class LoginService {
    private prisma;
    private jwt;
    private config;
    private userService;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, userService: UserService);
    login(logDto: LogDto, userr: Profile, request: any): Promise<void>;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): Promise<string>;
}
