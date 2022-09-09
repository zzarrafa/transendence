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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const authenticated_guard_1 = require("./guards/authenticated.guard");
const dto_1 = require("./dto");
const ft_oauth_guard_1 = require("./guards/ft-oauth.guard");
const login_service_1 = require("./login.service");
const user_decorator_1 = require("./decorators/user.decorator");
const passport_42_1 = require("passport-42");
let LoginController = class LoginController {
    constructor(loginService) {
        this.loginService = loginService;
    }
    ftAuth() {
        return;
    }
    ftAuthCallback(user) {
        return;
    }
    logOut(req) {
        req.logOut();
    }
    login(dto, user) {
        return this.loginService.login(dto, user);
    }
};
__decorate([
    (0, common_1.Get)('42'),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "ftAuth", null);
__decorate([
    (0, common_1.Get)('42/return'),
    (0, common_1.UseGuards)(ft_oauth_guard_1.FtOauthGuard),
    (0, common_1.Redirect)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "ftAuthCallback", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.Redirect)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "logOut", null);
__decorate([
    (0, common_1.Get)('user/register'),
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.Userr)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogDto, typeof (_b = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], LoginController.prototype, "login", null);
LoginController = __decorate([
    (0, common_1.Controller)('login'),
    __metadata("design:paramtypes", [login_service_1.LoginService])
], LoginController);
exports.LoginController = LoginController;
//# sourceMappingURL=login.controller.js.map