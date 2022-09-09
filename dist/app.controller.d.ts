import { Profile } from 'passport-42';
import { HttpService } from '@nestjs/axios';
import { LoginService } from './login/login.service';
import { PrismaService } from "src/prisma/prisma.service";
export declare class AppController {
    private readonly httpService;
    private loginService;
    private prisma;
    constructor(httpService: HttpService, loginService: LoginService, prisma: PrismaService);
    home(user: Profile): {
        user: Profile;
    };
}
