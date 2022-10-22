import { Injectable, ForbiddenException , Req, Res} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import TokenPayload from 'src/login/jwt/tokenPayload.interface';
import { UserDto } from './dto/user.dto';


// import { request } from 'http';

@Injectable()
export class LoginService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService )  {}
   
    
async createUser(user: UserDto) {

    const userFound = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (userFound) {
      throw new ForbiddenException('Email already exists');
    }

    let newuser = await this.prisma.user.create({
      data: user,
    });
    
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