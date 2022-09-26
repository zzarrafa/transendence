import { Injectable, ForbiddenException , Req, Res} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import TokenPayload from 'src/login/jwt/tokenPayload.interface';


// import { request } from 'http';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

    async login( @Userr() userr: Profile, @Req()request, @Res() res) {
        const users = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        if (users) {
            // console.log("user exist", users.id);
        
            if (users.isTwoFactorAuthenticationEnabled)
            {
              res.redirect("http://localhost:3000/2fa/code");
            }
            else
            {
              
              console.log('here');
            const TokenCookie =  await this.getCookieWithJwtAccessToken(users.id);
            request.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
            }
        
      
        }
        else {
          // console.log("not here!");
            let users = await this.prisma.user.create({
                  data: {
                    email: userr.emails[0].value,
                    displayName: '',
                    fullName: userr.displayName,
                    avatar:  userr.photos[0].value,
                    XpPoints: 0,
                    status: '',
                    wins: 0,
                    globaRank: 0,
                    cover: '',
                    loses: 0,
                    draws: 0,
                    twoFactorAuthenticationSecret: '',
                    isTwoFactorAuthenticationEnabled: false
                },
              });
          
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
          expiresIn: '7d',
        });
        return token;
      }
    }