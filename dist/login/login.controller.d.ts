import { LoginService } from './login.service';
import { Profile } from 'passport-42';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    logOut(request: any): Promise<void>;
    login(user: Profile, request: any): Promise<any>;
}
