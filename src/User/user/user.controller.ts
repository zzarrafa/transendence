import { Controller, Get , Req , UseGuards, Param, ParseIntPipe, Post, UseInterceptors, UploadedFile, Body} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { Request, Response } from 'express'
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';

@Controller()
 @UseGuards(JwtGuard)
export class UserController {
    constructor(private userService: UserService,private config: ConfigService) {}
    
    @Get('users')
    async getAllUsers(@Req() req: Request) {
        return this.userService.getAllUsers();
    }


    
    @Get('profile')
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
    
    @Post('profile/picture/')
    @UseInterceptors(FileInterceptor('picture',{
        storage: diskStorage({
            destination: './public/uploads',
        }),
    }))
    async updateProfilePic(@Req() request, @UploadedFile( ) picture: Express.Multer.File) {
        // console.log(picture);
        const type = picture.mimetype.split('/')[1];
        fs.rename(picture.path, picture.destination+'/' + request.user.id + '.' +type, function (err) {
            if (err) throw err;
        });
        const path = this.config.get('PICPATH') + request.user.id + '.' +type;
        return this.userService.updaatepicture(request.user.id, path);
    }

    @Post('profile/displayName')
    async updateDisplayName(@Req() request, @Body()  displayName) {
        return this.userService.UpdateDisplayName(request.user.id, displayName['displayName']);
    }

}
