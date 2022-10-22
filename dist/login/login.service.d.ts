import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserDto } from './dto/user.dto';
export declare class LoginService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    createUser(user: UserDto): Promise<void>;
    getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated?: boolean): Promise<string>;
}
