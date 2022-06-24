import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  UseGuards,
  Session,
  Post,
  Body,
} from '@nestjs/common';
import { User } from './login/user.decorator';
import { Profile } from 'passport-42';
import { AuthenticatedGuard } from './login/guards/authenticated.guard';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { LogDto } from './login/dto';
import {LoginService} from './login/login.service';


@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService, private loginService: LoginService) {}

  @Get()
  @Render('home')
  home(@User() user: Profile) {
    return { user };
  }

  @Get('login')
  @Render('login')
  logIn() {
    return;
  }

  @Get('profile')
  @UseGuards(AuthenticatedGuard)
  @Render('profile')
  profile(@User() user: Profile) {
    return { user };
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    req.logOut();
  }

  
  
  @Post('user/register')
  @UseGuards(AuthenticatedGuard)
  login(@Body() dto: LogDto,@User() user: Profile) {
    console.log('ok');
      return this.loginService.login(dto,user);}
}
