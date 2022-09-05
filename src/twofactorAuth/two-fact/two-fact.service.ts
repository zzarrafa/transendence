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
// hadchi khedam 
  public async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, secret: string): Promise<boolean> {

    return await authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret :secret
  });
  
  }
}
