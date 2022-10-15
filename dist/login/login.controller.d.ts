import { LoginService } from './login.service';
import { Profile } from 'passport-42';
import { UserService } from 'src/User/user/user.service';
export declare class LoginController {
    private loginService;
    private userService;
    constructor(loginService: LoginService, userService: UserService);
    ftAuth(): void;
    logOut(request: any): Promise<void>;
    login(user: Profile, request: any, res: any): Promise<void>;
}
