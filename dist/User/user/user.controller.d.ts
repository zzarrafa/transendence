/// <reference types="multer" />
import { UserService } from './user.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RequestService } from 'src/Friendship/request/request.service';
export declare class UserController {
    private userService;
    private config;
    private request;
    constructor(userService: UserService, config: ConfigService, request: RequestService);
    getAllUsers(req: Request): Promise<{
        displayName: string;
        XpPoints: number;
        avatar: string;
        wins: number;
        loses: number;
        draws: number;
    }[]>;
    getProfile(request: any): Promise<{
        name: string;
        fullName: string;
        wins: number;
        loses: number;
        draws: number;
        avatar: string;
        cover: string;
        JoinedAt: Date;
        friends_count: number;
    }>;
    getProfileById(id: number): Promise<{
        name: string;
        fullName: string;
        wins: number;
        loses: number;
        draws: number;
        avatar: string;
        cover: string;
        JoinedAt: Date;
        friends_count: number;
    }>;
    updateProfilePic(request: any, picture: Express.Multer.File): Promise<import(".prisma/client").User>;
    updateCover(request: any, picture: Express.Multer.File): Promise<import(".prisma/client").User>;
    updateDisplayName(request: any, displayName: any): Promise<import(".prisma/client").User>;
}
