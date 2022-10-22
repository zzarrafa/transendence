import { Body, Controller, Get, UseGuards, Req} from '@nestjs/common';

import { FtOauthGuard } from './guards/ft-oauth.guard';
import {LoginService} from './login.service';
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { JwtGuard } from './guards/jwt.guard';

const logout = require('express-passport-logout');


@Controller()
export class LoginController {
  constructor( private loginService: LoginService){}
 
  
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
  // @Render('hey')
  async login(@Userr() user: Profile, @Req() request)   {
    return await this.loginService.login(user,request);
    }
}
