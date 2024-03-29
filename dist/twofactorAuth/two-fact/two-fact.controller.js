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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const two_fact_service_1 = require("./two-fact.service");
const jwt_guard_1 = require("../../login/guards/jwt.guard");
const user_service_1 = require("../../User/user/user.service");
const login_service_1 = require("../../login/login.service");
const user_decorator_1 = require("../../login/decorators/user.decorator");
const passport_42_1 = require("passport-42");
const dto_1 = require("../../login/dto");
let TwoFactController = class TwoFactController {
    constructor(twoFactorAuthenticationService, usersService, loginService) {
        this.twoFactorAuthenticationService = twoFactorAuthenticationService;
        this.usersService = usersService;
        this.loginService = loginService;
    }
    async register(response, request) {
        const user = request.user;
        const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(user);
        console.log('===>', user.id);
        return this.twoFactorAuthenticationService.pipeQrCodeStream(response, otpauthUrl);
    }
    async turnOnTwoFactorAuthentication(request, twoFactorAuthenticationCode) {
        const secret = request.user.twoFactorAuthenticationSecret;
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode['code'], secret);
        if (!isCodeValid) {
            throw new common_2.UnauthorizedException('Wrong authentication code');
        }
        await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
    }
    fun() {
        return;
    }
    async authenticate(user, code, request) {
        console.log(code);
        const users = await this.usersService.GetUserByEmail(user.emails[0].value);
        console.log('==', users.id, users.twoFactorAuthenticationSecret);
        const isCodeValid = await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(code.code, users.twoFactorAuthenticationSecret);
        console.log("code=", code.code);
        if (!isCodeValid) {
            console.log("here1");
            throw new common_2.UnauthorizedException('Wrong authentication code');
        }
        const accessTokenCookie = await this.loginService.getCookieWithJwtAccessToken(users.id, true);
        request.res.cookie('Authentication', accessTokenCookie, { httpOnly: true, path: '/' });
        return users;
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('generate'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactController.prototype, "register", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Post)('enable'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TwoFactController.prototype, "turnOnTwoFactorAuthentication", null);
__decorate([
    (0, common_1.Get)('code'),
    (0, common_1.Render)('register'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwoFactController.prototype, "fun", null);
__decorate([
    (0, common_1.Post)('authenticate'),
    __param(0, (0, user_decorator_1.Userr)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object, dto_1.TwoFactorAuthenticationCodeDto, Object]),
    __metadata("design:returntype", Promise)
], TwoFactController.prototype, "authenticate", null);
TwoFactController = __decorate([
    (0, common_1.Controller)('2fa'),
    __metadata("design:paramtypes", [two_fact_service_1.TwoFactService, user_service_1.UserService, login_service_1.LoginService])
], TwoFactController);
exports.TwoFactController = TwoFactController;
//# sourceMappingURL=two-fact.controller.js.map