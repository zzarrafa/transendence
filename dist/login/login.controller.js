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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const ft_oauth_guard_1 = require("./guards/ft-oauth.guard");
const login_service_1 = require("./login.service");
const jwt_guard_1 = require("./guards/jwt.guard");
const logout = require('express-passport-logout');
let LoginController = class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }
    async signUp(req) {
        console.log('***', req.user.isTwoFactorAuthenticationEnabled);
        if (req.user.isTwoFactorAuthenticationEnabled) {
            req.res.redirect('/2fa/authenticate');
            console.log('user existttt');
            return req.user;
        }
        const TokenCookie = await this.loginService.getCookieWithJwtAccessToken(req.user.id);
        req.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
        return req.user;
    }
    async logOut(request) {
        await logout();
        request.res.clearCookie('Authentication');
        console.log("logout");
    }
};
__decorate([
    (0, common_1.Get)('42/return'),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "signUp", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "logOut", null);
LoginController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map