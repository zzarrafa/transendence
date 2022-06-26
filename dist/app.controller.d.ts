import { Profile } from 'passport-42';
import { HttpService } from '@nestjs/axios';
import { LogDto } from './login/dto';
import { LoginService } from './login/login.service';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { PrismaService } from "src/prisma/prisma.service";
export declare class AppController {
    private readonly httpService;
    private loginService;
    private prisma;
    constructor(httpService: HttpService, loginService: LoginService, prisma: PrismaService);
    home(user: Profile): {
        user: Profile;
    };
    logIn(): void;
    profile(userr: Profile): Promise<{
        user: User;
    }>;
    logOut(req: Request): void;
    login(dto: LogDto, user: Profile, req: Request, rep: Response): Promise<{
        access_token: string;
    }>;
    hey(userr: Profile): Promise<User>;
}
