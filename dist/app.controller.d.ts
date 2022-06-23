import { Profile } from 'passport-42';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
export declare class AppController {
    private readonly httpService;
    constructor(httpService: HttpService);
    home(user: Profile): {
        user: Profile;
    };
    logIn(): void;
    profile(user: Profile): {
        user: Profile;
    };
    logOut(req: Request): void;
}
