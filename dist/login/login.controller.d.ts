import { LoginService } from './login.service';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    ftAuth(): void;
    ftAuthCallback(): void;
}
