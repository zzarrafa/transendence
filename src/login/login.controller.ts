import { Body, Controller, Get, Post, Redirect, UseGuards, Render, Req} from '@nestjs/common';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { LogDto } from './dto';
import { FtOauthGuard } from './guards/ft-oauth.guard';
import {LoginService} from './login.service';
import { User } from './user.decorator';
import { Profile } from 'passport-42';
import { HttpService } from '@nestjs/axios';

@Controller('login')
export class LoginController {
  constructor( private loingService: LoginService){}
  @Get('42')
  @UseGuards(FtOauthGuard)
  ftAuth() {
    return;
  }

  @Get('42/return')
  @UseGuards(FtOauthGuard)
  @Redirect('/')
  ftAuthCallback() {
    return;
  }

  // @Get('42')
  // @UseGuards(FtOauthGuard)
  // ftAuth() {
  //   return;
  // }

  
  // @Post('register')
  // @UseGuards(FtOauthGuard)
  // @Render('test')
  // // @Redirect('/')
  // login(@Body() dto: LogDto,@User() user: Profile) {
  //   return this.loingService.login(dto,user);
  // }

  


}
