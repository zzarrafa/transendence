import { Body, Controller, Get, Post, Redirect, UseGuards, Render, Req} from '@nestjs/common';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LogDto } from './dto';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import {LoginService} from './login.service';
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { UserService } from 'src/User/user/user.service';
import { UserStatus } from 'src/User/user/user_status.enum';
import { JwtGuard } from './guards/jwt.guard';
const logout = require('express-passport-logout');


@Controller('login')
export class LoginController {
  constructor( private loginService: LoginService, private userService : UserService){}
  @Get('42')
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
  // @Redirect('/')
  async logOut(@Req() request) {
    await logout();
    //clear cookie
    request.res.clearCookie('Authentication');
    console.log("logout");
  }

  // hna '/login' ghir ma9dertch nbedel smia hit deja dayraha f  api url callback
  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  login(@Body() dto: LogDto,@Userr() user: Profile, @Req() request) {
    return this.loginService.login(dto,user,request);
    }
}
