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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async getAllUsers() {
        let user = this.prisma;
        return await this.prisma.user.findMany({
            select: {
                displayName: true,
                XpPoints: true,
                avatar: true,
                wins: true,
                loses: true,
                draws: true,
            },
        });
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        return user;
    }
    async GetUserByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            return null;
        }
        return user;
    }
    async UpdateDisplayName(id, displayName) {
        const user = await this.prisma.user.findUnique({
            where: {
                displayName: displayName,
            },
        });
        if (user) {
            throw new common_1.NotFoundException('display name already used');
        }
        else {
            const user = await this.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    displayName: displayName,
                },
            });
            return user;
        }
    }
    async getWins(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        return user.wins;
    }
    async getDraws(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        return user.draws;
    }
    async getLoses(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        return user.loses;
    }
    async getXp(id) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('user not found');
        }
        return user.XpPoints;
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.update({
            where: {
                id: id,
            },
            data: {
                status: status,
            },
        });
        return user;
    }
    async updaatepicture(id, avatar) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                avatar,
            },
        });
        return user;
    }
    async incrementWins(id) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                wins: {
                    increment: 1,
                },
            },
        });
    }
    async incrementDraws(id) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                draws: {
                    increment: 1,
                },
            },
        });
    }
    async incrementLoses(id) {
        const user = await this.prisma.user.update({
            where: {
                id,
            },
            data: {
                loses: {
                    increment: 1,
                },
            },
        });
    }
    async setTwoFactorAuthenticationSecret(secret, userId) {
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                twoFactorAuthenticationSecret: secret,
            },
        });
    }
    async turnOnTwoFactorAuthentication(userId) {
        return await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                isTwoFactorAuthenticationEnabled: true,
            },
        });
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map