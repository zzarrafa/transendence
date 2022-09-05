import { Body, Controller, Delete, Get, Post, Param } from '@nestjs/common';
import { UserService } from './user.service';

const users = [
    {
        id: 1,
        name: 'swi3ida',
        username: 'swi3ida',
    },
    {
        id: 2,
        name: 'zwirifa',
        username: 'zwirifa'
    },
    {
        id: 3,
        name: 'hamza',
        username: 'hamza'
    },
    {
        id: 4,
        name: 'youssef',
        username: 'youssef'
    }
]

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}
    @Post('create')
    createManyUsers() {
        return this.userService.createManyUsers(users);
    }

    @Get('users')
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('/:username')
    getUserByUsername(@Param('username') username) {
        return this.userService.getUserByUsername(username);
    }

    @Delete('delete')
    deleteAllUsers() {
        return this.userService.deleteAllUsers();
    }
}
