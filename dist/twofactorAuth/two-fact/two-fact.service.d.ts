import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/User/user/user.service';
import { User } from '@prisma/client';
import { Response } from 'express';
export declare class TwoFactService {
    private readonly usersService;
    private readonly configService;
    constructor(usersService: UserService, configService: ConfigService);
    generateTwoFactorAuthenticationSecret(user: User): Promise<{
        secret: string;
        otpauthUrl: string;
    }>;
    pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<any>;
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, secret: string): Promise<boolean>;
}
