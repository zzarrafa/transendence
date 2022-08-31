import { TwoFactService } from './two-fact.service';
import { Response } from 'express';
import { UserService } from 'src/User/user/user.service';
export declare class TwoFactController {
    private readonly twoFactorAuthenticationService;
    private readonly usersService;
    constructor(twoFactorAuthenticationService: TwoFactService, usersService: UserService);
    register(response: Response, request: any): Promise<any>;
    turnOnTwoFactorAuthentication(request: any, twoFactorAuthenticationCode: any): Promise<void>;
}
