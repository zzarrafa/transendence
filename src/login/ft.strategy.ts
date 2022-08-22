import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { config } from 'process';


@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('clientID'),
      clientSecret: config.get('clientSecret'),
      callbackURL: 'http://localhost:3000/login/42/return',
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: VerifyCallback,
  ): Promise<any> {
    request.session.accessToken = accessToken;
    // console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    return cb(null, profile);
  }
 
}
