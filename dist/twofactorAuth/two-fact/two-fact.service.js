"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const config_1 = require("@nestjs/config");
const user_service_1 = require("../../User/user/user.service");
const qrcode_1 = require("qrcode");
let TwoFactService = class TwoFactService {
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    async generateTwoFactorAuthenticationSecret(user) {
        const secret = otplib_1.authenticator.generateSecret();
        const otpauthUrl = otplib_1.authenticator.keyuri(user.email, this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'), secret);
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {
            secret,
            otpauthUrl
        };
    }
    async pipeQrCodeStream(stream, otpauthUrl) {
        return (0, qrcode_1.toFileStream)(stream, otpauthUrl);
    }
    isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode, user) {
        console.log('===> ', user.twoFactorAuthenticationSecret, ' code ', twoFactorAuthenticationCode.code);
        return otplib_1.authenticator.verify({
            token: twoFactorAuthenticationCode.code,
            secret: user.twoFactorAuthenticationSecret
        });
    }
};
TwoFactService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        config_1.ConfigService])
], TwoFactService);
exports.TwoFactService = TwoFactService;
//# sourceMappingURL=two-fact.service.js.map