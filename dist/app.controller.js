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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const user_decorator_1 = require("./login/user.decorator");
const passport_42_1 = require("passport-42");
const authenticated_guard_1 = require("./login/guards/authenticated.guard");
const axios_1 = require("@nestjs/axios");
const dto_1 = require("./login/dto");
const login_service_1 = require("./login/login.service");
let AppController = class AppController {
    constructor(httpService, loginService) {
        this.httpService = httpService;
        this.loginService = loginService;
    }
    home(user) {
        return { user };
    }
    logIn() {
        return;
    }
    profile(user) {
        return { user };
    }
    logOut(req) {
        req.logOut();
    }
    login(dto, user) {
        console.log('ok');
        return this.loginService.login(dto, user);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('home'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "home", null);
__decorate([
    (0, common_1.Get)('login'),
    (0, common_1.Render)('login'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "logIn", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Render)('profile'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "profile", null);
__decorate([
    (0, common_1.Get)('logout'),
    (0, common_1.Redirect)('/'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "logOut", null);
__decorate([
    (0, common_1.Post)('user/register'),
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogDto, typeof (_c = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService, login_service_1.LoginService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map