import {
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Body,
  Get,
  Render,
}
  from '@nestjs/common';
import {UnauthorizedException} from '@nestjs/common';
import { TwoFactService } from './two-fact.service';
import { Response } from 'express';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { UserService } from 'src/User/user/user.service';
import { TwoFactorAuthenticationCodeDto } from "src/login/dto";



@Controller('2fa')
export class TwoFactController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactService, private readonly usersService: UserService
    
  ) { }
  @UseGuards(JwtGuard)
  @Post('generate')
  async register(@Res() response: Response, @Req() request) {

    const user = request.user;
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
    //console.log('current user ', user, ' from request ', request);

    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
  }
  @UseGuards(JwtGuard)
  @Post('enable')
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Body()  twoFactorAuthenticationCode
  ) {
    const user = request.user;
    console.log('===>',twoFactorAuthenticationCode);
    const isCodeValid =  this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode, user);
    console.log('===> valid ',isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication coderr');
    }
    await this.usersService.turnOnTwoFactorAuthentication(user.id);
  }
}