import { Injectable, ForbiddenException} from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { LogDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Userr } from './decorators/user.decorator';
import { Profile } from 'passport-42';
import { Request, Response } from 'express';

@Injectable()
export class LoginService {
//     constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService ) {}

//     async login(logDto: LogDto, @Userr() userr: Profile) {
//         const users = await this.prisma.user.findUnique({
//             where: {
//                 email: userr.emails[0].value,
//             },
//         });
//         if (users) {
//           // console.log(users.displayName);
//             throw new ForbiddenException('already exist');
//         }
//         const userss = await this.prisma.user.findUnique({
//           where: {
//               displayName: logDto.displayName,
//           },
//       });
//       if (userss)
//       {
//         throw new ForbiddenException('name already used');

//       }
//         else {
//           // console.log("not here!");
//             let users = await this.prisma.user.create({
//                 data: {
//                     displayName: logDto.displayName,
//                     picture: this.isEmpty(logDto.picture) ? userr.photos[0].value: logDto.picture,
//                     email: userr.emails[0].value,
//                     fullName: userr.displayName,
//                     login: userr.username,
//                     // twoFactorAuthenticationSecret: null,
                    
//                 },
//               });
           
//         return this.signToken(users.id,users.displayName);
//       }
//     }
// async isRegisterd( @Userr() userr: Profile ) 
// {
//     const user =  await this.prisma.user.findUnique({
//       where: {
//           email: userr.emails[0].value,
//       },
//     });
//     if (user)
//     {
//       return true;
//     }
//     else 
//     {
//       return false;
//     }
// }
    

//     async signToken(userId: number,displayName: string,): Promise<{ access_token: string }> {
//         const payload = {
//           sub: userId,
//           displayName,
//         };
//         const secret = this.config.get('JWT_SECRET');
    
//         const token = await this.jwt.signAsync(
//           payload,
//           {
//             expiresIn: '15m',
//             secret: secret,
//           },
//         );
          
//         return {
//           access_token: token,
//         };
//       }

//       isEmpty(str: string) {
//         return (!str || str.length === 0 );}
}
