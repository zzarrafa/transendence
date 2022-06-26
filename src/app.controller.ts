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
import { Userr } from './login/user.decorator';
import { Profile } from 'passport-42';
import { AuthenticatedGuard } from './login/guards/authenticated.guard';
import { HttpService } from '@nestjs/axios';
import { LogDto } from './login/dto';
import {LoginService} from './login/login.service';
import { Request, Response } from 'express';
import {User} from '@prisma/client';
import {PrismaService} from "src/prisma/prisma.service";


@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService, private loginService: LoginService,private prisma: PrismaService) {}

  @Get()
  @Render('home')
  home(@Userr() user: Profile) {
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
  async profile(@Userr() userr : Profile) {
    const user = await this.prisma.user.findUnique({
      where: {
          email: userr.emails[0].value,
      },
  });
    console.log(user.picture);
    return { user };
  }

  @Get('logout')
  @Redirect('/')
  logOut(@Req() req: Request) {
    req.logOut();
  }

  
  @Post('user/register')
  @UseGuards(AuthenticatedGuard)
  @Redirect('/profile')
  login(@Body() dto: LogDto,@Userr() user: Profile, req: Request, rep: Response) {
      return this.loginService.login(dto,user,req,rep);}


  @Get('/hey')
  @UseGuards(AuthenticatedGuard)
  @Render('hey')
  async hey (@Userr() userr : Profile)
  {
    const user = await this.prisma.user.findUnique({
      where: {
          email: userr.emails[0].value,
      },
  });
    return user;
}
}
