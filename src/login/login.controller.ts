import { Body, Controller, Get, Post, Redirect, UseGuards, Render, Request,Req, Res} from '@nestjs/common';

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
  constructor( private loginService: LoginService){}
  @Get('42/return')
  @UseGuards(FtOauthGuard)
  async login(@Request() req) {

    console.log('***', req.user.isTwoFactorAuthenticationEnabled);
    if (req.user.isTwoFactorAuthenticationEnabled) {
      //rediret to 2fa/authenticate
      req.res.redirect('/2fa/authenticate');
      return req.user;
    }
    const TokenCookie =  await this.loginService.getCookieWithJwtAccessToken(req.user.id);
    req.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
    return req.user;
  }
 



  @Get('logout')
  @UseGuards(JwtGuard)
  async logOut(@Req() request) {
    await logout();
    //clear cookie
    request.res.clearCookie('Authentication');
    console.log("logout");
  }

}
