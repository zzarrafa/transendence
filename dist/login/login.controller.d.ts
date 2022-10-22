import { LoginService } from './login.service';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    signUp(req: any): Promise<any>;
    logOut(request: any): Promise<void>;
}
