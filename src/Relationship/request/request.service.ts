import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RequestService {
    constructor(private prisma : PrismaService, ) {}

    async addFriend(user : User, friendId: number) {
        const request = await this.prisma.relationship.create({
            data: {
                receiver: friendId,
                senderId: user.id,
                status: 'friend',
            },
    })

    // add user to friend list
    const friend = await this.prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            friends: { connect: { id: friendId } },
        },
    })
    return friend;
}

async removeFriend(user : User, friendId: number) {
    // const request = await this.prisma.relationship.delete({
    //     where: {
    //         senderId: user.id, //machi unique 
    //     },
    // })

    // remove user from friend list
    const friend = await this.prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            friends: { disconnect: { id: friendId } },
        },
    })
    return friend;
}

// get friends
async getFriends(user : User) {
    const friends = await this.prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            friends: true,
        },
    })
    return friends;
}
}