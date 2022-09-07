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
const dto_1 = require("./dto");
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
    async login(logDto, userr) {
        const users = await this.prisma.user.findUnique({
            where: {
                email: userr.emails[0].value,
            },
        });
        if (users) {
            return this.signToken(users.id, users.displayName);
        }
        const userss = await this.prisma.user.findUnique({
            where: {
                displayName: logDto.displayName,
            },
        });
        if (userss) {
            throw new common_1.ForbiddenException('name already used');
        }
        else {
            let users = await this.prisma.user.create({
                data: {
                    email: userr.emails[0].value,
                    displayName: logDto.displayName,
                    picture: this.isEmpty(logDto.picture) ? userr.photos[0].value : logDto.picture,
                    level: 0,
                    status: 'online',
                    wins: 0,
                    loses: 0,
                    role: 'player',
                    twoFactorAuthenticationSecret: '',
                    isTwoFactorAuthenticationEnabled: false
                },
            });
            return this.signToken(users.id, users.displayName);
        }
    }
    async signToken(userId, displayName) {
        const payload = {
            sub: userId,
            displayName,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: secret,
        });
        return {
            access_token: token,
        };
    }
    isEmpty(str) {
        return (!str || str.length === 0);
    }
    getCookieWithJwtAccessToken(userId, isSecondFactorAuthenticated = false) {
        const payload = { userId, isSecondFactorAuthenticated };
        const token = this.jwt.sign(payload, {
            secret: this.config.get('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: '30m',
        });
        return `Authentication=${token}`;
    }
};
__decorate([
    __param(1, (0, user_decorator_1.Userr)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LogDto, typeof (_a = typeof passport_42_1.Profile !== "undefined" && passport_42_1.Profile) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], LoginService.prototype, "login", null);
LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map