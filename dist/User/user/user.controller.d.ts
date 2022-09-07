import { UserService } from './user.service';
import { Request } from 'express';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
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
}
