import { Injectable, UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/User/user/user.service';
import { User } from '@prisma/client';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import { TwoFactorAuthenticationCodeDto } from "src/login/dto";

@Injectable()
export class TwoFactService {
  constructor(
    private readonly usersService: UserService,
    private readonly configService: ConfigService
  ) { }

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl
    }
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: TwoFactorAuthenticationCodeDto, user: User) : Boolean {
    console.log('===> ', user.twoFactorAuthenticationSecret, ' code ', twoFactorAuthenticationCode.code);

    return  authenticator.verify({
      token: twoFactorAuthenticationCode.code,
      secret: user.twoFactorAuthenticationSecret
    });

    // if (!isValid) {
    //   return new UnauthorizedException('Wrong authentication code');

    // }
  }
}
