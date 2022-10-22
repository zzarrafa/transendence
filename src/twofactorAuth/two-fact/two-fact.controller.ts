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
import { JwtGuard } from 'src/login/guards/jwt.guard';
import { UserService } from 'src/User/user/user.service';
import { LoginService } from 'src/login/login.service';
import { Userr } from 'src/login/decorators/user.decorator';
import { Profile } from 'passport-42';
import { TwoFactorAuthenticationCodeDto } from 'src/login/dto';


@Controller('2fa')
export class TwoFactController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactService, private readonly usersService: UserService ,private loginService: LoginService
  
    
  ) { }
  //generate qr code
@UseGuards(JwtGuard)
  @Get('generate')
  async register(@Res() response: Response, @Req() request) {

    const user = request.user;
    const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
    console.log('===>', user.id);
    return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
  }
  // to enable two factor authentication for the first time
@UseGuards(JwtGuard)
  @Post('enable')
  async turnOnTwoFactorAuthentication(
    @Req() request,
    @Body()  twoFactorAuthenticationCode
  ) {
    const secret = request.user.twoFactorAuthenticationSecret;
    const isCodeValid =  await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode['code'], secret);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }
@UseGuards(JwtGuard)
@Post('disable')
async disableTwoFactorAuthentication(@Req() request) {
    await this.usersService.turnOffTwoFactorAuthentication(request.user.id);
  }

// @Get('code')
// @Render('register')
// fun()
// {
//   return;
// }
//  to autenticate users if they have alredy enabled 2fa
  @Post('authenticate')
  async authenticate( @Userr() user: Profile, @Body() code:TwoFactorAuthenticationCodeDto, @Req() request) {
    console.log(code);
    const users = await this.usersService.GetUserByEmail(user.emails[0].value);
    console.log('==', users.id,users.twoFactorAuthenticationSecret);
    const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid( code.code, users.twoFactorAuthenticationSecret);
    console.log("code=",code.code);
    if (!isCodeValid) {
      console.log("here1");
      throw new UnauthorizedException('Wrong authentication code');
    }
    // console.log("here2");
    const accessTokenCookie = await this.loginService.getCookieWithJwtAccessToken(users.id, true);
    request.res.cookie('Authentication', accessTokenCookie, { httpOnly: true, path: '/' });
      return users;
}

}