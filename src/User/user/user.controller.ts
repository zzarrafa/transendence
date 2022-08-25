import { Controller, Get , Req , UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { Request, Response } from 'express'

@Controller()
export class UserController {
    constructor(private userService: UserService) {}
    @UseGuards(JwtGuard)
    @Get('users')
    async getAllUsers(@Req() req: Request) {
        return this.userService.getAllUsers();
    }
}
