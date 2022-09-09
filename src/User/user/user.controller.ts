import { Controller, Get , Req , UseGuards, Param, ParseIntPipe, Post, UseInterceptors, UploadedFile, Body} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { Request, Response } from 'express'
import fs from 'fs';

@Controller()
export class UserController {
    constructor(private userService: UserService) {}
    @UseGuards(JwtGuard)
    @Get('users')
    async getAllUsers(@Req() req: Request) {
        return this.userService.getAllUsers();
    }


    @UseGuards(JwtGuard)
    @Get('profilee')
    async getProfile(@Req() request) {
         const user = this.userService.getUserById(request.user.id);
        const data = {
         "name": (await user).displayName,
            "wins": await this.userService.getWins(request.user.id),
            "loses": await this.userService.getLoses(request.user.id),
            // friends and achievements and blocked users and requests
        }
        return data;
    }
    @UseGuards(JwtGuard)
    @Get('/profilee/:id')
    async getProfileById(@Req() request,@Param('id', ParseIntPipe) id: number) {
        const user = this.userService.getUserById(id);
        const data = {
            "name": (await user).displayName,
            "wins": await this.userService.getWins(id),
            "loses": await this.userService.getLoses(id),
            // friends and achievements and blocked users and requests
        }
        return data;
    }
    // mzl matestithach
    @UseGuards(JwtGuard)
    @Post('profilee/picture/:imageName')
    @UseInterceptors(FileInterceptor('picture'))
    async updateProfilePic(@Req() request, @Param('imageName') imageName : string, @UploadedFile() picture: Express.Multer.File,  ) {
        fs.writeFileSync(process.cwd() + "/public/" + imageName, picture.buffer)
        return this.userService.updaatepicture(request.user.id, imageName);
    }

    @UseGuards(JwtGuard)
    @Post('profilee/displayName')
    async updateDisplayName(@Req() request, @Body()  displayName) {
        return this.userService.UpdateDisplayName(request.user.id, displayName['displayName']);
    }


}
