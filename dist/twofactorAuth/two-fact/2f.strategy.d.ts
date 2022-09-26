import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/User/user/user.service';
import TokenPayload from 'src/login/jwt/tokenPayload.interface';
declare const JwtTwoFactorStrategy_base: new (...args: any[]) => any;
export declare class JwtTwoFactorStrategy extends JwtTwoFactorStrategy_base {
    private readonly configService;
    private readonly userService;
    constructor(configService: ConfigService, userService: UserService);
    validate(payload: TokenPayload): Promise<import(".prisma/client").User>;
}
export {};
