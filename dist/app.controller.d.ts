import { Profile } from 'passport-42';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { LogDto } from './login/dto';
import { LoginService } from './login/login.service';
export declare class AppController {
    private readonly httpService;
    private loginService;
    constructor(httpService: HttpService, loginService: LoginService);
    home(user: Profile): {
        user: Profile;
    };
    logIn(): void;
    profile(user: Profile): {
        user: Profile;
    };
    logOut(req: Request): void;
    login(dto: LogDto, user: Profile): Promise<{
        access_token: string;
    }>;
}
