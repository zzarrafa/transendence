import { LogDto } from './dto';
import { LoginService } from './login.service';
import { Profile } from 'passport-42';
import { Request } from 'express';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    ftAuth(): void;
    ftAuthCallback(user: Profile): void;
    logOut(req: Request): void;
    login(dto: LogDto, user: Profile): Promise<string>;
}
