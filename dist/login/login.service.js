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
exports.LoginService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let LoginService = class LoginService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async createUser(user) {
        const userFound = await this.prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });
        if (userFound) {
            throw new common_1.ForbiddenException('Email already exists');
        }
        let newuser = await this.prisma.user.create({
            data: user,
        });
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
LoginService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService, config_1.ConfigService])
], LoginService);
exports.LoginService = LoginService;
//# sourceMappingURL=login.service.js.map