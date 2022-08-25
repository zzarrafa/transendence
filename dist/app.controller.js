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
const user_decorator_1 = require("./login/decorators/user.decorator");
const passport_42_1 = require("passport-42");
const authenticated_guard_1 = require("./login/guards/authenticated.guard");
const axios_1 = require("@nestjs/axios");
const dto_1 = require("./login/dto");
const login_service_1 = require("./login/login.service");
const get_user_decorator_1 = require("./login/decorators/get-user.decorator");
const prisma_service_1 = require("./prisma/prisma.service");
const common_2 = require("@nestjs/common");
let AppController = class AppController {
    constructor(httpService, loginService, prisma) {
        this.httpService = httpService;
        this.loginService = loginService;
        this.prisma = prisma;
    }
    home(user) {
        return { user };
    }
    logIn() {
        return;
    }
    async profile(userr) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        console.log(user.picture);
        return { user };
    }
    logOut(req) {
        req.logOut();
    }
    login(dto, user) {
        return this.loginService.login(dto, user);
    }
    searrch() {
        return;
    }
    async search(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                displayName: dto.displayName,
            },
        });
        if (user) {
            return user;
        }
        else {
            throw new common_2.ForbiddenException('user not found');
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('home'),
    __param(0, (0, user_decorator_1.Userr)()),
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
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
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
    __param(1, (0, user_decorator_1.Userr)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogDto, typeof (_c = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    (0, common_1.Render)('search'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "searrch", null);
__decorate([
    (0, common_1.Post)('search/user'),
    (0, common_1.UseGuards)(authenticated_guard_1.AuthenticatedGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogDto]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "search", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [axios_1.HttpService, login_service_1.LoginService, prisma_service_1.PrismaService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map