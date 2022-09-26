import { Controller, Get , Req , UseGuards, Param, ParseIntPipe, Post, UseInterceptors, UploadedFile, Body,ParseFilePipe, MaxFileSizeValidator,FileTypeValidator
    } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { Request, Response } from 'express'
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { ConfigService } from '@nestjs/config';
import { RequestService } from 'src/Friendship/request/request.service';

@Controller()
 @UseGuards(JwtGuard)
export class UserController {
    constructor(private userService: UserService,private config: ConfigService, private request: RequestService) {}
    
    // users sorted by XpPoints
    @Get('users')
    async getAllUsers(@Req() req: Request) {
        // return await this.userService.getAllUsers();
        // sort users by XpPoints
        const users = await this.userService.getAllUsers();
        const sortedUsers = users.sort((a, b) => b.XpPoints - a.XpPoints);
        return sortedUsers;
    }


    
    @Get('profile')
    async getProfile(@Req() request) {
         const user = await this.userService.getUserById(request.user.id);
         const {friends} = await this.request.getFriends(request.user.id);
        const data = {
         "name": user.displayName,
         "fullName": user.fullName,
            "wins": user.wins,
            "loses": user.loses,
            "draws": user.draws,
            "avatar": user.avatar,
            "cover": user.cover,
            "JoinedAt": user.createdAt,
            "friends_count": friends.length,
        }
        return data;
    }
    
    @Get('/profilee/:id')
    async getProfileById(@Param('id', ParseIntPipe) id: number) {
         const {friends} = await this.request.getFriends(id);
         const user = await this.userService.getUserById(id);
        const data = {
            "name": user.displayName,
            "fullName": user.fullName,
               "wins": user.wins,
               "loses": user.loses,
               "draws": user.draws,
               "avatar": user.avatar,
               "cover": user.cover,
               "JoinedAt": user.createdAt,
               "friends_count": friends.length,
        }
        return data;
    }
    // khedama
    
    @Post('update_avatar')
    @UseInterceptors(FileInterceptor('picture',{
        storage: diskStorage({
            destination: './public/uploads',
        }),
    }))
    async updateProfilePic(@Req() request, @UploadedFile(
        new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          new FileTypeValidator({
            fileType: /(gif|jpe?g|tiff?|png|webp|bmp)/,
          }),
        ],
      }), ) picture: Express.Multer.File) {
        // console.log(picture);
        const type = picture.mimetype.split('/')[1];
        fs.rename(picture.path, picture.destination+'/' + request.user.id + '.' +type, function (err) {
            if (err) throw err;
        });
        const path = this.config.get('PICPATH') + request.user.id + '.' +type;
        return this.userService.updaatepicture(request.user.id, path);
    }

    @Post('update_cover')
    @UseInterceptors(FileInterceptor('picture',{
        storage: diskStorage({
            destination: './public/uploads',
        }),
    }))
    async updateCover(@Req() request, @UploadedFile(
        new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2097152 }),
          new FileTypeValidator({
            fileType: /(gif|jpe?g|tiff?|png|webp|bmp)/,
          }),
        ],
      }), ) picture: Express.Multer.File) {
        // console.log(picture);
        const type = picture.mimetype.split('/')[1];
        fs.rename(picture.path, picture.destination+'/' + request.user.displayName
         + '.' +type, function (err) {
            if (err) throw err;
        });
        const path = this.config.get('PICPATH') + request.user.id + '.' +type;
        return this.userService.updaatepicture(request.user.id, path);
    }
    @Post('/displayName')
    async updateDisplayName(@Req() request, @Body()  displayName) {
        return this.userService.UpdateDisplayName(request.user.id, displayName['displayName']);
    }

}
