import { Body, Controller, Get, Post, Redirect, UseGuards, Render, Req, Res} from '@nestjs/common';

import { FtOauthGuard } from './guards/ft-oauth.guard';
import {LoginService} from './login.service';
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { UserService } from 'src/User/user/user.service';
import { UserStatus } from 'src/User/user/user_status.enum';
import { JwtGuard } from './guards/jwt.guard';
const logout = require('express-passport-logout');


@Controller()
export class LoginController {
  constructor( private loginService: LoginService, private userService : UserService){}
  @Get('login')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  // @Get('42/return')
  // @UseGuards(FtOauthGuard)
  // @Redirect('/')
  // ftAuthCallback(user : Profile) {
  //   return ;
  // }

  
  @Get('logout')
  @UseGuards(JwtGuard)
  async logOut(@Req() request) {
    await logout();
    //clear cookie
    request.res.clearCookie('Authentication');
    request.res.clearCookie('connect.sid');
    console.log("logout");
  }

  
  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Render('hey')
  login(@Userr() user: Profile, @Req() request, @Res() res) {
    return this.loginService.login(user,request, res);
    }
}
