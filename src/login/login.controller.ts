import { Body, Controller, Get, Post, Redirect, UseGuards, Render, Req} from '@nestjs/common';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LogDto } from './dto';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import {LoginService} from './login.service';
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { HttpService } from '@nestjs/axios';
import { JwtGuard } from './guards/jwt.guard';
@Controller('login')
export class LoginController {
  constructor( private loginService: LoginService){}
  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  ftAuthCallback() {
    return ;
  }

}
