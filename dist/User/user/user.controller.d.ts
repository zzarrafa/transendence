/// <reference types="multer" />
import { UserService } from './user.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class UserController {
    private userService;
    private config;
    constructor(userService: UserService, config: ConfigService);
    getAllUsers(req: Request): Promise<{
        displayName: string;
        email: string;
    }[]>;
    getProfile(request: any): Promise<{
        name: string;
        wins: number;
        loses: number;
    }>;
    getProfileById(request: any, id: number): Promise<{
        name: string;
        wins: number;
        loses: number;
    }>;
    updateProfilePic(request: any, picture: Express.Multer.File): Promise<import(".prisma/client").User>;
    updateDisplayName(request: any, displayName: any): Promise<import(".prisma/client").User>;
}
