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
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const user_decorator_1 = require("./decorators/user.decorator");
const passport_42_1 = require("passport-42");
let LoginService = class LoginService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async login(userr, request, res) {
        const users = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        if (users) {
            if (users.isTwoFactorAuthenticationEnabled) {
                res.redirect("http://localhost:3000/2fa/code");
            }
            else {
                console.log('here');
                const TokenCookie = await this.getCookieWithJwtAccessToken(users.id);
                request.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
            }
        }
        else {
            let users = await this.prisma.user.create({
                data: {
                    email: userr.emails[0].value,
                    displayName: '',
                    fullName: userr.displayName,
                    avatar: userr.photos[0].value,
                    XpPoints: 0,
                    status: '',
                    wins: 0,
                    globaRank: 0,
                    cover: '',
                    loses: 0,
                    draws: 0,
                    twoFactorAuthenticationSecret: '',
                    isTwoFactorAuthenticationEnabled: false
                },
            });
            const TokenCookie = await this.getCookieWithJwtAccessToken(users.id);
            request.res.cookie('Authentication', TokenCookie, { httpOnly: true, path: '/' });
        }
    }
    async getCookieWithJwtAccessToken(userId, isSecondFactorAuthenticated = false) {
        const payload = {
            sub: userId,
            isSecondFactorAuthenticated
        };
        const token = await this.jwt.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: '7d',
        });
        return token;
    }
};
__decorate([
    __param(0, (0, user_decorator_1.Userr)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LoginService.prototype, "login", null);
LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map