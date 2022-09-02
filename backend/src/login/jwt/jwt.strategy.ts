import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
// import { AuthService } from './auth.service';
import {ConfigService} from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,) {
  constructor(config: ConfigService,private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload:{
    sub: number;
    displayName: string;
  }
    ) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

    return user;
  }

}