import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: 'f2fb049e379fd41a358e13c7c60a219b5742ca6d0caf2b7ac0875108ccce08b1',
      clientSecret: '54d6980c1a53ce87beeaf44d6596c9a8eabe16bdf317beb305f539fbeb7c5a37',
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
