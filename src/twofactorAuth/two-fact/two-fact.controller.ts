import {
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  Body,
  Get,
}
  from '@nestjs/common';
import {UnauthorizedException} from '@nestjs/common';
import { TwoFactService } from './two-fact.service';
import { Response } from 'express';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { UserService } from 'src/User/user/user.service';
import { LoginService } from 'src/login/login.service';



@Controller('2fa')
@UseGuards(JwtGuard)
export class TwoFactController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactService, private readonly usersService: UserService ,private loginService: LoginService
  
    
  ) { }
// @UseGuards(JwtGuard)
  @Get('generate')
  async register(@Res() response: Response, @Req() request) {

    const user = request.user;
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
    
    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
  }
  
  @Post('enable')
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Body()  twoFactorAuthenticationCode
  ) {
    const secret = request.user.twoFactorAuthenticationSecret;
    // console.log('===>',  twoFactorAuthenticationCode['code'], secret);
    const isCodeValid =  await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode['code'], secret);
    // console.log('===> valid ',isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('authenticate')
  async authenticate( @Req() request, @Body() twoFactorAuthenticationCode) {
    const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid( twoFactorAuthenticationCode['code'], request.user.twoFactorAuthenticationSecret);

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = this.loginService.getCookieWithJwtAccessToken(request.user.id, true);
    request.res.cookie('Authentication', accessTokenCookie, { httpOnly: true, path: '/' });
    return request.user;
}

}