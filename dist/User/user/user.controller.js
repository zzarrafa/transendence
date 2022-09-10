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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const user_service_1 = require("./user.service");
const jwt_guard_1 = require("../../login/guards/jwt.guard");
const fs = require("fs");
const multer_1 = require("multer");
const config_1 = require("@nestjs/config");
let UserController = class UserController {
    constructor(userService, config) {
        this.userService = userService;
        this.config = config;
    }
    async getAllUsers(req) {
        return this.userService.getAllUsers();
    }
    async getProfile(request) {
        const user = this.userService.getUserById(request.user.id);
        const data = {
            "name": (await user).displayName,
            "wins": await this.userService.getWins(request.user.id),
            "loses": await this.userService.getLoses(request.user.id),
        };
        return data;
    }
    async getProfileById(request, id) {
        const user = this.userService.getUserById(id);
        const data = {
            "name": (await user).displayName,
            "wins": await this.userService.getWins(id),
            "loses": await this.userService.getLoses(id),
        };
        return data;
    }
    async updateProfilePic(request, picture) {
        const type = picture.mimetype.split('/')[1];
        fs.rename(picture.path, picture.destination + '/' + request.user.id + '.' + type, function (err) {
            if (err)
                throw err;
        });
        const path = this.config.get('PICPATH') + request.user.id + '.' + type;
        return this.userService.updaatepicture(request.user.id, path);
    }
    async updateDisplayName(request, displayName) {
        return this.userService.UpdateDisplayName(request.user.id, displayName['displayName']);
    }
};
__decorate([
    (0, common_1.Get)('users'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('/profilee/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfileById", null);
__decorate([
    (0, common_1.Post)('profile/picture/'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('picture', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads',
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfilePic", null);
__decorate([
    (0, common_1.Post)('profile/displayName'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateDisplayName", null);
UserController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __metadata("design:paramtypes", [user_service_1.UserService, config_1.ConfigService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map