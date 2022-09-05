import { TwoFactService } from './two-fact.service';
import { Response } from 'express';
import { UserService } from 'src/User/user/user.service';
import { LoginService } from 'src/login/login.service';
export declare class TwoFactController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    private loginService;
    constructor(twoFactorAuthenticationService: TwoFactService, usersService: UserService, loginService: LoginService);
    register(response: Response, request: any): Promise<any>;
    turnOnTwoFactorAuthentication(request: any, twoFactorAuthenticationCode: any): Promise<void>;
    authenticate(request: any, twoFactorAuthenticationCode: any): Promise<any>;
}
