
import { Controller, Injectable, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Strategy,  } from 'passport-42';
import { UserService } from 'src/User/user/user.service';
import {UserDto } from './dto/user.dto';

import { LoginService } from './login.service';


@Controller()
export class FtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService ,  private userService : UserService,private loginservice : LoginService ) {
    super({
      clientID: config.get('clientID'),
      clientSecret: config.get('clientSecret'),
      callbackURL: 'http://localhost:3000/42/return',
    });
  }

    async validate( profile: any, cb: any) {

// console.log("===>", request);
        if (!profile)
            return null;
        let userFound: User;
        console.log('===',profile['emails'][0]['value']);
        if ( userFound = await this.userService.GetUserByEmail(profile['emails'][0]['value']))
        {

          console.log('==== imane 7eza9a');
          return cb(null, userFound);
        }
        const user = new UserDto;
        // print avatar
        // console.log('avatar=====',profile['photos'][0]['value']);

        user.fullName = profile['displayName'];
        user.avatar = profile['photos'][0]['value'];
        user.email = profile['emails'][0]['value'];
        user.status = '';
        user.XpPoints = 0;
        user.wins = 0;
        user.loses = 0;
        user.draws = 0;
        user.twoFactorAuthenticationSecret = '';
        user.isTwoFactorAuthenticationEnabled = false;
        user.globaRank = 0;
        user.cover = '';
        user.displayName = '';
        return cb(null, await this.loginservice.createUser(user));
    }
}