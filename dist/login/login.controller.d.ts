import { LoginService } from './login.service';
export declare class LoginController {
    private loingService;
    constructor(loingService: LoginService);
    ftAuth(): void;
    ftAuthCallback(): void;
}
