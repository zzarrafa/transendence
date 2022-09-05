import { Injectable, ForbiddenException} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { LogDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { Request, Response } from 'express';
import { User, Prisma } from '@prisma/client';
import TokenPayload from 'src/tokenPayload.interface';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

    async login(logDto: LogDto, @Userr() userr: Profile) {
        const users = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        if (users) {
          // console.log(users.displayName);
            return this.getCookieWithJwtAccessToken(users.id);
        }
        const userss = await this.prisma.user.findUnique({
          where: {
              displayName: logDto.displayName,
          },
      });
      if (userss)
      {
        throw new ForbiddenException('name already used');

      }
        else {
          // console.log("not here!");
            let users = await this.prisma.user.create({
                  data: {
                    email: userr.emails[0].value,
                    displayName: logDto.displayName,
                    picture: this.isEmpty(logDto.picture) ? userr.photos[0].value: logDto.picture,
                    level: 0,
                    status: 'online',
                    wins: 0,
                    loses: 0,
                    role: 'player',
                    twoFactorAuthenticationSecret: '',
                    isTwoFactorAuthenticationEnabled: false
                },
              });
           
        return this.getCookieWithJwtAccessToken(users.id);
      }
    }
    

    // async signToken(userId: number,displayName: string,): Promise<{ access_token: string }> {
    //     const payload = {
    //       sub: userId,
    //       displayName,
    //     };
    //     const secret = this.config.get('JWT_SECRET');
    
    //     const token = await this.jwt.signAsync(
    //       payload,
    //       {
    //         expiresIn: '30m',
    //         secret: secret,
    //       },
    //     );
        
    //     return {
    //       access_token: token,
    //     };
    //   }

      isEmpty(str: string) {
        return (!str || str.length === 0 );}


        public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
          const payload : TokenPayload = { userId, isSecondFactorAuthenticated };
          const token = this.jwt.sign(payload, {
            secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '30m',
          });
          return `Authentication=${token}`;
        }
}




