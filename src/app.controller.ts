import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';
import { Userr } from './login/decorators/user.decorator';
import { Profile } from 'passport-42';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Render('home')
  home(@Userr() user: Profile) {
    return { user };
  }
}
