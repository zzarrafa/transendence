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
import { Userr } from './login/decorators/user.decorator';
import { Profile } from 'passport-42';
import { AuthenticatedGuard } from './login/guards/authenticated.guard';
import { HttpService } from '@nestjs/axios';
import { LogDto } from './login/dto';
import {LoginService} from './login/login.service';
import { Request, Response } from 'express';
import {User} from '@prisma/client';
import { GetUser } from './login/decorators/get-user.decorator';
import {PrismaService} from "src/prisma/prisma.service";
import { ForbiddenException } from '@nestjs/common';
import { UserService } from './User/user/user.service';


@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService, private loginService: LoginService,private prisma: PrismaService) {}

  @Get()
  @Render('home')
  home(@Userr() user: Profile) {
    return { user };
  }
}
