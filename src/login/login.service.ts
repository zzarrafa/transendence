import { Injectable, ForbiddenException , Req} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { LogDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { Request, Response } from 'express';
import { User, Prisma } from '@prisma/client';
import TokenPayload from 'src/tokenPayload.interface';
import { UserService } from 'src/User/user/user.service';
import { UserStatus } from 'src/User/user/user_status.enum';
// import { request } from 'http';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService , private userService : UserService) {}

    async login(logDto: LogDto, @Userr() userr: Profile, @Req()request) {
        const users = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        if (users) {
            // console.log("user exist", users.id);
          this.userService.updateStatus(users.id, UserStatus.ONLINE);
            const TokenCookie =  await this.getCookieWithJwtAccessToken(users.id);
            request.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
        }
        else {
          // console.log("not here!");
            let users = await this.prisma.user.create({
                  data: {
                    email: userr.emails[0].value,
                    displayName: '',
                    picture:  userr.photos[0].value,
                    level: 0,
                    status: '',
                    wins: 0,
                    loses: 0,
                    role: 'player',
                    twoFactorAuthenticationSecret: '',
                    isTwoFactorAuthenticationEnabled: false
                },
              });
              this.userService.updateStatus(users.id, UserStatus.ONLINE);
              const TokenCookie =  await this.getCookieWithJwtAccessToken(users.id);
              request.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
      }
    }
    

    
    
    public async getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
      const payload : TokenPayload = { 
        sub : userId, 
        isSecondFactorAuthenticated };
        const token = await this.jwt.signAsync(payload, {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: '30m',
        });
        return token;
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
