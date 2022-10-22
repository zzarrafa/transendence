import { TwoFactService } from './two-fact.service';
import { Response } from 'express';
import { UserService } from 'src/User/user/user.service';
import { LoginService } from 'src/login/login.service';
import { Profile } from 'passport-42';
import { TwoFactorAuthenticationCodeDto } from 'src/login/dto';
export declare class TwoFactController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    private loginService;
    constructor(twoFactorAuthenticationService: TwoFactService, usersService: UserService, loginService: LoginService);
    register(response: Response, request: any): Promise<any>;
    turnOnTwoFactorAuthentication(request: any, twoFactorAuthenticationCode: any): Promise<void>;
    disableTwoFactorAuthentication(request: any): Promise<void>;
    authenticate(user: Profile, code: TwoFactorAuthenticationCodeDto, request: any): Promise<import(".prisma/client").User>;
}
