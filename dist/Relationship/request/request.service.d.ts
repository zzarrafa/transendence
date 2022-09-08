import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class RequestService {
    private prisma;
    constructor(prisma: PrismaService);
    addFriend(user: User, friendId: number): Promise<User>;
    removeFriend(user: User, friendId: number): Promise<User>;
    getFriends(user: User): Promise<{
        friends: User[];
    }>;
}
