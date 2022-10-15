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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const ft_oauth_guard_1 = require("./guards/ft-oauth.guard");
const login_service_1 = require("./login.service");
const user_decorator_1 = require("./decorators/user.decorator");
const passport_42_1 = require("passport-42");
const user_service_1 = require("../User/user/user.service");
const jwt_guard_1 = require("./guards/jwt.guard");
const logout = require('express-passport-logout');
let LoginController = class LoginController {
    constructor(loginService, userService) {
        this.loginService = loginService;
        this.userService = userService;
    }
    ftAuth() {
        return;
    }
    async logOut(request) {
        await logout();
        request.res.clearCookie('Authentication');
        request.res.clearCookie('connect.sid');
        console.log("logout");
    }
    login(user, request, res) {
        return this.loginService.login(user, request, res);
    }
};
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "ftAuth", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "logOut", null);
__decorate([
    (0, common_1.Get)('42/return'),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    (0, common_1.Render)('hey'),
    __param(0, (0, user_decorator_1.Userr)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object, Object, Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "login", null);
LoginController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [login_service_1.LoginService, user_service_1.UserService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map